import React, { useState } from "react";
import {
  Checkbox,
  FormControlLabel,
  Button,
  Grid,
  Typography,
  Paper,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/it"; // Importa la localizzazione italiana
import { priorityList, statusList } from "../../utils/enums/miscEnums";
import { useOrderUpdate } from "../../hooks/useOrderUpdate";
import { useOrderActivityUpdate } from "../../hooks/useOrderActivityUpdate";
import { usePersonale } from "../../hooks/usePersonale";

export default function EditOrder({ order }) {
  const {
    loading: orderLoading,
    error: orderError,
    updateStartDate,
    updateEndDate,
    updateIsConfirmed,
    updateOrderName,
    updateMaterialShelf,
    updateAccessories,
    updateUrgency,
    updateOrderManager,
  } = useOrderUpdate();

  const {
    loading: activityLoading,
    error: activityError,
    updateActivities,
    updateActivityByName,
  } = useOrderActivityUpdate();

  const personale = usePersonale();

  const [orderData, setOrderData] = useState(order);
  const [tempOrderData, setTempOrderData] = useState(order);
  const [openActivityDialog, setOpenActivityDialog] = useState(false);
  const [currentActivity, setCurrentActivity] = useState(null);
  const [currentActivityIndex, setCurrentActivityIndex] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const updatedValue = type === "checkbox" ? checked : value;
    setTempOrderData((prevData) => ({
      ...prevData,
      [name]: updatedValue,
    }));
  };

  const handleSaveOrder = async () => {
    const {
      orderName,
      startDate,
      endDate,
      materialShelf,
      accessories,
      urgency,
      orderManager,
      isConfirmed,
    } = tempOrderData;

    await updateOrderName(order.id, orderName);
    await updateStartDate(order.id, startDate);
    await updateEndDate(order.id, endDate);
    await updateMaterialShelf(order.id, materialShelf);
    await updateAccessories(order.id, accessories);
    await updateUrgency(order.id, urgency);
    await updateOrderManager(order.id, orderManager);
    await updateIsConfirmed(order.id, isConfirmed);

    // Salva le modifiche alle attività
    const updatedActivities = tempOrderData.activities.map((activity) => {
      if (activity.status === "Completato") {
        return { ...activity, completed: new Date().toISOString() };
      }
      return { ...activity, completed: null };
    });

    await Promise.all(
      updatedActivities.map((activity) =>
        updateActivityByName(order.id, activity.name, activity)
      )
    );

    setOrderData(tempOrderData); // Sync temp data with order data
  };

  const handleActivityEdit = (index) => {
    setCurrentActivity({ ...tempOrderData.activities[index] });
    setCurrentActivityIndex(index);
    setOpenActivityDialog(true);
  };

  const handleActivityInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (currentActivity) {
      setCurrentActivity((prevActivity) => ({
        ...prevActivity,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleDialogSave = () => {
    if (currentActivity && currentActivityIndex !== null) {
      const updatedActivities = [...tempOrderData.activities];
      updatedActivities[currentActivityIndex] = currentActivity;
      setTempOrderData((prevData) => ({
        ...prevData,
        activities: updatedActivities,
      }));
    }
    setOpenActivityDialog(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="it">
      <Paper elevation={3} sx={{ p: 3, m: 2 }}>
        <Typography variant="h4" gutterBottom>
          Modifica Ordine
        </Typography>
        <form>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Nome Ordine"
                name="orderName"
                value={tempOrderData.orderName}
                onChange={handleInputChange}
                disabled={orderLoading}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <DateTimePicker
                label="Data di Inizio"
                value={dayjs(tempOrderData.startDate)}
                onChange={(date) =>
                  setTempOrderData((prevData) => ({
                    ...prevData,
                    startDate: date ? date.toISOString() : "",
                  }))
                }
                renderInput={(params) => (
                  <TextField {...params} fullWidth disabled={orderLoading} />
                )}
                disablePast
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <DateTimePicker
                label="Data di fine"
                value={dayjs(tempOrderData.endDate)}
                onChange={(date) =>
                  setTempOrderData((prevData) => ({
                    ...prevData,
                    endDate: date ? date.toISOString() : "",
                  }))
                }
                renderInput={(params) => (
                  <TextField {...params} fullWidth disabled={orderLoading} />
                )}
                disablePast
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Scaffale Materiale"
                name="materialShelf"
                value={tempOrderData.materialShelf}
                onChange={handleInputChange}
                disabled={orderLoading}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Accessori"
                name="accessories"
                value={tempOrderData.accessories}
                onChange={handleInputChange}
                disabled={orderLoading}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel>Urgenza</InputLabel>
                <Select
                  label="Urgenza"
                  name="urgency"
                  value={tempOrderData.urgency || ""}
                  onChange={handleInputChange}
                  disabled={orderLoading}
                >
                  {priorityList.map((priority) => (
                    <MenuItem key={priority} value={priority}>
                      {priority}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel>Manager dell'Ordine</InputLabel>
                <InputLabel>Manager dell'Ordine</InputLabel>
                <Select
                  label="Manager dell'Ordine"
                  name="orderManager"
                  value={tempOrderData.orderManager}
                  onChange={handleInputChange}
                  disabled={orderLoading}
                >
                  {personale.personale.map((person) => (
                    <MenuItem key={person.workerName} value={person.workerName}>
                      {person.workerName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={tempOrderData.isConfirmed}
                    onChange={handleInputChange}
                    name="isConfirmed"
                    disabled={orderLoading}
                  />
                }
                label="Confermato dal cliente"
              />
            </Grid>
          </Grid>

          <Box mt={4}>
            <Typography variant="h5" gutterBottom>
              Attività
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nome</TableCell>
                    <TableCell>Responsabile</TableCell>
                    <TableCell>Stato</TableCell>
                    <TableCell>Data Inizio</TableCell>
                    <TableCell>Data Fine</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tempOrderData.activities.map((activity, index) => (
                    <TableRow key={index}>
                      <TableCell>{activity.name}</TableCell>
                      <TableCell>{activity.responsible}</TableCell>
                      <TableCell>{activity.status}</TableCell>
                      <TableCell>
                        {activity.startDate
                          ? new Date(activity.startDate).toLocaleString()
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        {activity.endDate
                          ? new Date(activity.endDate).toLocaleString()
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleActivityEdit(index)}>
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Box display="flex" justifyContent="flex-end" mt={3}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveOrder}
              disabled={orderLoading || activityLoading}
            >
              Salva Modifiche
            </Button>
          </Box>
        </form>

        <Dialog
          open={openActivityDialog}
          onClose={() => setOpenActivityDialog(false)}
        >
          <DialogTitle>Modifica Attività</DialogTitle>
          <DialogContent>
            {currentActivity && (
              <Grid sx={{ mt: "2px" }} container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Nome"
                    name="name"
                    value={currentActivity.name}
                    onChange={handleActivityInputChange}
                    disabled
                  />
                </Grid>
                <Grid item xs={12}>
                  <Select
                    label="Responsabile"
                    name="responsible"
                    value={currentActivity.responsible}
                    onChange={handleActivityInputChange}
                    disabled={orderLoading}
                  >
                    {personale.personale.map((person) => (
                      <MenuItem
                        key={person.workerName}
                        value={person.workerName}
                      >
                        {person.workerName}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                <Grid item xs={12}>
                  <DateTimePicker
                    label="Data Inizio"
                    value={dayjs(currentActivity.startDate)}
                    onChange={(date) =>
                      setCurrentActivity((prevActivity) => ({
                        ...prevActivity,
                        startDate: date ? date.toISOString() : "",
                      }))
                    }
                    renderInput={(params) => (
                      <TextField {...params} fullWidth />
                    )}
                    disablePast
                  />
                </Grid>
                <Grid item xs={12}>
                  <DateTimePicker
                    label="Data Fine"
                    value={dayjs(currentActivity.endDate)}
                    onChange={(date) =>
                      setCurrentActivity((prevActivity) => ({
                        ...prevActivity,
                        endDate: date ? date.toISOString() : "",
                      }))
                    }
                    renderInput={(params) => (
                      <TextField {...params} fullWidth />
                    )}
                    disablePast
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={currentActivity.inCalendar}
                        onChange={handleActivityInputChange}
                        name="inCalendar"
                      />
                    }
                    label="In Calendario"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Stato</InputLabel>
                    <Select
                      fullWidth
                      name="status"
                      value={currentActivity.status}
                      onChange={handleActivityInputChange}
                    >
                      {statusList.map((status) => (
                        <MenuItem key={status} value={status}>
                          {status}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenActivityDialog(false)} color="error">
              Annulla
            </Button>
            <Button onClick={handleDialogSave} color="primary">
              Salva
            </Button>
          </DialogActions>
        </Dialog>
        {orderError && (
          <Typography color="error">Errore ordine: {orderError}</Typography>
        )}
        {activityError && (
          <Typography color="error">
            Errore attività: {activityError}
          </Typography>
        )}
      </Paper>
    </LocalizationProvider>
  );
}
