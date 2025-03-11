import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Box,
  Switch,
  Select,
  MenuItem,
  Paper,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { TwitterPicker } from "react-color";
import { toast, Zoom } from "react-toastify";
import { createOrder } from "../../services/activitiesService";
import { createBucket } from "../../services/bucketServices";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const ActivityTable = ({ selectedSchema, personale, formikValues }) => {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [isValid, setIsValid] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const notifyWarn = (message) =>
    toast.warn(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Zoom,
    });

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
        startDate: dayjs().add(5, "minute"),
        endDate: dayjs().add(15, "minute"),
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
  useEffect(() => {
    const newErrors = {};
    rows.forEach((row, index) => {
      if (!row.responsible) {
        newErrors[index] = { responsible: "Seleziona un responsabile" };
      }
    });
    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);
  }, [rows]);

  const formatRows = (rowsToFormat) => {
    if (rowsToFormat) {
      const formattedRows = rowsToFormat.map((row) => ({
        ...row,
        startDate: row.startDate ? dayjs(row.startDate).toDate() : null, // Converte in formato ISO
        endDate: row.endDate ? dayjs(row.endDate).toDate() : null,
        status: "Standby",
        completed: null,
        note: [], // Converte in formato ISO
      }));
      return formattedRows;
    }
  };

  const handleConfim = () => {
    const data = {
      ...formikValues,
      activities: formatRows(rows),
    };
    try {
      createOrder(data).then((res) => {
        console.log(res);
      });
      createBucket(formikValues.orderName);
      console.log(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(true);
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  return (
    <Box sx={{ p: 2 }}>
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
                    error={errors[index]?.responsible !== undefined}
                  >
                    <MenuItem disabled value="">
                      <em>Seleziona responsabile</em>
                    </MenuItem>
                    {personale.map((person, i) => (
                      <MenuItem key={i} value={person.id}>
                        {person.workerName}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors[index]?.responsible && (
                    <p
                      style={{
                        color: "red",
                        fontSize: "0.8rem",
                        margin: "5px 0 0 5px",
                      }}
                    >
                      {errors[index]?.responsible}
                    </p>
                  )}
                </TableCell>
                <TableCell>
                  <DateTimePicker
                    label="Data inizio"
                    skipDisabled
                    value={row.startDate}
                    onChange={(date) => handleChange(index, "startDate", date)}
                    minTime={dayjs().hour(6).minute(0)}
                    maxTime={dayjs().hour(20).minute(0)}
                    defaultValue={dayjs().add(5, "minute")}
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
                    defaultValue={dayjs().add(15, "minute")}
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
      <Box sx={{ textAlign: "center", my: 2 }}>
        <Button
          type="button"
          disabled={!isValid}
          size="large"
          variant="contained"
          color="secondary"
          onClick={() => handleConfim(rows)}
          loading={loading}
        >
          Conferma
        </Button>
      </Box>
    </Box>
  );
};

export default ActivityTable;
