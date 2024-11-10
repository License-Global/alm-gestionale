import React, { useState } from "react";
import {
  TextField,
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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { priorityList, statusList } from "../../utils/enums/miscEnums";

export default function EditOrder({ order }) {
  // const [orderData, setOrderData] = useState({
  //   id: 41,
  //   created_at: "2024-11-02T16:43:51.72575+00:00",
  //   startDate: "2024-11-04T07:30:56.005+00:00",
  //   isConfirmed: false,
  //   orderName: "Busalacchi",
  //   materialShelf: "A84",
  //   accessories: "A12",
  //   internal_id: "2024/0041",
  //   urgency: "urgente",
  //   orderManager: "Pino",
  //   activities: [
  //     {
  //       name: "Taglio",
  //       note: [],
  //       color: "#9900ef",
  //       status: "Completato",
  //       endDate: "2024-11-04T17:30:00.000Z",
  //       completed: "2024-11-09T14:23:55.574Z",
  //       startDate: "2024-11-03T15:30:00.000Z",
  //       inCalendar: true,
  //       responsible: "Walter White",
  //     },
  //     {
  //       name: "Trasporto",
  //       note: [],
  //       color: "#000",
  //       status: "Standby",
  //       endDate: "2024-11-05T17:35:00.000Z",
  //       completed: false,
  //       startDate: "2024-11-05T07:30:00.000Z",
  //       inCalendar: false,
  //       responsible: "Armando",
  //     },
  //     // ... other activities ...
  //   ],
  // });

  const [orderData, setOrderData] = useState(order);
  const [openActivityDialog, setOpenActivityDialog] = useState(false);
  const [currentActivity, setCurrentActivity] = useState(null);
  const [currentActivityIndex, setCurrentActivityIndex] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setOrderData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleActivityEdit = (index) => {
    setCurrentActivity(orderData.activities[index]);
    setCurrentActivityIndex(index);
    setOpenActivityDialog(true);
  };

  const handleActivityDelete = (index) => {
    setOrderData((prevData) => ({
      ...prevData,
      activities: prevData.activities.filter((_, i) => i !== index),
    }));
  };

  const handleActivitySave = () => {
    if (currentActivity && currentActivityIndex !== null) {
      setOrderData((prevData) => ({
        ...prevData,
        activities: prevData.activities.map((activity, index) =>
          index === currentActivityIndex ? currentActivity : activity
        ),
      }));
    }
    setOpenActivityDialog(false);
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

  return (
    <Paper elevation={3} sx={{ p: 3, m: 2 }}>
      <Typography variant="h4" gutterBottom>
        Modifica Ordine
      </Typography>
      <form>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nome Ordine"
              name="orderName"
              value={orderData.orderName}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Data di Inizio"
              name="startDate"
              type="datetime-local"
              value={orderData.startDate.slice(0, 16)}
              onChange={handleInputChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Scaffale Materiale"
              name="materialShelf"
              value={orderData.materialShelf}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Accessori"
              name="accessories"
              value={orderData.accessories}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Urgenza</InputLabel>
              <Select
                label="Urgenza"
                defaultValue={orderData.urgency}
                displayEmpty
                name="urgency"
                value={orderData.urgency || ""}
                onChange={handleInputChange}
              >
                {priorityList.map((priority) => (
                  <MenuItem
                    selected={priority === orderData.urgency}
                    key={priority}
                    value={priority}
                  >
                    {priority}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Manager dell'Ordine"
              name="orderManager"
              value={orderData.orderManager}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={orderData.isConfirmed}
                  onChange={handleInputChange}
                  name="isConfirmed"
                />
              }
              label="Confermato"
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
                  <TableCell>Azioni</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orderData.activities.map((activity, index) => (
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
                      <IconButton onClick={() => handleActivityDelete(index)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Box display="flex" justifyContent="flex-end" mt={3}>
          <Button variant="contained" color="primary" type="submit">
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
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nome"
                  name="name"
                  value={currentActivity.name}
                  onChange={handleActivityInputChange}
                  sx={{ mt: 1 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Responsabile"
                  name="responsible"
                  value={currentActivity.responsible}
                  onChange={handleActivityInputChange}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Data Inizio"
                  name="startDate"
                  type="datetime-local"
                  value={
                    currentActivity.startDate
                      ? currentActivity.startDate.slice(0, 16)
                      : ""
                  }
                  onChange={handleActivityInputChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Data Fine"
                  name="endDate"
                  type="datetime-local"
                  value={
                    currentActivity.endDate
                      ? currentActivity.endDate.slice(0, 16)
                      : ""
                  }
                  onChange={handleActivityInputChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
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
                <Typography variant="subtitle1">Stato:</Typography>
                <Select
                  fullWidth
                  name="status"
                  value={currentActivity.status}
                  onChange={handleActivityInputChange}
                >
                  <MenuItem disabled value="Standby">
                    Standby
                  </MenuItem>
                  <MenuItem value="in corso">In corso</MenuItem>
                  <MenuItem value="in attesa">In attesa</MenuItem>
                  <MenuItem value="Completato">
                    <b>Completato</b>
                  </MenuItem>
                </Select>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            sx={{
              boxShadow: 2,
              "&:hover": {
                bgcolor: "error.dark",
                boxShadow: 4,
              },
            }}
            color="error"
            onClick={() => setOpenActivityDialog(false)}
          >
            Annulla
          </Button>
          <Button
            variant="contained"
            sx={{
              boxShadow: 2,
              "&:hover": {
                bgcolor: "primary.main",
                boxShadow: 4,
              },
            }}
            color="primary"
            onClick={handleActivitySave}
          >
            Salva
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
