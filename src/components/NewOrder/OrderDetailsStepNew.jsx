import React from "react";
import {
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment,
  Card,
  CardContent,
  Typography,
  Box,
} from "@mui/material";
import {
  Inventory2,
  Construction,
  Person,
  Business,
  CalendarMonth,
  LocationOn,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers";
import { motion } from "framer-motion";
import { useNewOrderForm } from "../../context/NewOrderFormContext";
import { useFormValidation } from "../../hooks/useFormValidation";

/**
 * Componente per il primo step del form - dati principali della commessa
 */
const OrderDetailsStep = ({ customersList, personale, customers }) => {
  const { state, actions } = useNewOrderForm();
  const { validationErrors, touched, validateField } = useFormValidation();

  const handleFieldChange = async (field, value) => {
    actions.updateField(field, value);
    await validateField(field, value);
  };

  const handleFieldBlur = async (field) => {
    await validateField(field, state[field]);
  };

  // Trova le zone di consegna del cliente selezionato
  const selectedCustomer = customers?.find(
    (customer) => customer.id === state.clientId
  );
  const deliveryZones = selectedCustomer?.zone_consegna || [];
  const hasDeliveryZones = deliveryZones.length > 0;

  // Reset del campo zone quando cambia il cliente
  const handleClientChange = async (value) => {
    await handleFieldChange("clientId", value);
    // Reset della zona di consegna quando cambia il cliente
    await handleFieldChange("zone_consegna", "");
  };

  return (
    <motion.div
      key="step1"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      layout
    >
      <Box sx={{ spacing: 3 }}>
        {/* Card Informazioni Principali */}
        <Card elevation={2} sx={{ mb: 3, borderRadius: 2 }}>
          <CardContent sx={{ pb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Business sx={{ mr: 1, color: "primary.main" }} />
              <Typography variant="h6" color="primary" fontWeight="600">
                Informazioni Commessa
              </Typography>
            </Box>
            <Grid container spacing={3}>
              {/* Nome commessa */}
              <Grid item xs={12}>
                <TextField
                  id="orderName"
                  name="orderName"
                  fullWidth
                  label="Nome commessa"
                  required
                  value={state.orderName}
                  onChange={(e) =>
                    handleFieldChange("orderName", e.target.value)
                  }
                  onBlur={() => handleFieldBlur("orderName")}
                  error={
                    touched.orderName && Boolean(validationErrors.orderName)
                  }
                  helperText={touched.orderName && validationErrors.orderName}
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": { borderColor: "primary.main" },
                    },
                  }}
                />
              </Grid>

              {/* Cliente e Zona di consegna */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="clientId">Cliente</InputLabel>
                  <Select
                    fullWidth
                    id="clientId"
                    name="clientId"
                    label="Cliente"
                    value={state.clientId}
                    onChange={(e) => handleClientChange(e.target.value)}
                    onBlur={() => handleFieldBlur("clientId")}
                    error={
                      touched.clientId && Boolean(validationErrors.clientId)
                    }
                    startAdornment={
                      <InputAdornment position="start">
                        <Person sx={{ color: "primary.main" }} />
                      </InputAdornment>
                    }
                  >
                    {customersList.map((customer) => (
                      <MenuItem key={customer.id} value={customer.id}>
                        {customer.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {touched.clientId && validationErrors.clientId && (
                    <Typography
                      variant="caption"
                      color="error"
                      sx={{ mt: 0.5, ml: 1 }}
                    >
                      {validationErrors.clientId}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl
                  fullWidth
                  variant="outlined"
                  disabled={!state.clientId || !hasDeliveryZones}
                >
                  <InputLabel id="zone_consegna">Zona di consegna</InputLabel>
                  <Select
                    fullWidth
                    id="zone_consegna"
                    name="zone_consegna"
                    label="Zona di consegna"
                    value={state.zone_consegna}
                    onChange={(e) =>
                      handleFieldChange("zone_consegna", e.target.value)
                    }
                    onBlur={() => handleFieldBlur("zone_consegna")}
                    error={
                      touched.zone_consegna &&
                      Boolean(validationErrors.zone_consegna)
                    }
                    startAdornment={
                      <InputAdornment position="start">
                        <LocationOn
                          sx={{
                            color: hasDeliveryZones
                              ? "primary.main"
                              : "grey.400",
                          }}
                        />
                      </InputAdornment>
                    }
                  >
                    {deliveryZones.map((zone, index) => (
                      <MenuItem key={index} value={zone}>
                        {zone}
                      </MenuItem>
                    ))}
                  </Select>
                  {touched.zone_consegna && validationErrors.zone_consegna && (
                    <Typography
                      variant="caption"
                      color="error"
                      sx={{ mt: 0.5, ml: 1 }}
                    >
                      {validationErrors.zone_consegna}
                    </Typography>
                  )}
                  {!state.clientId && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mt: 0.5, ml: 1 }}
                    >
                      Seleziona prima un cliente
                    </Typography>
                  )}
                  {state.clientId && !hasDeliveryZones && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mt: 0.5, ml: 1 }}
                    >
                      Nessuna zona disponibile per questo cliente
                    </Typography>
                  )}
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Card Tempistiche */}
        <Card elevation={2} sx={{ mb: 3, borderRadius: 2 }}>
          <CardContent sx={{ pb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <CalendarMonth sx={{ mr: 1, color: "primary.main" }} />
              <Typography variant="h6" color="primary" fontWeight="600">
                Tempistiche
              </Typography>
            </Box>
            <Grid container spacing={3}>
              {/* Data inizio */}
              <Grid item xs={12} sm={6}>
                <DatePicker
                  id="startDate"
                  name="startDate"
                  disablePast
                  sx={{ width: "100%" }}
                  label="Inizio commessa"
                  value={state.startDate}
                  onChange={(value) => handleFieldChange("startDate", value)}
                  onError={(error) => {
                    if (error) {
                      handleFieldChange("startDate", null);
                    }
                  }}
                  slotProps={{
                    textField: {
                      variant: "outlined",
                      error:
                        touched.startDate &&
                        Boolean(validationErrors.startDate),
                      helperText:
                        touched.startDate && validationErrors.startDate,
                      onBlur: () => handleFieldBlur("startDate"),
                    },
                  }}
                />
              </Grid>

              {/* Data fine */}
              <Grid item xs={12} sm={6}>
                <DatePicker
                  id="endDate"
                  name="endDate"
                  disablePast
                  minDate={state.startDate}
                  sx={{ width: "100%" }}
                  label="Fine commessa"
                  value={state.endDate}
                  onChange={(value) => handleFieldChange("endDate", value)}
                  onError={(error) => {
                    if (error) {
                      handleFieldChange("endDate", null);
                    }
                  }}
                  slotProps={{
                    textField: {
                      variant: "outlined",
                      error:
                        touched.endDate && Boolean(validationErrors.endDate),
                      helperText: touched.endDate && validationErrors.endDate,
                      onBlur: () => handleFieldBlur("endDate"),
                    },
                  }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Card Risorse e Gestione */}
        <Card elevation={2} sx={{ mb: 3, borderRadius: 2 }}>
          <CardContent sx={{ pb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Inventory2 sx={{ mr: 1, color: "primary.main" }} />
              <Typography variant="h6" color="primary" fontWeight="600">
                Risorse e Gestione
              </Typography>
            </Box>
            <Grid container spacing={3}>
              {/* Scaffale accessori */}
              <Grid item xs={12} sm={6}>
                <TextField
                  id="accessories"
                  name="accessories"
                  fullWidth
                  label="Scaffale accessori"
                  value={state.accessories}
                  onChange={(e) =>
                    handleFieldChange("accessories", e.target.value)
                  }
                  onBlur={() => handleFieldBlur("accessories")}
                  error={
                    touched.accessories && Boolean(validationErrors.accessories)
                  }
                  helperText={
                    touched.accessories && validationErrors.accessories
                  }
                  variant="outlined"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Construction sx={{ color: "primary.main" }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Grid>

              {/* Scaffale materiale */}
              <Grid item xs={12} sm={6}>
                <TextField
                  id="materialShelf"
                  name="materialShelf"
                  fullWidth
                  label="Scaffale materiale"
                  value={state.materialShelf}
                  onChange={(e) =>
                    handleFieldChange("materialShelf", e.target.value)
                  }
                  onBlur={() => handleFieldBlur("materialShelf")}
                  error={
                    touched.materialShelf &&
                    Boolean(validationErrors.materialShelf)
                  }
                  helperText={
                    touched.materialShelf && validationErrors.materialShelf
                  }
                  variant="outlined"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Inventory2 sx={{ color: "primary.main" }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Grid>

              {/* Priorità */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="orderPriority-label">Priorità</InputLabel>
                  <Select
                    id="urgency"
                    name="urgency"
                    labelId="orderPriority-label"
                    required
                    label="Priorità"
                    value={state.urgency}
                    onChange={(e) =>
                      handleFieldChange("urgency", e.target.value)
                    }
                    onBlur={() => handleFieldBlur("urgency")}
                    error={touched.urgency && Boolean(validationErrors.urgency)}
                  >
                    <MenuItem value="Urgente">
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            bgcolor: "#f44336",
                            mr: 1,
                          }}
                        />
                        Urgente
                      </Box>
                    </MenuItem>
                    <MenuItem value="Alta">
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            bgcolor: "#ff9800",
                            mr: 1,
                          }}
                        />
                        Alta
                      </Box>
                    </MenuItem>
                    <MenuItem value="Media">
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            bgcolor: "#ffc107",
                            mr: 1,
                          }}
                        />
                        Media
                      </Box>
                    </MenuItem>
                    <MenuItem value="Bassa">
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            bgcolor: "#8bc34a",
                            mr: 1,
                          }}
                        />
                        Bassa
                      </Box>
                    </MenuItem>
                  </Select>
                  {touched.urgency && validationErrors.urgency && (
                    <Typography
                      variant="caption"
                      color="error"
                      sx={{ mt: 0.5, ml: 1 }}
                    >
                      {validationErrors.urgency}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              {/* Responsabile */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="orderManager-label">Responsabile</InputLabel>
                  <Select
                    id="orderManager"
                    name="orderManager"
                    required
                    labelId="orderManager-label"
                    label="Responsabile"
                    value={state.orderManager}
                    onChange={(e) =>
                      handleFieldChange("orderManager", e.target.value)
                    }
                    onBlur={() => handleFieldBlur("orderManager")}
                    error={
                      touched.orderManager &&
                      Boolean(validationErrors.orderManager)
                    }
                    startAdornment={
                      <InputAdornment position="start">
                        <Person sx={{ color: "primary.main" }} />
                      </InputAdornment>
                    }
                  >
                    {personale.map((worker, index) => (
                      <MenuItem key={index} value={worker.id}>
                        {worker.workerName}
                      </MenuItem>
                    ))}
                  </Select>
                  {touched.orderManager && validationErrors.orderManager && (
                    <Typography
                      variant="caption"
                      color="error"
                      sx={{ mt: 0.5, ml: 1 }}
                    >
                      {validationErrors.orderManager}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </motion.div>
  );
};

export default OrderDetailsStep;
