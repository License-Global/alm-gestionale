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
      <Box
        sx={{
          p: 3,
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          minHeight: "100vh",
          borderRadius: 2,
        }}
      >
        {error && (
          <Alert
            severity="error"
            onClose={() => setError("")}
            sx={{
              mb: 2,
              backdropFilter: "blur(10px)",
              backgroundColor: "rgba(244, 67, 54, 0.1)",
              border: "1px solid rgba(244, 67, 54, 0.3)",
            }}
          >
            {error}
          </Alert>
        )}

        {success && (
          <Alert
            severity="success"
            onClose={() => setSuccess("")}
            sx={{
              mb: 2,
              backdropFilter: "blur(10px)",
              backgroundColor: "rgba(76, 175, 80, 0.1)",
              border: "1px solid rgba(76, 175, 80, 0.3)",
            }}
          >
            {success}
          </Alert>
        )}

        {/* Breadcrumbs */}
        <Breadcrumbs
          sx={{
            mb: 3,
            p: 2,
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            borderRadius: 2,
            backdropFilter: "blur(10px)",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Link
            component="button"
            variant="body1"
            onClick={() => setCurrentPath("")}
            sx={{
              display: "flex",
              alignItems: "center",
              color: "#2E8B57",
              fontWeight: 600,
              textDecoration: "none",
              "&:hover": {
                color: "#1F5F3F",
                transform: "scale(1.05)",
              },
              transition: "all 0.3s ease",
            }}
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
              sx={{
                color: "#87CEEB",
                fontWeight: 500,
                textDecoration: "none",
                "&:hover": {
                  color: "#4682B4",
                  transform: "scale(1.05)",
                },
                transition: "all 0.3s ease",
              }}
            >
              {part}
            </Link>
          ))}
        </Breadcrumbs>

        {/* Action Buttons */}
        <Box
          sx={{
            mb: 4,
            display: "flex",
            gap: 3,
            justifyContent: "center",
          }}
        >
          <Button
            variant="contained"
            startIcon={<CreateNewFolderIcon />}
            onClick={() => setCreateFolderDialog(true)}
            sx={{
              background: "linear-gradient(45deg, #2E8B57 30%, #32CD32 90%)",
              borderRadius: 3,
              boxShadow: "0 6px 20px rgba(46, 139, 87, 0.4)",
              px: 4,
              py: 1.5,
              fontSize: "1.1rem",
              fontWeight: 600,
              textTransform: "none",
              "&:hover": {
                background: "linear-gradient(45deg, #1F5F3F 30%, #228B22 90%)",
                transform: "translateY(-2px)",
                boxShadow: "0 8px 25px rgba(46, 139, 87, 0.6)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Nuova Cartella
          </Button>
          <Button
            variant="outlined"
            startIcon={<UploadIcon />}
            onClick={() => setUploadDialog(true)}
            sx={{
              borderColor: "#87CEEB",
              color: "#4682B4",
              borderWidth: 2,
              borderRadius: 3,
              px: 4,
              py: 1.5,
              fontSize: "1.1rem",
              fontWeight: 600,
              textTransform: "none",
              "&:hover": {
                borderColor: "#4682B4",
                backgroundColor: "rgba(135, 206, 235, 0.1)",
                transform: "translateY(-2px)",
                boxShadow: "0 6px 20px rgba(70, 130, 180, 0.3)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Carica PDF
          </Button>
        </Box>

        {/* Content Grid */}
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              p: 8,
              background: "rgba(255, 255, 255, 0.7)",
              borderRadius: 3,
              backdropFilter: "blur(10px)",
            }}
          >
            <CircularProgress size={60} sx={{ color: "#2E8B57" }} />
          </Box>
        ) : (
          <Grid container spacing={3}>
            <AnimatePresence>
              {items.map((item, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={item.name}>
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.9 }}
                    transition={{
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 100,
                    }}
                    whileHover={{
                      scale: 1.05,
                      transition: { duration: 0.2 },
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Card
                      sx={{
                        cursor: "pointer",
                        background: "rgba(255, 255, 255, 0.9)",
                        backdropFilter: "blur(10px)",
                        borderRadius: 3,
                        border: "1px solid rgba(255, 255, 255, 0.3)",
                        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          boxShadow: "0 12px 40px rgba(0, 0, 0, 0.2)",
                          transform: "translateY(-4px)",
                        },
                      }}
                      onClick={() => {
                        if (!item.metadata?.mimetype) {
                          navigateToFolder(item.name);
                        } else {
                          downloadFile(item.name);
                        }
                      }}
                    >
                      <CardContent
                        sx={{
                          textAlign: "center",
                          p: 3,
                        }}
                      >
                        {item.metadata?.mimetype ? (
                          <PdfIcon
                            sx={{
                              fontSize: 64,
                              color: "#87CEEB",
                              mb: 2,
                              filter:
                                "drop-shadow(0 4px 8px rgba(135, 206, 235, 0.3))",
                            }}
                          />
                        ) : (
                          <FolderIcon
                            sx={{
                              fontSize: 64,
                              color: "#2E8B57",
                              mb: 2,
                              filter:
                                "drop-shadow(0 4px 8px rgba(46, 139, 87, 0.3))",
                            }}
                          />
                        )}
                        <Typography
                          variant="body1"
                          noWrap
                          sx={{
                            fontWeight: 600,
                            color: "#333",
                            mb: 1,
                          }}
                        >
                          {item.name}
                        </Typography>
                        {item.metadata?.size && (
                          <Typography
                            variant="caption"
                            sx={{
                              color: "#666",
                              backgroundColor: "rgba(135, 206, 235, 0.2)",
                              px: 1.5,
                              py: 0.5,
                              borderRadius: 2,
                              fontWeight: 500,
                            }}
                          >
                            {(item.metadata.size / 1024 / 1024).toFixed(2)} MB
                          </Typography>
                        )}
                      </CardContent>
                      <CardActions
                        sx={{
                          justifyContent: "flex-end",
                          p: 2,
                          pt: 0,
                        }}
                      >
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedItem(item);
                            setAnchorEl(e.currentTarget);
                          }}
                          sx={{
                            backgroundColor: "rgba(255, 255, 255, 0.7)",
                            backdropFilter: "blur(10px)",
                            "&:hover": {
                              backgroundColor: "rgba(255, 255, 255, 0.9)",
                              transform: "scale(1.1)",
                            },
                            transition: "all 0.3s ease",
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
          sx={{
            "& .MuiPaper-root": {
              background: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              borderRadius: 2,
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            },
          }}
        >
          {/* Only show rename option for files (items with mimetype) */}
          {selectedItem?.metadata?.mimetype && (
            <MenuItem
              onClick={() => {
                setEditName(selectedItem?.name || "");
                setEditDialog(true);
                setAnchorEl(null);
              }}
              sx={{
                "&:hover": {
                  backgroundColor: "rgba(46, 139, 87, 0.1)",
                },
              }}
            >
              <ListItemIcon>
                <EditIcon fontSize="small" sx={{ color: "#2E8B57" }} />
              </ListItemIcon>
              <ListItemText>Rinomina</ListItemText>
            </MenuItem>
          )}
          <MenuItem
            onClick={() => deleteItem(selectedItem)}
            sx={{
              color: "#d32f2f",
              "&:hover": {
                backgroundColor: "rgba(211, 47, 47, 0.1)",
              },
            }}
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
          PaperProps={{
            sx: {
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(20px)",
              borderRadius: 3,
              border: "1px solid rgba(255, 255, 255, 0.3)",
            },
          }}
        >
          <DialogTitle sx={{ color: "#2E8B57", fontWeight: 600 }}>
            Crea Nuova Cartella
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Nome cartella"
              fullWidth
              variant="outlined"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover fieldset": {
                    borderColor: "#2E8B57",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#2E8B57",
                  },
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#2E8B57",
                },
              }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 2 }}>
            <Button
              onClick={() => setCreateFolderDialog(false)}
              sx={{
                color: "#666",
                "&:hover": {
                  backgroundColor: "rgba(102, 102, 102, 0.1)",
                },
              }}
            >
              Annulla
            </Button>
            <Button
              onClick={createFolder}
              variant="contained"
              sx={{
                background: "linear-gradient(45deg, #2E8B57 30%, #32CD32 90%)",
                borderRadius: 2,
                "&:hover": {
                  background:
                    "linear-gradient(45deg, #1F5F3F 30%, #228B22 90%)",
                },
              }}
            >
              Crea
            </Button>
          </DialogActions>
        </Dialog>

        {/* Upload Dialog */}
        <Dialog
          open={uploadDialog}
          onClose={() => setUploadDialog(false)}
          PaperProps={{
            sx: {
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(20px)",
              borderRadius: 3,
              border: "1px solid rgba(255, 255, 255, 0.3)",
            },
          }}
        >
          <DialogTitle sx={{ color: "#87CEEB", fontWeight: 600 }}>
            Carica PDF
          </DialogTitle>
          <DialogContent>
            <Box
              sx={{
                border: "2px dashed #87CEEB",
                borderRadius: 2,
                p: 3,
                mt: 2,
                textAlign: "center",
                backgroundColor: "rgba(135, 206, 235, 0.05)",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "rgba(135, 206, 235, 0.1)",
                  borderColor: "#4682B4",
                },
              }}
            >
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                style={{
                  padding: 16,
                  fontSize: "16px",
                  width: "100%",
                }}
              />
            </Box>
            {selectedFile && (
              <Typography
                variant="body2"
                sx={{
                  mt: 2,
                  p: 2,
                  backgroundColor: "rgba(46, 139, 87, 0.1)",
                  borderRadius: 2,
                  color: "#2E8B57",
                  fontWeight: 500,
                }}
              >
                File selezionato: {selectedFile.name} (
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </Typography>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 2 }}>
            <Button
              onClick={() => setUploadDialog(false)}
              sx={{
                color: "#666",
                "&:hover": {
                  backgroundColor: "rgba(102, 102, 102, 0.1)",
                },
              }}
            >
              Annulla
            </Button>
            <Button
              onClick={uploadFile}
              variant="contained"
              disabled={!selectedFile}
              sx={{
                background: "linear-gradient(45deg, #87CEEB 30%, #4682B4 90%)",
                borderRadius: 2,
                "&:hover": {
                  background:
                    "linear-gradient(45deg, #4682B4 30%, #1E90FF 90%)",
                },
                "&:disabled": {
                  background: "rgba(135, 206, 235, 0.3)",
                },
              }}
            >
              Carica
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog
          open={editDialog}
          onClose={() => setEditDialog(false)}
          PaperProps={{
            sx: {
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(20px)",
              borderRadius: 3,
              border: "1px solid rgba(255, 255, 255, 0.3)",
            },
          }}
        >
          <DialogTitle sx={{ color: "#2E8B57", fontWeight: 600 }}>
            Rinomina
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Nuovo nome"
              fullWidth
              variant="outlined"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover fieldset": {
                    borderColor: "#2E8B57",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#2E8B57",
                  },
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#2E8B57",
                },
              }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 2 }}>
            <Button
              onClick={() => setEditDialog(false)}
              sx={{
                color: "#666",
                "&:hover": {
                  backgroundColor: "rgba(102, 102, 102, 0.1)",
                },
              }}
            >
              Annulla
            </Button>
            <Button
              onClick={renameItem}
              variant="contained"
              sx={{
                background: "linear-gradient(45deg, #2E8B57 30%, #32CD32 90%)",
                borderRadius: 2,
                "&:hover": {
                  background:
                    "linear-gradient(45deg, #1F5F3F 30%, #228B22 90%)",
                },
              }}
            >
              Rinomina
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </WidgetCard>
  );
};

export default Documenti;
