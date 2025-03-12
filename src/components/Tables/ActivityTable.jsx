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

// Funzione helper per controllare la disponibilità del responsabile
const checkAvailability = async (responsible, start, end) => {
  // Recupera le attività esistenti per il responsabile
  const { data, error } = await supabase
    .from("activities")
    .select("startDate, endDate")
    .eq("responsible", responsible);
  if (error) {
    console.error("Error checking availability:", error);
    // In caso di errore, consideriamo il responsabile non disponibile per evitare conflitti
    return false;
  }
  // Verifica se esiste una sovrapposizione:
  // Un conflitto esiste se la nuova attività inizia prima della fine di un’attività esistente
  // e finisce dopo l’inizio di quella stessa attività
  const conflict = data.some((activity) => {
    const existingStart = new Date(activity.startDate);
    const existingEnd = new Date(activity.endDate);
    return start < existingEnd && end > existingStart;
  });
  return !conflict;
};

// Componente dedicato per ogni riga della tabella
const ActivityRow = React.memo(({ row, index, errors, onRowChange, personnel }) => {
  const handleFieldChange = useCallback(
    (field, value) => {
      onRowChange(index, field, value);
    },
    [index, onRowChange]
  );

  return (
    <TableRow key={index}>
      <TableCell>{row.name}</TableCell>
      <TableCell>
        <Switch
          checked={row.inCalendar}
          onChange={(e) => handleFieldChange("inCalendar", e.target.checked)}
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
            onChangeComplete={(color) => handleFieldChange("color", color.hex)}
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
              onChangeComplete={(color) => handleFieldChange("color", color.hex)}
            />
          </div>
        )}
      </TableCell>
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
          <p style={{ color: "red", fontSize: "0.8rem", margin: "5px 0 0 5px" }}>
            {errors.responsible}
          </p>
        )}
        {errors?.conflict && (
          <p style={{ color: "red", fontSize: "0.8rem", margin: "5px 0 0 5px" }}>
            {errors.conflict}
          </p>
        )}
      </TableCell>
      <TableCell>
        <DateTimePicker
          label="Data inizio"
          skipDisabled
          value={row.startDate}
          onChange={(date) => handleFieldChange("startDate", date)}
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
      <TableCell>
        <DateTimePicker
          label="Data scadenza"
          skipDisabled
          value={row.endDate}
          onChange={(date) => handleFieldChange("endDate", date)}
          minTime={dayjs().hour(6).minute(0)}
          maxTime={dayjs().hour(20).minute(0)}
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
      </TableCell>
    </TableRow>
  );
});

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

const ActivityTable = ({ selectedSchema, personale, formikValues }) => {
  const { session } = useSession();
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Funzione helper per mostrare messaggi di warning
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

  // Effettua la validazione combinata (campi obbligatori e controllo conflitti)
  useEffect(() => {
    const validateRows = async () => {
      const newErrors = {};
      for (let index = 0; index < rows.length; index++) {
        const row = rows[index];
        // Validazione campo responsabile
        if (!row.responsible) {
          newErrors[index] = { ...newErrors[index], responsible: "Seleziona un responsabile" };
        }
        // Se tutti i campi necessari sono presenti, controlla la disponibilità
        if (row.responsible && row.startDate && row.endDate) {
          const start =
            row.startDate.toDate ? row.startDate.toDate() : new Date(row.startDate);
          const end =
            row.endDate.toDate ? row.endDate.toDate() : new Date(row.endDate);
          const available = await checkAvailability(row.responsible, start, end);
          if (!available) {
            newErrors[index] = {
              ...newErrors[index],
              conflict: "Responsabile già occupato in questo orario",
            };
          }
        }
      }
      setErrors(newErrors);
    };

    validateRows();
  }, [rows]);

  const isValid = Object.keys(errors).length === 0;

  // Aggiorna una specifica riga in modo controllato
  const handleRowChange = useCallback((index, field, value) => {
    setRows((prevRows) => {
      const updatedRows = [...prevRows];
      updatedRows[index] = { ...updatedRows[index], [field]: value };
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

  const handleConfirm = async () => {
    const data = {
      ...formikValues,
      activities: formatRows(rows),
      user_id: session.user.id
    };
    try {
      setLoading(true);
      const orderRes = await createOrder(data);
      console.log("Order created:", orderRes);
      await createFolder(session.user.id, formikValues.orderName);
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
    activities: PropTypes.oneOfType([PropTypes.array, PropTypes.func, PropTypes.object]),
  }),
  personale: PropTypes.array.isRequired,
  formikValues: PropTypes.object.isRequired,
};

export default ActivityTable;
