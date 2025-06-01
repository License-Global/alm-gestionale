import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Card,
  CardContent,
  CardActions,
  Fab,
  Breadcrumbs,
  Link,
  Alert,
  CircularProgress,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Add as AddIcon,
  Folder as FolderIcon,
  PictureAsPdf as PdfIcon,
  Upload as UploadIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  Home as HomeIcon,
  CreateNewFolder as CreateNewFolderIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import WidgetCard from "../components/Widgets/WidgetCard";
import { supabase } from "../supabase/supabaseClient";
import useSession from "../hooks/useSession";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit

const Documenti = () => {
  const session = useSession();
  const userId = session?.session?.user?.id;

  const [currentPath, setCurrentPath] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [createFolderDialog, setCreateFolderDialog] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [uploadDialog, setUploadDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editDialog, setEditDialog] = useState(false);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    if (userId) {
      loadItems();
    }
  }, [userId, currentPath]);

  const loadItems = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.storage
        .from(userId)
        .list(currentPath || undefined, {
          limit: 100,
          offset: 0,
        });

      if (error) throw error;
      setItems(data || []);
    } catch (err) {
      setError("Errore nel caricamento dei documenti: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const createFolder = async () => {
    if (!newFolderName.trim()) return;

    try {
      const folderPath = currentPath
        ? `${currentPath}/${newFolderName}/.keep`
        : `${newFolderName}/.keep`;

      const { error } = await supabase.storage
        .from(userId)
        .upload(folderPath, new Blob([""], { type: "text/plain" }));

      if (error) throw error;

      setSuccess("Cartella creata con successo!");
      setCreateFolderDialog(false);
      setNewFolderName("");
      loadItems();
    } catch (err) {
      setError("Errore nella creazione della cartella: " + err.message);
    }
  };

  const uploadFile = async () => {
    if (!selectedFile) return;

    if (selectedFile.size > MAX_FILE_SIZE) {
      setError("Il file è troppo grande. Massimo 10MB consentiti.");
      return;
    }

    if (selectedFile.type !== "application/pdf") {
      setError("Solo file PDF sono consentiti.");
      return;
    }

    try {
      const filePath = currentPath
        ? `${currentPath}/${selectedFile.name}`
        : selectedFile.name;

      const { error } = await supabase.storage
        .from(userId)
        .upload(filePath, selectedFile);

      if (error) throw error;

      setSuccess("File caricato con successo!");
      setUploadDialog(false);
      setSelectedFile(null);
      loadItems();
    } catch (err) {
      setError("Errore nel caricamento del file: " + err.message);
    }
  };

  const deleteItem = async (item) => {
    try {
      const itemPath = currentPath ? `${currentPath}/${item.name}` : item.name;

      if (item.metadata?.mimetype) {
        // It's a file
        const { error } = await supabase.storage
          .from(userId)
          .remove([itemPath]);
        if (error) throw error;
      } else {
        // It's a folder - remove all contents
        const { data: folderContents } = await supabase.storage
          .from(userId)
          .list(itemPath);

        if (folderContents && folderContents.length > 0) {
          const filesToDelete = folderContents.map(
            (file) => `${itemPath}/${file.name}`
          );
          const { error } = await supabase.storage
            .from(userId)
            .remove(filesToDelete);
          if (error) throw error;
        }
      }

      setSuccess("Elemento eliminato con successo!");
      loadItems();
    } catch (err) {
      setError("Errore nell'eliminazione: " + err.message);
    }
    setAnchorEl(null);
  };

  const renameItem = async () => {
    if (!editName.trim() || !selectedItem) return;

    try {
      const oldPath = currentPath
        ? `${currentPath}/${selectedItem.name}`
        : selectedItem.name;
      const newPath = currentPath ? `${currentPath}/${editName}` : editName;

      // Only allow renaming files, not folders
      if (selectedItem.metadata?.mimetype) {
        const { data: fileData } = await supabase.storage
          .from(userId)
          .download(oldPath);

        if (fileData) {
          await supabase.storage.from(userId).upload(newPath, fileData);

          await supabase.storage.from(userId).remove([oldPath]);
        }
      }

      setSuccess("Elemento rinominato con successo!");
      setEditDialog(false);
      setEditName("");
      loadItems();
    } catch (err) {
      setError("Errore nella rinomina: " + err.message);
    }
  };

  const navigateToFolder = (folderName) => {
    const newPath = currentPath ? `${currentPath}/${folderName}` : folderName;
    setCurrentPath(newPath);
  };

  const navigateUp = () => {
    const pathParts = currentPath.split("/");
    pathParts.pop();
    setCurrentPath(pathParts.join("/"));
  };

  const navigateToPath = (index) => {
    const pathParts = currentPath.split("/");
    const newPath = pathParts.slice(0, index + 1).join("/");
    setCurrentPath(newPath);
  };

  const downloadFile = async (fileName) => {
    try {
      const filePath = currentPath ? `${currentPath}/${fileName}` : fileName;
      const { data, error } = await supabase.storage
        .from(userId)
        .download(filePath);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError("Errore nel download: " + err.message);
    }
  };

  const pathParts = currentPath ? currentPath.split("/") : [];

  return (
    <WidgetCard title={"Gestione Documenti"}>
      <Box sx={{ p: 3 }}>
        {error && (
          <Alert severity="error" onClose={() => setError("")} sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert
            severity="success"
            onClose={() => setSuccess("")}
            sx={{ mb: 2 }}
          >
            {success}
          </Alert>
        )}

        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link
            component="button"
            variant="body1"
            onClick={() => setCurrentPath("")}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Home
          </Link>
          {pathParts.map((part, index) => (
            <Link
              key={index}
              component="button"
              variant="body1"
              onClick={() => navigateToPath(index)}
            >
              {part}
            </Link>
          ))}
        </Breadcrumbs>

        {/* Action Buttons */}
        <Box sx={{ mb: 3, display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<CreateNewFolderIcon />}
            onClick={() => setCreateFolderDialog(true)}
          >
            Nuova Cartella
          </Button>
          <Button
            variant="outlined"
            startIcon={<UploadIcon />}
            onClick={() => setUploadDialog(true)}
          >
            Carica PDF
          </Button>
        </Box>

        {/* Content Grid */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={2}>
            <AnimatePresence>
              {items.map((item, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={item.name}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card
                      sx={{
                        cursor: "pointer",
                        "&:hover": { elevation: 8 },
                      }}
                      onClick={() => {
                        if (!item.metadata?.mimetype) {
                          navigateToFolder(item.name);
                        } else {
                          downloadFile(item.name);
                        }
                      }}
                    >
                      <CardContent sx={{ textAlign: "center" }}>
                        {item.metadata?.mimetype ? (
                          <PdfIcon
                            sx={{ fontSize: 48, color: "error.main", mb: 1 }}
                          />
                        ) : (
                          <FolderIcon
                            sx={{ fontSize: 48, color: "primary.main", mb: 1 }}
                          />
                        )}
                        <Typography variant="body2" noWrap>
                          {item.name}
                        </Typography>
                        {item.metadata?.size && (
                          <Typography variant="caption" color="textSecondary">
                            {(item.metadata.size / 1024 / 1024).toFixed(2)} MB
                          </Typography>
                        )}
                      </CardContent>
                      <CardActions sx={{ justifyContent: "flex-end" }}>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedItem(item);
                            setAnchorEl(e.currentTarget);
                          }}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </CardActions>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </AnimatePresence>
          </Grid>
        )}

        {/* Context Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          {/* Only show rename option for files (items with mimetype) */}
          {selectedItem?.metadata?.mimetype && (
            <MenuItem
              onClick={() => {
                setEditName(selectedItem?.name || "");
                setEditDialog(true);
                setAnchorEl(null);
              }}
            >
              <ListItemIcon>
                <EditIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Rinomina</ListItemText>
            </MenuItem>
          )}
          <MenuItem
            onClick={() => deleteItem(selectedItem)}
            sx={{ color: "error.main" }}
          >
            <ListItemIcon>
              <DeleteIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>Elimina</ListItemText>
          </MenuItem>
        </Menu>

        {/* Create Folder Dialog */}
        <Dialog
          open={createFolderDialog}
          onClose={() => setCreateFolderDialog(false)}
        >
          <DialogTitle>Crea Nuova Cartella</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Nome cartella"
              fullWidth
              variant="outlined"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCreateFolderDialog(false)}>
              Annulla
            </Button>
            <Button onClick={createFolder} variant="contained">
              Crea
            </Button>
          </DialogActions>
        </Dialog>

        {/* Upload Dialog */}
        <Dialog open={uploadDialog} onClose={() => setUploadDialog(false)}>
          <DialogTitle>Carica PDF</DialogTitle>
          <DialogContent>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              style={{ marginTop: 16 }}
            />
            {selectedFile && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                File selezionato: {selectedFile.name} (
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setUploadDialog(false)}>Annulla</Button>
            <Button
              onClick={uploadFile}
              variant="contained"
              disabled={!selectedFile}
            >
              Carica
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={editDialog} onClose={() => setEditDialog(false)}>
          <DialogTitle>Rinomina</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Nuovo nome"
              fullWidth
              variant="outlined"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialog(false)}>Annulla</Button>
            <Button onClick={renameItem} variant="contained">
              Rinomina
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </WidgetCard>
  );
};

export default Documenti;
