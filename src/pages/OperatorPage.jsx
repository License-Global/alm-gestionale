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
import BackButton from "../components/misc/BackButton";
import { useOperator } from "../hooks/usePersonale";
import { deletePersonale, updatePersonale } from "../services/personaleService";
import { useNavigate } from "react-router-dom";

const OperatorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { operator, loading, error } = useOperator(id);

  const [operatorData, setOperatorData] = useState({
    workerName: "",
    operator_address: "",
    operator_email: "",
    operator_phone: "",
    operator_note: "",
  });

  useEffect(() => {
    if (operator) {
      setOperatorData(operator);
    }
  }, [operator]);

  const handleEdit = async (id, workerName) => {
    try {
      await updatePersonale(id, workerName).then(() => {
        navigate("/impostazioni");
      });
    } catch (error) {
      console.error("Error deleting operator:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePersonale(id).then(() => {
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
    <Box sx={{ backgroundColor: "#f5f5f5", py: 4 }}>
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
              Dettaglio Operatore
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
                value={operatorData?.workerName}
                onChange={(e) =>
                  setOperatorData({
                    ...operatorData,
                    workerName: e.target.value,
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
                  setOperatorData({
                    ...operatorData,
                    operator_address: e.target.value,
                  })
                }
                value={operatorData?.operator_address}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormLabel>Email</FormLabel>
              <TextField
                fullWidth
                margin="normal"
                variant="standard"
                onChange={(e) => {
                  setOperatorData({
                    ...operatorData,
                    operator_email: e.target.value,
                  });
                }}
                value={operatorData?.operator_email}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormLabel>Telefono</FormLabel>
              <TextField
                fullWidth
                margin="normal"
                variant="standard"
                onChange={(e) => {
                  setOperatorData({
                    ...operatorData,
                    operator_phone: e.target.value,
                  });
                }}
                value={operatorData?.operator_phone}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <FormLabel>Note</FormLabel>
              <TextField
                fullWidth
                margin="normal"
                variant="standard"
                onChange={(e) => {
                  setOperatorData({
                    ...operatorData,
                    operator_note: e.target.value,
                  });
                }}
                value={operatorData?.operator_note}
                multiline
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} justifyContent="flex-end" sx={{ mt: 4 }}>
            <Grid item>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  onClick={() => handleEdit(id, operatorData.workerName)}
                  color="secondary"
                  variant="contained"
                >
                  <b>Conferma</b>
                </Button>
                <Button
                  onClick={() => handleDelete(id)}
                  color="error"
                  variant="contained"
                >
                  <b>Rimuovi</b>
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default OperatorPage;
