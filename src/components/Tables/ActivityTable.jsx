import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
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
import { createFolder } from "../../services/bucketServices";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { supabase } from "../../supabase/supabaseClient";
import useSession from "../../hooks/useSession";
import CalendarTool from "../Calendar/CalendarTool";

// Funzione helper per controllare se ci sono conflitti nel DB
const checkAvailability = async (responsible, start, end) => {
  try {
    // Recupera le attività esistenti per il responsabile
    const { data, error } = await supabase
      .from("activities")
      .select("startDate, endDate")
      .eq("responsible", responsible);

    if (error) {
      console.error("Error checking availability:", error);
      // In caso di errore, consideriamo il responsabile non disponibile
      return false;
    }

    // Verifica sovrapposizione
    const conflict = data.some((activity) => {
      const existingStart = dayjs(activity.startDate);
      const existingEnd = dayjs(activity.endDate);

      // Conflitto se: start < existingEnd && end > existingStart
      return start.isBefore(existingEnd) && end.isAfter(existingStart);
    });

    return !conflict;
  } catch (err) {
    console.error("Error:", err);
    return false;
  }
};

// Funzione helper per controllare se ci sono conflitti tra le attività inserite in `rows`
const checkLocalConflict = (rowA, rowB) => {
  // Ci interessa solo se hanno lo stesso responsabile e campi validi
  if (
    !rowA.responsible ||
    !rowB.responsible ||
    rowA.responsible !== rowB.responsible
  ) {
    return false;
  }

  const startA = dayjs(rowA.startDate);
  const endA = dayjs(rowA.endDate);
  const startB = dayjs(rowB.startDate);
  const endB = dayjs(rowB.endDate);

  // Sovrapposizione: A inizia prima che B finisca e A finisce dopo che B inizia
  return startA.isBefore(endB) && endA.isAfter(startB);
};

// Componente dedicato per ogni riga della tabella
const ActivityRow = React.memo(
  ({ row, index, errors, onRowChange, personnel }) => {
    const handleFieldChange = useCallback(
      (field, value) => {
        onRowChange(index, field, value);
      },
      [index, onRowChange]
    );

    return (
      <TableRow key={index}>
        {/* Nome attività */}
        <TableCell>{row.name}</TableCell>

        {/* Calendario */}
        <TableCell>
          <Switch
            checked={row.inCalendar}
            onChange={(e) => handleFieldChange("inCalendar", e.target.checked)}
          />
        </TableCell>

        {/* Colore */}
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
                handleFieldChange("color", color.hex)
              }
            />
          ) : (
            <div style={{ visibility: "hidden" }}>
              <TwitterPicker
                color={row.color || "#000"}
                onChangeComplete={(color) =>
                  handleFieldChange("color", color.hex)
                }
              />
            </div>
          )}
        </TableCell>

        {/* Responsabile */}
        <TableCell>
          <Select
            value={row.responsible}
            onChange={(e) => handleFieldChange("responsible", e.target.value)}
            displayEmpty
            fullWidth
            error={Boolean(errors?.responsible)}
          >
            <MenuItem disabled value="">
              <em>Seleziona responsabile</em>
            </MenuItem>
            {personnel.map((person) => (
              <MenuItem key={person.id} value={person.id}>
                {person.workerName}
              </MenuItem>
            ))}
          </Select>
          {errors?.responsible && (
            <p
              style={{
                color: "red",
                fontSize: "0.8rem",
                margin: "5px 0 0 5px",
              }}
            >
              {errors.responsible}
            </p>
          )}
          {errors?.conflict && (
            <p
              style={{
                color: "red",
                fontSize: "0.8rem",
                margin: "5px 0 0 5px",
              }}
            >
              {errors.conflict}
            </p>
          )}
          {errors?.internalConflict && (
            <p
              style={{
                color: "red",
                fontSize: "0.8rem",
                margin: "5px 0 0 5px",
              }}
            >
              {errors.internalConflict}
            </p>
          )}
        </TableCell>

        {/* Agenda */}
        <TableCell>
          <CalendarTool operatorId={row.responsible} />
        </TableCell>

        {/* Data inizio */}
        <TableCell>
          <DateTimePicker
            label="Data inizio"
            skipDisabled
            value={row.startDate}
            onChange={(date) => handleFieldChange("startDate", date)}
            minDate={dayjs()}
            // Evita di selezionare un orario già passato in giornata (se serve)
            minTime={dayjs().hour(6).minute(0)}
            maxTime={dayjs().hour(20).minute(0)}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                required
                error={!row.startDate}
                helperText={!row.startDate ? "Campo obbligatorio" : ""}
              />
            )}
          />
        </TableCell>

        {/* Data fine */}
        <TableCell>
          <DateTimePicker
            label="Data scadenza"
            skipDisabled
            value={row.endDate}
            onChange={(date) => handleFieldChange("endDate", date)}
            // Iniziamo dal valore di startDate o dall'ora attuale, se serve
            minTime={row.startDate}
            maxTime={dayjs().hour(20).minute(0)}
            minDate={row.startDate}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                required
                error={!row.endDate}
                helperText={!row.endDate ? "Campo obbligatorio" : ""}
              />
            )}
          />
          {/* Mostriamo l’errore se la data di fine non è successiva a quella di inizio */}
          {errors?.dateOrder && (
            <p
              style={{
                color: "red",
                fontSize: "0.8rem",
                margin: "5px 0 0 5px",
              }}
            >
              {errors.dateOrder}
            </p>
          )}
        </TableCell>
      </TableRow>
    );
  }
);

ActivityRow.propTypes = {
  row: PropTypes.shape({
    name: PropTypes.string.isRequired,
    inCalendar: PropTypes.bool,
    color: PropTypes.string,
    responsible: PropTypes.string,
    startDate: PropTypes.any,
    endDate: PropTypes.any,
  }).isRequired,
  index: PropTypes.number.isRequired,
  errors: PropTypes.object,
  onRowChange: PropTypes.func.isRequired,
  personnel: PropTypes.array.isRequired,
};

// Componente principale della tabella
const ActivityTable = ({ selectedSchema, personale, formikValues }) => {
  const { session } = useSession();
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [selectedOperator, setSelectedOperator] = useState(null);

  const notifyWarn = useCallback((message) => {
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
  }, []);

  // Carica le attività quando lo schema selezionato cambia
  useEffect(() => {
    const loadActivities = async () => {
      if (!selectedSchema) return;
      try {
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
      } catch (error) {
        notifyWarn("Errore nel caricamento delle attività");
      }
    };

    loadActivities();
  }, [selectedSchema, notifyWarn]);

  // Validazione combinata: campi + conflitti DB + conflitti interni + ordine date
  useEffect(() => {
    const validateRows = async () => {
      const newErrors = {};

      for (let i = 0; i < rows.length; i++) {
        const rowI = rows[i];

        // Se manca il responsabile
        if (!rowI.responsible) {
          newErrors[i] = {
            ...newErrors[i],
            responsible: "Seleziona un responsabile",
          };
        }

        // Verifica che startDate e endDate siano corretti (end > start)
        if (rowI.startDate && rowI.endDate) {
          // Se la differenza è >= 0, significa start >= end
          if (dayjs(rowI.startDate).diff(dayjs(rowI.endDate)) >= 0) {
            newErrors[i] = {
              ...newErrors[i],
              dateOrder:
                "La data di fine deve essere successiva a quella di inizio",
            };
          }
        }

        // Se abbiamo dati completi (responsabile, startDate, endDate), controlliamo conflitti DB
        if (rowI.responsible && rowI.startDate && rowI.endDate) {
          const start = dayjs(rowI.startDate);
          const end = dayjs(rowI.endDate);
          const available = await checkAvailability(
            rowI.responsible,
            start,
            end
          );
          if (!available) {
            newErrors[i] = {
              ...newErrors[i],
              conflict: "Responsabile già occupato in questo orario",
            };
          }
        }
      }

      // Controllo conflitti interni tra le righe
      for (let i = 0; i < rows.length; i++) {
        const rowI = rows[i];
        for (let j = i + 1; j < rows.length; j++) {
          const rowJ = rows[j];
          if (checkLocalConflict(rowI, rowJ)) {
            newErrors[i] = {
              ...newErrors[i],
              internalConflict:
                "Attività in conflitto con un'altra già inserita per questo responsabile",
            };
            newErrors[j] = {
              ...newErrors[j],
              internalConflict:
                "Attività in conflitto con un'altra già inserita per questo responsabile",
            };
          }
        }
      }

      setErrors(newErrors);
    };

    validateRows();
  }, [rows]);

  // isValid: se `errors` è vuoto, nessuna riga ha errori
  const isValid = Object.keys(errors).length === 0;

  // Funzione per gestire il cambio di campo in una riga
  const handleRowChange = useCallback((index, field, value) => {
    setRows((prevRows) => {
      const updatedRows = [...prevRows];
      updatedRows[index] = { ...updatedRows[index], [field]: value };
      if (field === "responsible") setSelectedOperator(value);
      return updatedRows;
    });
  }, []);

  // Format delle righe prima dell'invio
  const formatRows = useCallback((rowsToFormat) => {
    return rowsToFormat.map((row) => ({
      ...row,
      startDate: row.startDate ? dayjs(row.startDate).toDate() : null,
      endDate: row.endDate ? dayjs(row.endDate).toDate() : null,
      status: "Standby",
      completed: null,
      note: [],
    }));
  }, []);

  // Conferma finale: salviamo la commessa
  const handleConfirm = async () => {
    const data = {
      ...formikValues,
      activities: formatRows(rows),
      user_id: session.user.id,
    };

    try {
      setLoading(true);
      const orderRes = await createOrder(data);
      console.log("Order created:", orderRes);

      await createFolder(
        session.user.id,
        formikValues.orderName + formikValues.clientId
      );

      navigate("/");
    } catch (e) {
      console.error(e);
      notifyWarn("Errore durante la conferma");
    } finally {
      setLoading(false);
    }
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
              <TableCell>Agenda</TableCell>
              <TableCell>Data inizio</TableCell>
              <TableCell>Data scadenza</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <ActivityRow
                key={index}
                row={row}
                index={index}
                errors={errors[index]}
                onRowChange={handleRowChange}
                personnel={personale}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ textAlign: "center", my: 2 }}>
        <Button
          type="button"
          disabled={!isValid || loading}
          size="large"
          variant="contained"
          color="secondary"
          onClick={handleConfirm}
        >
          {loading ? "Caricamento..." : "Conferma"}
        </Button>
      </Box>
    </Box>
  );
};

ActivityTable.propTypes = {
  selectedSchema: PropTypes.shape({
    activities: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.func,
      PropTypes.object,
    ]),
  }),
  personale: PropTypes.array.isRequired,
  formikValues: PropTypes.object.isRequired,
};

export default ActivityTable;
