import React, { useState } from "react";
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
import { useFormik } from "formik";
import { operatorAddSchema } from "../utils/validations/validationSchemes";
import { insertPersonale } from "../services/personaleService";
import { useNavigate } from "react-router-dom";

const AddOperator = () => {
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      workerName: "",
    },
    validationSchema: operatorAddSchema,
    onSubmit: (values) => {
      try {
        insertPersonale(values).then(() => {
          formik.resetForm();
          navigate("/impostazioni");
        });
      } catch (error) {
        console.error("Error adding operator:", error);
      }
    },
  });

  return (
    <Box sx={{ backgroundColor: "#f5f5f5", py: 4 }}>
      <form onSubmit={formik.handleSubmit}>
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
                Nuovo Operatore
              </Typography>
              <BackButton title="Indietro" direction="/impostazioni" />
            </Box>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormLabel>Nome</FormLabel>
                <TextField
                  fullWidth
                  margin="normal"
                  variant="standard"
                  required
                  value={formik.values.workerName}
                  onChange={formik.handleChange}
                  name="workerName"
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.workerName &&
                    Boolean(formik.errors.workerName)
                  }
                  helperText={
                    formik.touched.materialShelf && formik.errors.workerName
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormLabel>Indirizzo</FormLabel>
                <TextField
                  fullWidth
                  margin="normal"
                  variant="standard"
                  value={formik.values.operator_address}
                  onChange={formik.handleChange}
                  name="operator_address"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormLabel>Email</FormLabel>
                <TextField
                  fullWidth
                  margin="normal"
                  variant="standard"
                  value={formik.values.operator_email}
                  onChange={formik.handleChange}
                  name="operator_email"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormLabel>Telefono</FormLabel>
                <TextField
                  fullWidth
                  margin="normal"
                  variant="standard"
                  value={formik.values.operator_phone}
                  onChange={formik.handleChange}
                  name="operator_phone"
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <FormLabel>Note</FormLabel>
                <TextField
                  fullWidth
                  margin="normal"
                  variant="standard"
                  value={formik.values.operator_note}
                  onChange={formik.handleChange}
                  name="operator_note"
                  multiline
                />
              </Grid>
            </Grid>
            <Grid
              container
              spacing={2}
              justifyContent="flex-end"
              sx={{ mt: 4 }}
            >
              <Button variant="contained" type="submit">
                Salva
              </Button>
            </Grid>
          </Paper>
        </Container>
      </form>
    </Box>
  );
};

export default AddOperator;
