import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  IconButton,
  Stack,
  TextField,
  InputAdornment,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  useTheme,
  Fab,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  PersonAdd as AddIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { supabase } from "../../supabase/supabaseClient";

const MotionPaper = motion(Paper);

export default function OperatorsPage() {
  const theme = useTheme();
  const [search, setSearch] = useState("");
  const [employees, setEmployees] = useState([]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [current, setCurrent] = useState(null); // null = nuovo, obj = modifica

  const [confirmDelete, setConfirmDelete] = useState(null);

  const filteredEmployees = employees.filter((e) =>
    e.workerName.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = () => {
    if (!current?.workerName || !current?.role || !current?.operator_phone)
      return;
    if (current.id) {
      setEmployees((prev) =>
        prev.map((emp) => (emp.id === current.id ? current : emp))
      );
    } else {
      setEmployees((prev) => [...prev, { ...current, id: 123456 }]);
    }
    setDialogOpen(false);
    setCurrent(null);
  };

  const handleDelete = (id) => {
    setEmployees((prev) => prev.filter((e) => e.id !== id));
    setConfirmDelete(null);
  };

  useEffect(() => {
    // Function to fetch employees
    const fetchEmployees = async () => {
      const { data, error } = await supabase.from("personale").select("*");
      if (error) {
        console.error("Error fetching employees:", error);
      } else {
        setEmployees(data);
      }
    };

    // Fetch initial employees
    fetchEmployees();

    // Set up real-time subscription
    const channel = supabase
      .channel("public:personale")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "personale" },
        (payload) => {
          console.log("Change received!", payload);
          fetchEmployees();
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log("Subscribed to real-time changes on 'personale' table.");
        }
      });

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Gestione Operatori
      </Typography>
      <Box sx={{ mb: 3 }}>
        <TextField
          placeholder="Cerca Operatore..."
          fullWidth
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            style: {
              fontSize: 18, // testo più grande
              fontWeight: 500, // testo più marcato
              color: "#222", // colore più scuro per maggiore leggibilità
              letterSpacing: 0.2,
            },
          }}
          inputProps={{
            style: {
              fontSize: 18,
              fontWeight: 500,
              color: "#222",
              letterSpacing: 0.2,
            },
          }}
        />
      </Box>
      <MotionPaper
        elevation={3}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        sx={{ borderRadius: 4, overflow: "hidden" }}
      >
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: theme.palette.grey[100] }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Operatore</TableCell>
                <TableCell>Ruolo</TableCell>
                <TableCell>Email</TableCell>
                <TableCell align="right">Azioni</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEmployees.map((emp) => (
                <TableRow key={emp.id} hover>
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar>{emp.workerName[0]}</Avatar>
                      <Typography variant="body1" fontWeight={500}>
                        {emp.workerName}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{emp.role}</TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {emp.operator_phone}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Stack
                      direction="row"
                      spacing={1}
                      justifyContent="flex-end"
                    >
                      <Tooltip title="Vedi dettagli">
                        <IconButton size="small" color="info">
                          <ViewIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Modifica">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => {
                            setCurrent(emp);
                            setDialogOpen(true);
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Elimina">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => setConfirmDelete(emp)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
              {filteredEmployees.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4}>
                    <Typography align="center" color="text.secondary" py={3}>
                      Nessun operatore trovato.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </MotionPaper>
      {/* FAB Aggiungi */}
      <Fab
        color="primary"
        onClick={() => {
          setCurrent({ workerName: "", role: "", operator_phone: "" });
          setDialogOpen(true);
        }}
        sx={{ position: "fixed", bottom: 32, right: 32 }}
      >
        <AddIcon />
      </Fab>
      {/* Dialog: Aggiungi/Modifica */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          {current?.id ? "Modifica" : "Nuovo"} Operatore
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Nome"
              value={current?.workerName || ""}
              onChange={(e) =>
                setCurrent((prev) => ({ ...prev, workerName: e.target.value }))
              }
              fullWidth
            />
            <TextField
              label="Ruolo"
              value={current?.role || ""}
              onChange={(e) =>
                setCurrent((prev) => ({ ...prev, role: e.target.value }))
              }
              fullWidth
            />
            <TextField
              label="Email"
              type="operator_phone"
              value={current?.operator_phone || ""}
              onChange={(e) =>
                setCurrent((prev) => ({
                  ...prev,
                  operator_phone: e.target.value,
                }))
              }
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Annulla</Button>
          <Button onClick={handleSave} variant="contained">
            Salva
          </Button>
        </DialogActions>
      </Dialog>
      {/* Dialog: Conferma Eliminazione */}
      <Dialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Conferma eliminazione</DialogTitle>
        <DialogContent>
          <Typography>
            Vuoi eliminare <strong>{confirmDelete?.workerName}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(null)}>Annulla</Button>
          <Button
            onClick={() => handleDelete(confirmDelete.id)}
            variant="contained"
            color="error"
          >
            Elimina
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
