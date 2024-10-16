import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Grid,
  Typography,
  Paper,
  Menu,
  InputAdornment,
} from "@mui/material";

import { Inventory2, Construction, Assignment } from "@mui/icons-material";
import { DateTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { usePersonale } from "../hooks/usePersonale";
import useSession from "../hooks/useSession";
import { useNavigate } from "react-router-dom";
import AddTable from "../components/Tables/AddTable";

// import { useOrders } from "../hooks/useOrders";

const OrderForm = () => {
  const { session, loading } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!session) {
        navigate("/login");
      }
    }
  }, [session, loading, navigate]);

  const [orderName, setOrderName] = useState("");
  const [selectedDate, setSelectedDate] = useState(dayjs().add(1, "minute"));
  const [materialShelf, setMaterialShelf] = useState("");
  const [urgency, setUrgency] = useState("");
  const [accessories, setAccessories] = useState("");
  const [orderManager, setOrderManager] = useState("");
  // State per gestire il form

  const [formValues, setFormValues] = useState({
    orderName: orderName,
    startDate: selectedDate,
    materialShelf: materialShelf,
    urgency: urgency,
    accessories: accessories,
    orderManager: orderManager,
  });
  useEffect(() => {
    setFormValues({
      orderName: orderName,
      startDate: selectedDate.toDate(),
      materialShelf: materialShelf,
      urgency: urgency,
      accessories: accessories,
      orderManager: orderManager,
    });
  }, [
    orderName,
    selectedDate,
    materialShelf,
    urgency,
    accessories,
    orderManager,
  ]);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // const handleSelectChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormValues({
  //     ...formValues,
  //     [name]: value,
  //   });
  // };

  const { personale } = usePersonale();

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontFamily: "Montserrat, sans-serif",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        Nuova commessa
      </Typography>

      {/* Prima sezione del form */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Dettagli commessa
        </Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nome commessa"
              name="orderName"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Assignment />
                    </InputAdornment>
                  ),
                },
              }}
              value={orderName}
              onChange={(e) => setOrderName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DateTimePicker
              disablePast
              sx={{ width: "100%" }}
              label="Inizio commessa"
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Scaffale accessori"
              name="accessories"
              value={formValues.accessories}
              onChange={(e) => setAccessories(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Construction />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label={"Scaffale materiale"}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Inventory2 />
                    </InputAdornment>
                  ),
                },
              }}
              name="materialShelf"
              value={materialShelf}
              onChange={(e) => setMaterialShelf(e.target.value)}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="orderPriority-label">Priorità</InputLabel>
              <Select
                labelId="orderPriority-label"
                label="Priorità"
                name="urgency"
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
              >
                <MenuItem value="urgente">Urgente</MenuItem>
                <MenuItem value="alta">Alta</MenuItem>
                <MenuItem value="media">Media</MenuItem>
                <MenuItem value="bassa">Bassa</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="orderManager-label">Responsabile</InputLabel>
              <Select
                labelId="orderManager-label"
                label="Responsabile"
                name="orderManager"
                value={orderManager}
                onChange={(e) => setOrderManager(e.target.value)}
              >
                {personale.map((worker, index) => (
                  <MenuItem key={index} value={worker.workerName}>
                    {worker.workerName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Seconda sezione con la tabella */}
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 4 }}>
          <Typography variant="h6" gutterBottom>
            Attività
          </Typography>
          <Box
            sx={{ mb: 3, display: "flex", justifyContent: " flex-end", gap: 4 }}
          >
            <Button variant="contained" color="primary" id="basic-button">
              Nuovo schema
            </Button>
            <Button
              variant="contained"
              color="primary"
              id="basic-button"
              onClick={handleClick}
            >
              Scegli schema
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={handleClose}>My account</MenuItem>
              <MenuItem onClick={handleClose}>Logout</MenuItem>
            </Menu>
          </Box>
        </Box>
        <AddTable genericOrderData={formValues} />
      </Paper>
    </Box>
  );
};

export default OrderForm;
