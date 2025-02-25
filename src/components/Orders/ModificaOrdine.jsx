import React, { useState, useEffect } from "react";
import {
  Checkbox,
  FormControlLabel,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Container,
  Box,
  Button,
} from "@mui/material";
import dayjs from "dayjs";
import "dayjs/locale/it"; // Importa la localizzazione italiana
import { priorityList } from "../../utils/enums/miscEnums";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { ToastContainer, toast } from "react-toastify";
import { DatePicker } from "@mui/x-date-pickers";
import OrderEditRow from "./OrderEditRow";
import { updateOrder } from "../../services/orderService";

const ModificaOrdine = ({ order, personale }) => {
  const [orderData, setOrderData] = useState({});

  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  const handleKeyDown = (event) => {
    const regex = /^[a-zA-Z0-9 ]*$/; // Permette lettere, numeri e spazi
    if (
      !regex.test(event.key) &&
      event.key !== "Backspace" &&
      event.key !== "Delete"
    ) {
      event.preventDefault();
    }
  };

  useEffect(() => {
    if (order) {
      setOrderData({
        orderName: order.orderName,
        urgency: order.urgency,
        orderManager: order.orderManager,
        isConfirmed: order.isConfirmed,
        materialShelf: order.materialShelf,
        accessories: order.accessories,
        startDate: order.startDate,
        endDate: order.endDate,
      });
    }
  }, [order]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const orderId = order.id; // ID dell'ordine da aggiornare
    try {
      const result = await updateOrder(orderId, orderData);
      notifySuccess("Ordine aggiornato:", result);
    } catch (error) {
      console.error("Errore durante l'aggiornamento:", error.message);
      notifyError(error.message);
    }
  };

  return (
    <div>
      <ToastContainer />
      <Container sx={{ bgcolor: "white" }} maxWidth={false}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <TextField
                value={orderData.orderName}
                onChange={(e) =>
                  setOrderData({ ...orderData, orderName: e.target.value })
                }
                label="Nome Ordine"
                name="orderName"
                onKeyDown={handleKeyDown}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <DatePicker
                label="Data di Inizio"
                value={dayjs(orderData.startDate)}
                onChange={(date) => {
                  setOrderData({
                    ...orderData,
                    startDate: dayjs(date).toISOString(),
                  });
                }}
                disablePast
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <DatePicker
                label="Data di fine"
                value={dayjs(orderData.endDate)}
                onChange={(date) => {
                  setOrderData({
                    ...orderData,
                    endDate: dayjs(date).toISOString(),
                  });
                }}
                disablePast
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Scaffale Materiale"
                value={orderData.materialShelf}
                onChange={(e) => {
                  setOrderData({ ...orderData, materialShelf: e.target.value });
                }}
                name="materialShelf"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Accessori"
                value={orderData.accessories}
                onChange={(e) => {
                  setOrderData({ ...orderData, accessories: e.target.value });
                }}
                name="accessories"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel>Urgenza</InputLabel>
                <Select
                  label="Urgenza"
                  name="urgency"
                  value={orderData.urgency || order.urgency}
                  defaultValue={order.urgency}
                  onChange={(e) =>
                    setOrderData({ ...orderData, urgency: e.target.value })
                  }
                >
                  {priorityList.map((priority, index) => (
                    <MenuItem key={index} value={priority}>
                      {priority}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel>Manager dell'Ordine</InputLabel>
                <Select
                  label="Manager dell'Ordine"
                  name="orderManager"
                  value={orderData.orderManager || order.orderManager}
                  defaultValue={order.orderManager}
                  onChange={(e) =>
                    setOrderData({ ...orderData, orderManager: e.target.value })
                  }
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
                    defaultChecked={order.isConfirmed}
                    name="isConfirmed"
                  />
                }
                label="Confermato dal cliente"
                onChange={(e) =>
                  setOrderData({ ...orderData, isConfirmed: e.target.checked })
                }
              />
            </Grid>
          </Grid>
          <Box display="flex" justifyContent="flex-end" my={3}>
            <Button variant="contained" color="primary" type="submit">
              Salva Modifiche
            </Button>
          </Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell>Responsabile</TableCell>
                  <TableCell>Stato</TableCell>
                  <TableCell>Inizio</TableCell>
                  <TableCell>Fine</TableCell>
                  <TableCell>Calendario</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {order.activities.map((activity, index) => (
                  <OrderEditRow
                    key={index}
                    activity={activity}
                    personale={personale}
                    orderid={order.id}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </form>
      </Container>
    </div>
  );
};

export default ModificaOrdine;
