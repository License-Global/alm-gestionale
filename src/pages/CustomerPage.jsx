import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  FormLabel,
  Chip,
  Divider,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Tooltip,
} from "@mui/material";
import {
  Assignment as AssignmentIcon,
  CalendarToday as CalendarIcon,
  Add as AddIcon,
  LocationOn as LocationIcon,
  Close as CloseIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { useCustomer } from "../hooks/useCustomeres";
import BackButton from "../components/misc/BackButton";
import { updateCustomer } from "../services/customerService";
import { supabase } from "../supabase/supabaseClient";

const CustomerPage = () => {
  const { id } = useParams();
  const { customer, loading } = useCustomer(id);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const [customerData, setCustomerData] = useState({
    customer_name: "",
    customer_address: "",
    customer_email: "",
    customer_phone: "",
    customer_note: "",
    zone_consegna: [],
  });

  // Stati per gestire le zone di consegna
  const [openZoneDialog, setOpenZoneDialog] = useState(false);
  const [zoneToEdit, setZoneToEdit] = useState(null);
  const [zoneValue, setZoneValue] = useState("");

  // Stati per feedback utente
  const [isUpdating, setIsUpdating] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  useEffect(() => {
    if (customer) {
      setCustomerData({
        ...customer,
        zone_consegna: Array.isArray(customer.zone_consegna)
          ? customer.zone_consegna
          : [],
      });
    }
  }, [customer]);

  // Recupera gli ordini collegati al cliente
  useEffect(() => {
    const fetchCustomerOrders = async () => {
      if (!id) return;

      try {
        setOrdersLoading(true);
        const { data, error } = await supabase
          .from("orders")
          .select(
            "id, orderName, startDate, endDate, urgency, isConfirmed, internal_id"
          )
          .eq("clientId", id)
          .order("startDate", { ascending: false });

        if (error) {
          console.error("Error fetching customer orders:", error);
        } else {
          setOrders(data || []);
        }
      } catch (error) {
        console.error("Error in fetchCustomerOrders:", error);
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchCustomerOrders();
  }, [id]);

  const getUrgencyColor = (urgency) => {
    switch (urgency?.toLowerCase()) {
      case "urgente":
        return "error";
      case "alta":
        return "warning";
      case "media":
        return "info";
      case "bassa":
        return "success";
      default:
        return "default";
    }
  };

  const handleEdit = async (id, customerData) => {
    try {
      setIsUpdating(true);
      await updateCustomer(id, customerData);
      setShowSuccessMessage(true);
      // Non navighiamo via - rimaniamo sulla pagina con i dati aggiornati
    } catch (error) {
      console.error("Error updating customer:", error);
      setShowErrorMessage(true);
    } finally {
      setIsUpdating(false);
    }
  };

  // Funzioni per gestire le zone di consegna
  const handleAddZone = () => {
    setZoneToEdit(null);
    setZoneValue("");
    setOpenZoneDialog(true);
  };

  const handleEditZone = (index, zone) => {
    setZoneToEdit(index);
    setZoneValue(zone);
    setOpenZoneDialog(true);
  };

  const handleDeleteZone = (index) => {
    const currentZones = Array.isArray(customerData.zone_consegna)
      ? customerData.zone_consegna
      : [];
    const updatedZones = currentZones.filter((_, i) => i !== index);
    setCustomerData({
      ...customerData,
      zone_consegna: updatedZones,
    });
  };

  const handleSaveZone = () => {
    if (!zoneValue.trim()) return;

    const currentZones = Array.isArray(customerData.zone_consegna)
      ? customerData.zone_consegna
      : [];
    let updatedZones;

    if (zoneToEdit !== null) {
      // Modifica zona esistente
      updatedZones = currentZones.map((zone, index) =>
        index === zoneToEdit ? zoneValue.trim() : zone
      );
    } else {
      // Aggiungi nuova zona
      updatedZones = [...currentZones, zoneValue.trim()];
    }

    setCustomerData({
      ...customerData,
      zone_consegna: updatedZones,
    });

    setOpenZoneDialog(false);
    setZoneValue("");
    setZoneToEdit(null);
  };

  const handleCloseZoneDialog = () => {
    setOpenZoneDialog(false);
    setZoneValue("");
    setZoneToEdit(null);
  };

  if (loading)
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </div>
    );
  return (
    <Box sx={{ minHeight: "85vh", backgroundColor: "#f5f5f5", py: 4 }}>
      <Container maxWidth="lg">
        <Paper elevation={3} sx={{ p: 4, width: "100%" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography
              color="primary"
              sx={{ mb: 4 }}
              variant="h4"
              align="left"
              gutterBottom
            >
              Dettaglio Cliente
            </Typography>
            <BackButton title="Indietro" direction="/clienti" />
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormLabel>Nome</FormLabel>
              <TextField
                fullWidth
                margin="normal"
                variant="standard"
                value={customerData?.customer_name}
                onChange={(e) =>
                  setCustomerData({
                    ...customerData,
                    customer_name: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormLabel>Indirizzo</FormLabel>
              <TextField
                fullWidth
                margin="normal"
                variant="standard"
                onChange={(e) =>
                  setCustomerData({
                    ...customerData,
                    customer_address: e.target.value,
                  })
                }
                value={customerData?.customer_address}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormLabel>Email</FormLabel>
              <TextField
                fullWidth
                margin="normal"
                variant="standard"
                onChange={(e) => {
                  setCustomerData({
                    ...customerData,
                    customer_email: e.target.value,
                  });
                }}
                value={customerData?.customer_email}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormLabel>Telefono</FormLabel>
              <TextField
                fullWidth
                margin="normal"
                variant="standard"
                onChange={(e) => {
                  setCustomerData({
                    ...customerData,
                    customer_phone: e.target.value,
                  });
                }}
                value={customerData?.customer_phone}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <FormLabel>Note</FormLabel>
              <TextField
                fullWidth
                margin="normal"
                variant="standard"
                onChange={(e) => {
                  setCustomerData({
                    ...customerData,
                    customer_note: e.target.value,
                  });
                }}
                value={customerData?.customer_note}
                multiline
              />
            </Grid>

            {/* Sezione Zone di Consegna */}
            <Grid item xs={12}>
              <Box sx={{ mt: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <LocationIcon color="primary" />
                    Zone di Consegna
                    {customerData.zone_consegna &&
                      customerData.zone_consegna.length > 0 && (
                        <Chip
                          label={customerData.zone_consegna.length}
                          size="small"
                          color="secondary"
                          sx={{
                            height: 20,
                            fontSize: "0.75rem",
                            fontWeight: "bold",
                          }}
                        />
                      )}
                  </Typography>
                  <Button
                    onClick={handleAddZone}
                    variant="contained"
                    size="small"
                    sx={{
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 600,
                      px: 2,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: 2,
                      },
                    }}
                    startIcon={<AddIcon />}
                  >
                    Aggiungi Zona
                  </Button>
                </Box>

                {customerData.zone_consegna &&
                Array.isArray(customerData.zone_consegna) &&
                customerData.zone_consegna.length > 0 ? (
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 1.5,
                      p: 2,
                      backgroundColor: "#f8f9fa",
                      borderRadius: 2,
                      border: "1px solid #e0e0e0",
                    }}
                  >
                    {customerData.zone_consegna.map((zona, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          backgroundColor: "white",
                          borderRadius: 3,
                          border: "1px solid #e0e0e0",
                          padding: "4px 6px",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                            transform: "translateY(-1px)",
                          },
                        }}
                      >
                        {/* Chip principale con il nome della zona */}
                        <Chip
                          label={zona}
                          variant="filled"
                          color="primary"
                          sx={{
                            fontSize: "0.875rem",
                            fontWeight: 500,
                            height: 32,
                            borderRadius: 2,
                            cursor: "default",
                            "& .MuiChip-label": {
                              px: 1.5,
                            },
                          }}
                        />

                        {/* Pulsante Modifica */}
                        <Tooltip title="Modifica zona" arrow placement="top">
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditZone(index, zona);
                            }}
                            size="small"
                            sx={{
                              minWidth: 28,
                              width: 28,
                              height: 28,
                              borderRadius: "50%",
                              color: "#1976d2",
                              backgroundColor: "rgba(25, 118, 210, 0.1)",
                              transition: "all 0.2s ease",
                              "&:hover": {
                                backgroundColor: "rgba(25, 118, 210, 0.2)",
                                transform: "scale(1.1)",
                              },
                            }}
                          >
                            <EditIcon sx={{ fontSize: 16 }} />
                          </Button>
                        </Tooltip>

                        {/* Pulsante Elimina */}
                        <Tooltip title="Elimina zona" arrow placement="top">
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteZone(index);
                            }}
                            size="small"
                            sx={{
                              minWidth: 28,
                              width: 28,
                              height: 28,
                              borderRadius: "50%",
                              color: "#ff4444",
                              backgroundColor: "rgba(255, 68, 68, 0.1)",
                              transition: "all 0.2s ease",
                              "&:hover": {
                                backgroundColor: "rgba(255, 68, 68, 0.2)",
                                transform: "scale(1.1)",
                                color: "#ff0000",
                              },
                            }}
                          >
                            <CloseIcon sx={{ fontSize: 16 }} />
                          </Button>
                        </Tooltip>
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Box
                    sx={{
                      p: 3,
                      backgroundColor: "#f8f9fa",
                      borderRadius: 2,
                      border: "1px dashed #d0d0d0",
                      textAlign: "center",
                    }}
                  >
                    <LocationIcon
                      sx={{
                        fontSize: 48,
                        color: "text.disabled",
                        mb: 1,
                        opacity: 0.5,
                      }}
                    />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontStyle: "italic",
                        mb: 2,
                      }}
                    >
                      Nessuna zona di consegna configurata
                    </Typography>
                    <Typography variant="caption" color="text.disabled">
                      Clicca su "Aggiungi Zona" per iniziare
                    </Typography>
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>

          {/* Pulsanti di azione */}
          <Grid container spacing={2} justifyContent="flex-end" sx={{ mt: 4 }}>
            <Grid item>
              <Button
                onClick={() => handleEdit(id, customerData)}
                color="secondary"
                variant="contained"
                disabled={isUpdating}
                startIcon={
                  isUpdating ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : null
                }
              >
                <b>{isUpdating ? "Salvando..." : "Salva Modifiche"}</b>
              </Button>
            </Grid>
          </Grid>

          {/* Sezione Ordini Correlati */}
          <Divider sx={{ my: 4 }} />
          <Box sx={{ mt: 4 }}>
            <Typography
              variant="h5"
              color="primary.dark"
              sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}
            >
              <AssignmentIcon />
              Ordini Correlati ({orders.length})
            </Typography>

            {ordersLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
                <CircularProgress />
              </Box>
            ) : orders.length === 0 ? (
              <Card sx={{ backgroundColor: "#f9f9f9" }}>
                <CardContent sx={{ textAlign: "center", py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    Nessun ordine collegato a questo cliente
                  </Typography>
                </CardContent>
              </Card>
            ) : (
              <Grid container spacing={2}>
                {orders.map((order) => (
                  <Grid item xs={12} sm={6} md={4} key={order.id}>
                    <Card
                      sx={{
                        height: "100%",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: 3,
                        },
                        cursor: "pointer",
                      }}
                      component={Link}
                      to={`/${order.id}`}
                      style={{ textDecoration: "none" }}
                    >
                      <CardContent>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            mb: 2,
                          }}
                        >
                          <Typography
                            variant="h6"
                            component="div"
                            sx={{ fontWeight: 600 }}
                          >
                            {order.orderName}
                          </Typography>
                          <Chip
                            label={order.urgency || "Bassa"}
                            color={getUrgencyColor(order.urgency)}
                            size="small"
                          />
                        </Box>

                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 1 }}
                        >
                          <CalendarIcon
                            sx={{
                              fontSize: 16,
                              mr: 1,
                              color: "text.secondary",
                            }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            Inizio:{" "}
                            {order.startDate
                              ? new Date(order.startDate).toLocaleDateString(
                                  "it-IT"
                                )
                              : "N/A"}
                          </Typography>
                        </Box>

                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 1 }}
                        >
                          <CalendarIcon
                            sx={{
                              fontSize: 16,
                              mr: 1,
                              color: "text.secondary",
                            }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            Fine:{" "}
                            {order.endDate
                              ? new Date(order.endDate).toLocaleDateString(
                                  "it-IT"
                                )
                              : "N/A"}
                          </Typography>
                        </Box>

                        {order.internal_id && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: "block", mt: 1 }}
                          >
                            ID: {order.internal_id}
                          </Typography>
                        )}

                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mt: 2,
                          }}
                        >
                          <Chip
                            label={
                              order.isConfirmed
                                ? "Confermato"
                                : "Non Confermato"
                            }
                            color={order.isConfirmed ? "success" : "error"}
                            variant="outlined"
                            size="small"
                          />
                          <Typography
                            variant="body2"
                            color="primary"
                            sx={{ fontWeight: 600 }}
                          >
                            Visualizza →
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Paper>

        {/* Dialog per aggiungere/modificare zone di consegna */}
        <Dialog
          open={openZoneDialog}
          onClose={handleCloseZoneDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {zoneToEdit !== null
              ? "Modifica Zona di Consegna"
              : "Aggiungi Zona di Consegna"}
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Nome Zona"
              fullWidth
              variant="outlined"
              value={zoneValue}
              onChange={(e) => setZoneValue(e.target.value)}
              placeholder="Es. Centro, Periferia, Zona Industriale..."
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseZoneDialog}>Annulla</Button>
            <Button
              onClick={handleSaveZone}
              variant="contained"
              disabled={!zoneValue.trim()}
            >
              {zoneToEdit !== null ? "Modifica" : "Aggiungi"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar per feedback utente */}
        <Snackbar
          open={showSuccessMessage}
          autoHideDuration={4000}
          onClose={() => setShowSuccessMessage(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={() => setShowSuccessMessage(false)}
            severity="success"
            sx={{ width: "100%" }}
          >
            Cliente aggiornato con successo!
          </Alert>
        </Snackbar>

        <Snackbar
          open={showErrorMessage}
          autoHideDuration={6000}
          onClose={() => setShowErrorMessage(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={() => setShowErrorMessage(false)}
            severity="error"
            sx={{ width: "100%" }}
          >
            Errore durante l'aggiornamento del cliente. Riprova.
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default CustomerPage;
