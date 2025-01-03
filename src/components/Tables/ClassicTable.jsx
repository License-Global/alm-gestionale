import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Switch,
  Select,
  MenuItem,
  Paper,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { TwitterPicker } from "react-color";
import dayjs from "dayjs";

const ActivityTable = ({ selectedSchema, personale, setPresetActivities }) => {
  const [rows, setRows] = useState([]);
  const [isFormValid, setIsFormValid] = useState(false); // Stato per validazione

  // Effetto per caricare i nomi delle attività da un'ipotetica chiamata esterna
  useEffect(() => {
    const loadActivities = async () => {
      if (!selectedSchema) return;
      const activityNames = await selectedSchema.activities;
      const initialRows = activityNames.map((activityName) => ({
        name: activityName,
        inCalendar: false,
        color: "#000",
        responsible: "",
        startDate: null,
        endDate: null,
      }));
      setRows(initialRows);
    };

    loadActivities();
  }, [selectedSchema]);

  // Gestione del cambiamento dei dati in una riga
  const handleChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index] = { ...updatedRows[index], [field]: value };
    setRows(updatedRows);
  };

  // Funzione di validazione per verificare che i campi obbligatori siano compilati
  const validateForm = () => {
    const isValid = rows.every(
      (row) => row.responsible && row.startDate && row.endDate
    );
    setIsFormValid(isValid);
  };

  useEffect(() => {
    setPresetActivities(rows);
    validateForm(); // Valida il form ogni volta che le righe cambiano
  }, [rows, setPresetActivities]);

  return (
    <TableContainer sx={{ mt: 4 }} component={Paper}>
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
              <TableCell>
                <Switch
                  checked={row.inCalendar}
                  onChange={(e) =>
                    handleChange(index, "inCalendar", e.target.checked)
                  }
                />
              </TableCell>
              <TableCell>
                {row.inCalendar ? (
                  <TwitterPicker
                    styles={{
                      default: {
                        card: {
                          boxShadow: `0 0 10px ${row.color}`,
                        },
                      },
                    }}
                    color={row.color || "#000"}
                    onChangeComplete={(color) =>
                      handleChange(index, "color", color.hex)
                    }
                  />
                ) : (
                  <div style={{ visibility: "hidden" }}>
                    <TwitterPicker
                      styles={{
                        default: {
                          card: {
                            boxShadow: `0 0 10px ${row.color}`,
                          },
                        },
                      }}
                      color={row.color || "#000"}
                      onChangeComplete={(color) =>
                        handleChange(index, "color", color.hex)
                      }
                    />
                  </div>
                )}
              </TableCell>
              <TableCell>
                <Select
                  value={row.responsible}
                  onChange={(e) =>
                    handleChange(index, "responsible", e.target.value)
                  }
                  displayEmpty
                  fullWidth
                  required
                  error={!row.responsible} // Mostra errore se il campo è vuoto
                >
                  <MenuItem disabled value="">
                    <em>Seleziona responsabile</em>
                  </MenuItem>
                  {personale.map((personale, i) => (
                    <MenuItem key={i} value={personale.workerName}>
                      {personale.workerName}
                    </MenuItem>
                  ))}
                </Select>
              </TableCell>
              <TableCell>
                <DateTimePicker
                  label="Data inizio"
                  skipDisabled
                  value={row.startDate}
                  onChange={(date) => handleChange(index, "startDate", date)}
                  minTime={dayjs().hour(6).minute(0)}
                  maxTime={dayjs().hour(20).minute(0)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      required
                      error={!row.startDate} // Mostra errore se il campo è vuoto
                      helperText={!row.startDate ? "Campo obbligatorio" : ""}
                    />
                  )}
                />
              </TableCell>
              <TableCell>
                <DateTimePicker
                  label="Data scadenza"
                  skipDisabled
                  value={row.endDate}
                  onChange={(date) => handleChange(index, "endDate", date)}
                  minTime={dayjs().hour(6).minute(0)}
                  maxTime={dayjs().hour(20).minute(0)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      required
                      error={!row.endDate} // Mostra errore se il campo è vuoto
                      helperText={!row.endDate ? "Campo obbligatorio" : ""}
                    />
                  )}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ActivityTable;
