import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
} from "@mui/material";
import { useCustomer } from "../hooks/useCustomeres";
import BackButton from "../components/misc/BackButton";
import { deleteCustomer, updateCustomer } from "../services/customerService";
import { useNavigate } from "react-router-dom";

const CustomerPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { customer, loading, error } = useCustomer(id);

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

  const handleEdit = async (id, customerData) => {
    try {
      await updateCustomer(id, customerData).then(() => {
        navigate("/impostazioni");
      });
    } catch (error) {
      console.error("Error deleting operator:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCustomer(id).then(() => {
        navigate("/impostazioni");
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
            <Grid item>
              <Button
                onClick={() => handleDelete(customerData.id)}
                color="error"
                variant="contained"
              >
                <b>Rimuovi</b>
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default CustomerPage;
