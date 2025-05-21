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
import { toast, ToastContainer } from "react-toastify";

const MotionPaper = motion(Paper);

export default function OperatorsPage() {
  const theme = useTheme();
  const [search, setSearch] = useState("");
  const [employees, setEmployees] = useState([]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [current, setCurrent] = useState(null); // null = nuovo, obj = modifica

  const [confirmDelete, setConfirmDelete] = useState(null);

  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  const filteredEmployees = employees.filter((e) =>
    e.workerName.toLowerCase().includes(search.toLowerCase())
  );

  // Salva (inserisci o aggiorna) operatore su Supabase
  const handleSave = async () => {
    if (
      !current?.workerName ||
      !current?.operator_note ||
      !current?.operator_phone
    )
      return;

    if (current.id) {
      // Update
      const { data, error } = await supabase
        .from("personale")
        .update({
          workerName: current.workerName,
          operator_note: current.operator_note,
          operator_phone: current.operator_phone,
        })
        .eq("id", current.id)
        .select()
        .single();

      if (error) {
        notifyError("Errore durante la modifica.");
      } else {
        setEmployees((prev) =>
          prev.map((emp) => (emp.id === current.id ? data : emp))
        );
        notifySuccess("Operatore modificato!");
      }
    } else {
      // Insert
      const { data, error } = await supabase
        .from("personale")
        .insert([
          {
            workerName: current.workerName,
            operator_note: current.operator_note,
            operator_phone: current.operator_phone,
          },
        ])
        .select()
        .single();

      if (error) {
        notifyError("Errore durante l'inserimento.");
      } else {
        setEmployees((prev) => [...prev, data]);
        notifySuccess("Operatore aggiunto!");
      }
    }
    setDialogOpen(false);
    setCurrent(null);
  };

  // Elimina operatore da Supabase
  const handleDelete = async (id) => {
    const { error } = await supabase.from("personale").delete().eq("id", id);
    if (error) {
      notifyError("Errore durante l'eliminazione.");
    } else {
      setEmployees((prev) => prev.filter((e) => e.id !== id));
      notifySuccess("Operatore eliminato!");
    }
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

  const handleSubmitNewOperator = async (newOperator) => {
    const { data, error } = await supabase
      .from("personale")
      .insert([newOperator])
      .single();

    if (error) {
      console.error("Error adding new operator:", error);
    } else {
      setEmployees((prev) => [...prev, data]);
    }
  };

  return (
    <Box>
      <ToastContainer />
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Gestione Operatori
      </Typography>
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
        }}
      >
        <TextField
          placeholder="Cerca Operatore..."
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
        <Fab
          color="primary"
          onClick={() => {
            setCurrent({
              workerName: "",
              operator_note: "",
              operator_phone: "",
            });
            setDialogOpen(true);
          }}
        >
          <AddIcon />
        </Fab>
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
                <TableCell>Note</TableCell>
                <TableCell>Telefono</TableCell>
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
                  <TableCell>{emp.operator_note}</TableCell>
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
              label="Note"
              value={current?.operator_note || ""}
              onChange={(e) =>
                setCurrent((prev) => ({
                  ...prev,
                  operator_note: e.target.value,
                }))
              }
              fullWidth
            />
            <TextField
              label="Telefono"
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
