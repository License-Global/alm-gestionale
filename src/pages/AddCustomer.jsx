import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  Paper,
  FormLabel,
} from "@mui/material";
import BackButton from "../components/misc/BackButton";
import { addCustomer } from "../services/customerService";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { customerAddSchema } from "../utils/validations/validationSchemes";

const AddCustomer = () => {
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      customer_name: "",
      customer_address: "",
      customer_email: "",
      customer_phone: "",
      customer_note: "",
    },
    validationSchema: customerAddSchema,
    onSubmit: (values) => {
      try {
        addCustomer(values).then(() => {
          formik.resetForm();
          navigate("/impostazioni");
        });
      } catch (error) {
        console.error("Error adding operator:", error);
      }
    },
  });

  return (
    <Box sx={{ minHeight: "85vh", backgroundColor: "#f5f5f5", py: 4 }}>
      <Container maxWidth="lg">
        <BackButton title="Indietro" direction="/impostazioni" />
        <Paper elevation={3} sx={{ p: 4, width: "100%" }}>
          <Typography
            color="primary"
            sx={{ mb: 4 }}
            variant="h4"
            align="left"
            gutterBottom
          >
            Aggiungi Cliente
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormLabel>Nome</FormLabel>
              <TextField
                fullWidth
                required
                margin="normal"
                variant="standard"
                value={formik.values.customer_name}
                onChange={formik.handleChange}
                name="customer_name"
                onBlur={formik.handleBlur}
                error={
                  formik.touched.customer_name &&
                  Boolean(formik.errors.customer_name)
                }
                helperText={
                  formik.touched.customer_name && formik.errors.customer_name
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormLabel>Indirizzo</FormLabel>
              <TextField
                fullWidth
                margin="normal"
                variant="standard"
                value={formik.values.customer_address}
                onChange={formik.handleChange}
                name="customer_address"
                onBlur={formik.handleBlur}
                error={
                  formik.touched.customer_address &&
                  Boolean(formik.errors.customer_address)
                }
                helperText={
                  formik.touched.customer_address &&
                  formik.errors.customer_address
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormLabel>Email</FormLabel>
              <TextField
                fullWidth
                margin="normal"
                variant="standard"
                value={formik.values.customer_email}
                onChange={formik.handleChange}
                name="customer_email"
                onBlur={formik.handleBlur}
                error={
                  formik.touched.customer_email &&
                  Boolean(formik.errors.customer_email)
                }
                helperText={
                  formik.touched.customer_email && formik.errors.customer_email
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormLabel>Telefono</FormLabel>
              <TextField
                fullWidth
                margin="normal"
                variant="standard"
                value={formik.values.customer_phone}
                onChange={formik.handleChange}
                name="customer_phone"
                onBlur={formik.handleBlur}
                error={
                  formik.touched.customer_phone &&
                  Boolean(formik.errors.customer_phone)
                }
                helperText={
                  formik.touched.customer_phone && formik.errors.customer_phone
                }
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <FormLabel>Note</FormLabel>
              <TextField
                fullWidth
                margin="normal"
                variant="standard"
                value={formik.values.customer_note}
                onChange={formik.handleChange}
                name="customer_note"
                multiline
                onBlur={formik.handleBlur}
                error={
                  formik.touched.customer_note &&
                  Boolean(formik.errors.customer_note)
                }
                helperText={
                  formik.touched.customer_note && formik.errors.customer_note
                }
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} justifyContent="flex-end" sx={{ mt: 4 }}>
            <Grid item>
              <Button
                type="submit"
                onClick={formik.handleSubmit}
                color="secondary"
                variant="contained"
              >
                <b>Conferma</b>
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default AddCustomer;
