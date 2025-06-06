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
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Divider,
  Card,
  CardContent,
} from "@mui/material";
import {
  Assignment as AssignmentIcon,
  CalendarToday as CalendarIcon,
  PriorityHigh as PriorityIcon,
} from "@mui/icons-material";
import { useCustomer } from "../hooks/useCustomeres";
import BackButton from "../components/misc/BackButton";
import { deleteCustomer, updateCustomer } from "../services/customerService";
import { supabase } from "../supabase/supabaseClient";
import { useNavigate } from "react-router-dom";

const CustomerPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { customer, loading, error } = useCustomer(id);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const [customerData, setCustomerData] = useState({
    customer_name: "",
    customer_address: "",
    customer_email: "",
    customer_phone: "",
    customer_note: "",
  });

  useEffect(() => {
    if (customer) {
      setCustomerData(customer);
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
          .select("id, orderName, startDate, endDate, urgency, isConfirmed, internal_id")
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
      await updateCustomer(id, customerData).then(() => {
        navigate("/clienti");
      });
    } catch (error) {
      console.error("Error deleting operator:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCustomer(id).then(() => {
        navigate("/clienti");
      });
    } catch (error) {
      console.error("Error deleting operator:", error);
    }
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
          </Grid>
          
          {/* Pulsanti di azione */}
          <Grid container spacing={2} justifyContent="flex-end" sx={{ mt: 4 }}>
            <Grid item>
              <Button
                onClick={() => handleEdit(id, customerData)}
                color="secondary"
                variant="contained"
              >
                <b>Conferma</b>
              </Button>
            </Grid>
          </Grid>
          
          {/* Sezione Ordini Collegati */}
          <Divider sx={{ my: 4 }} />
          <Box sx={{ mt: 4 }}>
            <Typography
              variant="h5"
              color="primary"
              sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}
            >
              <AssignmentIcon />
              Ordini Collegati ({orders.length})
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
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                            {order.orderName}
                          </Typography>
                          <Chip
                            label={order.urgency || "Bassa"}
                            color={getUrgencyColor(order.urgency)}
                            size="small"
                          />
                        </Box>
                        
                        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                          <CalendarIcon sx={{ fontSize: 16, mr: 1, color: "text.secondary" }} />
                          <Typography variant="body2" color="text.secondary">
                            Inizio: {order.startDate ? new Date(order.startDate).toLocaleDateString("it-IT") : "N/A"}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                          <CalendarIcon sx={{ fontSize: 16, mr: 1, color: "text.secondary" }} />
                          <Typography variant="body2" color="text.secondary">
                            Fine: {order.endDate ? new Date(order.endDate).toLocaleDateString("it-IT") : "N/A"}
                          </Typography>
                        </Box>
                        
                        {order.internal_id && (
                          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
                            ID: {order.internal_id}
                          </Typography>
                        )}
                        
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2 }}>
                          <Chip
                            label={order.isConfirmed ? "Confermato" : "Non Confermato"}
                            color={order.isConfirmed ? "success" : "error"}
                            variant="outlined"
                            size="small"
                          />
                          <Typography variant="body2" color="primary" sx={{ fontWeight: 600 }}>
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
      </Container>
    </Box>
  );
};

export default CustomerPage;
