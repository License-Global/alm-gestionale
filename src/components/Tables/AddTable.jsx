import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Switch,
  Select,
  MenuItem,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { TwitterPicker } from "react-color"; // Color picker
import dayjs from "dayjs";
import { createOrder } from "../../services/activitiesService";

const AddTable = ({ genericOrderData }) => {
  const [newOrder, setNewOrder] = useState({});
  const [rows, setRows] = useState([]);
  const [newRow, setNewRow] = useState({
    name: "",
    inCalendar: false,
    color: "",
    responsible: "",
    startDate: null,
    endDate: null,
  });

  // Funzione per aggiungere una nuova riga
  const handleAddRow = () => {
    if (newRow.name.trim() !== "") {
      setRows([...rows, { ...newRow }]);
      setNewRow({
        name: "",
        inCalendar: false,
        color: "",
        responsible: "",
        startDate: null,
        endDate: null,
      }); // Resetta il campo dopo l'inserimento
    }
  };

  // Funzione per confermare e stampare le righe in console (in formato ISO)
  const formatRows = (rowsToFormat) => {
    if (rowsToFormat) {
      const formattedRows = rowsToFormat.map((row) => ({
        ...row,
        startDate: row.startDate ? dayjs(row.startDate).toDate() : null, // Converte in formato ISO
        endDate: row.endDate ? dayjs(row.endDate).toDate() : null, // Converte in formato ISO
      }));
      return formattedRows;
    }
  };

  const handleConfirm = async () => {
    const createdOrder = await createOrder(newOrder);
    if (createdOrder) {
      console.log("Ordine creato con successo:", createdOrder);
    }
  };

  const handleChange = (field, value) => {
    setNewRow({ ...newRow, [field]: value });
  };

  useEffect(() => {
    setNewOrder({
      orderName: genericOrderData.orderName,
      order_start_date: genericOrderData.startDate,
      materialShelf: genericOrderData.materialShelf,
      accessori: genericOrderData.accessories,
      internal_id: genericOrderData.internal_id,
      urgency: genericOrderData.urgency,
      orderManager: genericOrderData.orderManager,
      activities: formatRows(rows),
    });
  }, [genericOrderData, rows]);
  return (
    <TableContainer component={Paper}>
      <p onClick={() => console.log(newOrder)}>asd</p>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nome attività</TableCell>
            <TableCell>Calendario</TableCell>
            <TableCell>Colore</TableCell>
            <TableCell>Responsabile</TableCell>
            <TableCell>Data inizio</TableCell>
            <TableCell>Data scadenza</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows?.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.inCalendar ? "Sì" : "No"}</TableCell>
              <TableCell>
                {row.inCalendar && (
                  <div
                    style={{
                      backgroundColor: row.color,
                      width: "50px",
                      height: "20px",
                    }}
                  ></div>
                )}
              </TableCell>
              <TableCell>{row.responsible}</TableCell>
              <TableCell>
                {row.startDate
                  ? dayjs(row.startDate).format("DD/MM/YYYY HH:mm")
                  : ""}
              </TableCell>
              <TableCell>
                {row.endDate
                  ? dayjs(row.endDate).format("DD/MM/YYYY HH:mm")
                  : ""}
              </TableCell>
            </TableRow>
          ))}
          {/* Riga per aggiungere nuovi dati */}
          <TableRow>
            <TableCell>
              <TextField
                value={newRow.name}
                onChange={(e) => handleChange("name", e.target.value)}
                label="Nome attività"
                variant="outlined"
                fullWidth
              />
            </TableCell>
            <TableCell>
              <Switch
                checked={newRow.inCalendar}
                onChange={(e) => handleChange("inCalendar", e.target.checked)}
              />
            </TableCell>
            <TableCell>
              {newRow.inCalendar && (
                <TwitterPicker
                  color={newRow.color}
                  onChangeComplete={(color) => handleChange("color", color.hex)}
                />
              )}
            </TableCell>
            <TableCell>
              <Select
                value={newRow.responsible}
                onChange={(e) => handleChange("responsible", e.target.value)}
                displayEmpty
                fullWidth
              >
                <MenuItem disabled value="">
                  <em>Seleziona responsabile</em>
                </MenuItem>
                <MenuItem value="Mario">Mario</MenuItem>
                <MenuItem value="Giulia">Giulia</MenuItem>
                <MenuItem value="Anna">Anna</MenuItem>
              </Select>
            </TableCell>
            <TableCell>
              <DateTimePicker
                label="Data inizio"
                value={newRow.startDate}
                onChange={(date) => handleChange("startDate", date)}
                minDateTime={dayjs()} // Impedisce di selezionare una data passata
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </TableCell>
            <TableCell>
              <DateTimePicker
                label="Data scadenza"
                value={newRow.endDate}
                onChange={(date) => handleChange("endDate", date)}
                minDateTime={newRow.startDate || dayjs()} // Impedisce di selezionare una scadenza prima della data di inizio
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </TableCell>
            <TableCell>
              <Button
                onClick={handleAddRow}
                variant="contained"
                color="primary"
              >
                Aggiungi
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      {/* Tasto di conferma per stampare l'ordine delle attività */}
      <Button
        onClick={handleConfirm}
        variant="contained"
        color="secondary"
        style={{ marginTop: "20px" }}
      >
        Conferma
      </Button>
    </TableContainer>
  );
};

export default AddTable;
