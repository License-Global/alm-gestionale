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
import { useNavigate } from "react-router-dom";
const MotionPaper = motion(Paper);

export default function ClientsPage() {
  const theme = useTheme();
  const [search, setSearch] = useState("");
  const [client, setClient] = useState([]);

  const navigate = useNavigate();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [current, setCurrent] = useState(null); // null = nuovo, obj = modifica

  const [confirmDelete, setConfirmDelete] = useState(null);

  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  const filteredClients = client.filter((e) =>
    e.customer_name.toLowerCase().includes(search.toLowerCase())
  );

  // Salva (inserisci o aggiorna) operatore su Supabase
  const handleSave = async () => {
    if (
      !current?.customer_name ||
      !current?.customer_note ||
      !current?.customer_phone
    )
      return;

    if (current.id) {
      // Update
      const { data, error } = await supabase
        .from("customers")
        .update({
          customer_name: current.customer_name,
          customer_note: current.customer_note,
          customer_phone: current.customer_phone,
        })
        .eq("id", current.id)
        .select()
        .single();

      if (error) {
        notifyError("Errore durante la modifica.");
      } else {
        setClient((prev) =>
          prev.map((emp) => (emp.id === current.id ? data : emp))
        );
        notifySuccess("Cliente modificato!");
      }
    } else {
      // Insert
      const { data, error } = await supabase
        .from("customers")
        .insert([
          {
            customer_name: current.customer_name,
            customer_note: current.customer_note,
            customer_phone: current.customer_phone,
          },
        ])
        .select()
        .single();

      if (error) {
        notifyError("Errore durante l'inserimento.");
      } else {
        setClient((prev) => [...prev, data]);
        notifySuccess("Cliente aggiunto!");
      }
    }
    setDialogOpen(false);
    setCurrent(null);
  };

  // Elimina operatore da Supabase
  const handleDelete = async (id) => {
    const { error } = await supabase.from("customers").delete().eq("id", id);
    if (error) {
      notifyError("Errore durante l'eliminazione.");
    } else {
      setClient((prev) => prev.filter((e) => e.id !== id));
      notifySuccess("Cliente eliminato!");
    }
    setConfirmDelete(null);
  };

  useEffect(() => {
    // Function to fetch client
    const fetchCustomers = async () => {
      const { data, error } = await supabase.from("customers").select("*");
      if (error) {
        console.error("Error fetching client:", error);
      } else {
        setClient(data);
      }
    };

    // Fetch initial client
    fetchCustomers();

    // Set up real-time subscription
    const channel = supabase
      .channel("public:customers")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "customers" },
        (payload) => {
          console.log("Change received!", payload);
          fetchCustomers();
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log("Subscribed to real-time changes on 'customers' table.");
        }
      });

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <Box>
      <ToastContainer />
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Gestione Clienti
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
          placeholder="Cerca Cliente..."
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
              customer_name: "",
              customer_note: "",
              customer_phone: "",
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
                <TableCell sx={{ fontWeight: 600 }}>Cliente</TableCell>
                <TableCell>Note</TableCell>
                <TableCell>Telefono</TableCell>
                <TableCell align="right">Azioni</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredClients.map((customer) => (
                <TableRow key={customer.id} hover>
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar>{customer.customer_name[0]}</Avatar>
                      <Typography variant="body1" fontWeight={500}>
                        {customer.customer_name}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{customer.customer_note}</TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {customer.customer_phone}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Stack
                      direction="row"
                      spacing={1}
                      justifyContent="flex-end"
                    >
                      <Tooltip title="Visualizza">
                        <IconButton
                          size="small"
                          color="info"
                          // Puoi aggiungere qui una funzione onClick per la visualizzazione dettagliata
                          onClick={() => {
                            // Esempio: mostrare un alert o aprire un dialog di dettaglio
                            navigate(`/clienti/${customer.id}`);
                          }}
                        >
                          <ViewIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Modifica">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => {
                            setCurrent(customer);
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
                          onClick={() => setConfirmDelete(customer)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
              {filteredClients.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4}>
                    <Typography align="center" color="text.secondary" py={3}>
                      Nessun cliente trovato.
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
        <DialogTitle>{current?.id ? "Modifica" : "Nuovo"} Cliente</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Nome"
              value={current?.customer_name || ""}
              onChange={(e) =>
                setCurrent((prev) => ({
                  ...prev,
                  customer_name: e.target.value,
                }))
              }
              fullWidth
            />
            <TextField
              label="Note"
              value={current?.customer_note || ""}
              onChange={(e) =>
                setCurrent((prev) => ({
                  ...prev,
                  customer_note: e.target.value,
                }))
              }
              fullWidth
            />
            <TextField
              label="Telefono"
              type="phone"
              value={current?.customer_phone || ""}
              onChange={(e) =>
                setCurrent((prev) => ({
                  ...prev,
                  customer_phone: e.target.value,
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
            Vuoi eliminare <strong>{confirmDelete?.customer_name}</strong>?
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
