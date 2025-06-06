import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import DeleteIcon from "@mui/icons-material/Delete";
import WarningIcon from "@mui/icons-material/Warning";
import { useNavigate } from "react-router-dom";
import { 
  TableSortLabel,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box
} from "@mui/material";
import NoOrders from "../Orders/NoOrders";
import { supabase } from "../../supabase/supabaseClient";
import { fetchCustomers } from "../../services/customerService";

const ArchivedOrdersTable = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orderBy, setOrderBy] = useState("startDate");
  const [order, setOrder] = useState("desc");
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

  const [customers, setCustomers] = useState([]);

  // Recupera gli ordini da Supabase
  const fetchOrders = async (column, direction) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("archived")
        .select("*")
        .order(column, { ascending: direction === "asc" });

      if (error) throw error;
      setOrders(data);
    } catch (error) {
      console.error("Errore durante il fetch dei dati:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Effettua il fetch all'inizializzazione e quando cambia l'ordinamento
  useEffect(() => {
    fetchOrders(orderBy, order);
  }, [orderBy, order]);

  useEffect(() => {
    const fetchCustomersData = async () => {
      const data = await fetchCustomers();
      setCustomers(data);
    };

    fetchCustomersData();
  }, []);

  // Gestisce l'ordinamento
  const handleRequestSort = (property) => {
    setOrderBy(property);
    setOrder(order === "asc" ? "desc" : "asc");
  };

  // Elimina un ordine
  const handleDelete = async (id) => {
    try {
      const { error } = await supabase.from("archived").delete().eq("id", id);
      if (error) throw error;

      setOrders((prevOrders) => prevOrders.filter((order) => order.id !== id));
    } catch (error) {
      console.error(
        "Errore durante l'eliminazione dell'ordine:",
        error.message
      );
    }
  };

  const openDeleteDialog = (order) => {
    setOrderToDelete(order);
    setDeleteDialog(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialog(false);
    setOrderToDelete(null);
  };

  const confirmDelete = () => {
    if (orderToDelete) {
      handleDelete(orderToDelete.id);
      closeDeleteDialog();
    }
  };

  if (!orders.length) {
    return <NoOrders />;
  } else
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "orderName"}
                  direction={orderBy === "orderName" ? order : "asc"}
                  onClick={() => handleRequestSort("orderName")}
                >
                  Nome Ordine
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "startDate"}
                  direction={orderBy === "startDate" ? order : "asc"}
                  onClick={() => handleRequestSort("startDate")}
                >
                  Data Inizio
                </TableSortLabel>
              </TableCell>
              <TableCell>Elimina</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3}>Caricamento...</TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell onClick={() => navigate(`/archivio/${order.id}`)}>
                    {order.orderName +
                      " - " +
                      customers.find((c) => c.id === order.clientId)
                        ?.customer_name}
                  </TableCell>
                  <TableCell onClick={() => navigate(`/archivio/${order.id}`)}>
                    {new Date(order.startDate).toLocaleDateString("it-IT")}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="error"
                      onClick={() => openDeleteDialog(order)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Dialog di conferma eliminazione */}
        <Dialog
          open={deleteDialog}
          onClose={closeDeleteDialog}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
            },
          }}
        >
          <DialogTitle 
            sx={{ 
              color: "#d32f2f", 
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 1
            }}
          >
            <WarningIcon color="error" />
            Conferma eliminazione dall'archivio
          </DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Sei sicuro di voler eliminare definitivamente la commessa archiviata <strong>"{orderToDelete?.orderName}"</strong>?
              </Typography>
              <Typography 
                variant="body2" 
                color="error" 
                sx={{ 
                  backgroundColor: "rgba(211, 47, 47, 0.1)",
                  padding: 2,
                  borderRadius: 2,
                  border: "1px solid rgba(211, 47, 47, 0.3)"
                }}
              >
                ⚠️ <strong>Attenzione:</strong> Questa azione eliminerà definitivamente tutti i dati archiviati della commessa, inclusi:
              </Typography>
              <Box sx={{ mt: 1, ml: 2 }}>
                <Typography variant="body2" color="text.secondary">• Tutti i dati storici delle attività</Typography>
                <Typography variant="body2" color="text.secondary">• I documenti archiviati</Typography>
                <Typography variant="body2" color="text.secondary">• Le note e i commenti salvati</Typography>
                <Typography variant="body2" color="text.secondary">• Lo storico completo della commessa</Typography>
              </Box>
              <Typography variant="body2" color="error" sx={{ mt: 2, fontWeight: 600 }}>
                Una volta eliminata dall'archivio, la commessa non potrà più essere recuperata.
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 2 }}>
            <Button
              onClick={closeDeleteDialog}
              variant="outlined"
              sx={{
                borderRadius: 2,
                px: 3,
                color: "#666",
                borderColor: "#ccc",
                "&:hover": {
                  backgroundColor: "rgba(102, 102, 102, 0.1)",
                  borderColor: "#999",
                },
              }}
            >
              Annulla
            </Button>
            <Button
              onClick={confirmDelete}
              variant="contained"
              color="error"
              disabled={loading}
              sx={{
                borderRadius: 2,
                px: 3,
                fontWeight: 600,
                "&:hover": {
                  backgroundColor: "#b71c1c",
                },
              }}
            >
              {loading ? "Eliminazione..." : "Elimina dall'archivio"}
            </Button>
          </DialogActions>
        </Dialog>
      </TableContainer>
    );
};

export default ArchivedOrdersTable;
