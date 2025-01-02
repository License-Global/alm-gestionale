import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Switch,
  Select,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";
import { motion } from "framer-motion";
import { RemoveCircle } from "@mui/icons-material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { TwitterPicker } from "react-color"; // Color picker
import dayjs from "dayjs";

const AddTable = ({ genericOrderData, personale, newOrderHandler }) => {
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
  const [activitiesNames, setActivitiesNames] = useState([]);
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  // Funzione per aggiungere una nuova riga
  const handleAddRow = () => {
    // Verifica se i campi name, startDate, ed endDate sono popolati
    if (newRow.name.trim() !== "" && newRow.startDate && newRow.endDate) {
      setRows([...rows, { ...newRow }]);
      setNewRow({
        name: "",
        inCalendar: false,
        color: "",
        responsible: "",
        startDate: null,
        endDate: null,
      }); // Resetta il campo dopo l'inserimento
    } else {
      // Gestione errore (facoltativo)
      alert("Compila i campi Nome, Data Inizio e Data Fine per procedere");
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

  const handleChange = (field, value) => {
    setNewRow({ ...newRow, [field]: value });
  };

  useEffect(() => {
    setNewOrder({
      orderName: genericOrderData.orderName,
      startDate: genericOrderData.startDate,
      endDate: genericOrderData.endDate,
      materialShelf: genericOrderData.materialShelf,
      accessories: genericOrderData.accessories,
      internal_id: genericOrderData.internal_id,
      urgency: genericOrderData.urgency,
      orderManager: genericOrderData.orderManager,
      activities: formatRows(rows),
    });
  }, [genericOrderData, rows]);

  useEffect(() => {
    newOrderHandler(newOrder, activitiesNames);
  }, [newOrder, activitiesNames]);

  useEffect(() => {
    const activitiesNames = rows.map((row) => row.name);
    setActivitiesNames(activitiesNames);
  }, [rows.length]);

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nome attività</TableCell>
            <TableCell>Calendario</TableCell>
            <TableCell>Colore</TableCell>
            <TableCell>Responsabile</TableCell>
            <TableCell>Data inizio</TableCell>
            <TableCell>Data scadenza</TableCell>
            <TableCell></TableCell>
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
              <TableCell align="center">
                <motion.div
                  whileHover={{
                    scale: 1.2,
                  }}
                  transition={{
                    duration: 0.2, // Transizione rapida e fluida
                    ease: "easeInOut", // Facilità sia all'entrata che all'uscita
                  }}
                >
                  <RemoveCircle
                    sx={{ cursor: "pointer", width: "32px", height: "32px" }}
                    color="error"
                    onClick={() => setRows(rows.filter((_, i) => i !== index))}
                  />
                </motion.div>
              </TableCell>
            </TableRow>
          ))}
          {/* Riga per aggiungere nuovi dati */}
          {}
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
              {newRow.inCalendar && newRow.inCalendar ? (
                <TwitterPicker
                  styles={{
                    default: {
                      card: {
                        boxShadow: `0 0 10px ${newRow.color}`,
                      },
                    },
                  }}
                  color={newRow.color}
                  onChangeComplete={(color) => handleChange("color", color.hex)}
                />
              ) : (
                <>
                  <div style={{ visibility: "hidden" }}>
                    <TwitterPicker
                      styles={{
                        default: {
                          card: {
                            boxShadow: `0 0 10px ${newRow.color}`,
                          },
                        },
                      }}
                      color={newRow.color}
                      onChangeComplete={(color) =>
                        handleChange("color", color.hex)
                      }
                    />
                  </div>
                </>
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
                {personale.map((personale) => (
                  <MenuItem
                    key={personale.workerName}
                    value={personale.workerName}
                  >
                    {personale.workerName}
                  </MenuItem>
                ))}
              </Select>
            </TableCell>
            <TableCell>
              <DateTimePicker
                label="Data inizio"
                skipDisabled
                value={newRow.startDate}
                defaultValue={dayjs().add(5, "minute")}
                onChange={(date) => handleChange("startDate", date)}
                minTime={dayjs().hour(6).minute(0)}
                maxTime={dayjs().hour(20).minute(0)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </TableCell>
            <TableCell>
              <DateTimePicker
                label="Data scadenza"
                skipDisabled
                value={newRow.endDate}
                defaultValue={dayjs().add(15, "minute")}
                onChange={(date) => handleChange("endDate", date)}
                minTime={dayjs().hour(6).minute(0)}
                maxTime={dayjs().hour(20).minute(0)}
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

      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleClose}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Tutti i campi sono obbligatori
        </Alert>
      </Snackbar>
    </TableContainer>
  );
};

export default AddTable;
