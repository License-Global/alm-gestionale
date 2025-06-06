import { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Cancel from "@mui/icons-material/Cancel";
import CheckCircle from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import WarningIcon from "@mui/icons-material/Warning";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { 
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box
} from "@mui/material";
import { useDeleteOrder } from "../../hooks/useDeleteOrder";
import NoOrders from "../Orders/NoOrders";
import { deleteFolder } from "../../services/bucketServices";
import { usePersonale } from "../../hooks/usePersonale";
import useSession from "../../hooks/useSession";
import { fetchCustomers } from "../../services/customerService";

export default function BasicTable({ orders }) {
  const navigate = useNavigate();
  const personale = usePersonale();
  const session = useSession();

  const [customers, setCustomers] = useState([]);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

  const { deleteOrder, loading } = useDeleteOrder();

  const handleDelete = (orderId, orderName, clientId) => {
    deleteOrder(orderId).then(() => {
      if (loading === false) {
        deleteFolder(session.session.user.id, orderName + clientId).then(() => {
          window.location.reload();
        });
      }
    });
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
      handleDelete(orderToDelete.id, orderToDelete.orderName, orderToDelete.clientId);
      closeDeleteDialog();
    }
  };

  useEffect(() => {
    const fetchCustomersData = async () => {
      const data = await fetchCustomers();
      setCustomers(data);
    };

    fetchCustomersData();
  }, []);

  return (
    <>
      {orders.length === 0 ? (
        <NoOrders />
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Ordini</TableCell>
                <TableCell align="center">Responsabile</TableCell>
                <TableCell align="center">Confermato</TableCell>
                <TableCell align="center">Inizio</TableCell>
                <TableCell align="center">Urgenza</TableCell>
                <TableCell align="center"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders &&
                orders.map((order) => (
                  <TableRow
                    key={order.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell
                      onClick={() => navigate(order.id.toString())}
                      component="th"
                      scope="row"
                    >
                      <b>
                        {order.orderName +
                          " - " +
                          customers.find((c) => c.id === order.clientId)
                            ?.customer_name}
                      </b>
                    </TableCell>
                    <TableCell
                      onClick={() => navigate(order.id.toString())}
                      align="center"
                    >
                      {
                        personale.personale.find(
                          (person) => person.id === order.orderManager
                        )?.workerName
                      }
                    </TableCell>
                    <TableCell
                      onClick={() => navigate(order.id.toString())}
                      align="center"
                    >
                      {order.isConfirmed ? (
                        <CheckCircle fontSize="medium" color="success" />
                      ) : (
                        <Cancel fontSize="medium" color="error" />
                      )}
                    </TableCell>
                    <TableCell
                      onClick={() => navigate(order.id.toString())}
                      align="center"
                    >
                      {dayjs(order.startDate).format("DD/MM/YYYY")}
                    </TableCell>
                    <TableCell
                      onClick={() => navigate(order.id.toString())}
                      align="center"
                    >
                      {order.urgency}
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        variant="contained"
                        onClick={() => openDeleteDialog(order)}
                        color="error"
                      >
                        <DeleteIcon fontSize="medium" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

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
          Conferma eliminazione
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Sei sicuro di voler eliminare la commessa <strong>"{orderToDelete?.orderName}"</strong>?
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
              ⚠️ <strong>Attenzione:</strong> Questa azione eliminerà definitivamente tutti i dati associati alla commessa, inclusi:
            </Typography>
            <Box sx={{ mt: 1, ml: 2 }}>
              <Typography variant="body2" color="text.secondary">• Tutte le attività</Typography>
              <Typography variant="body2" color="text.secondary">• I documenti allegati</Typography>
              <Typography variant="body2" color="text.secondary">• Le note e i commenti</Typography>
            </Box>
            <Typography variant="body2" color="error" sx={{ mt: 2, fontWeight: 600 }}>
              Questa operazione non può essere annullata.
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
            {loading ? "Eliminazione..." : "Elimina definitivamente"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
