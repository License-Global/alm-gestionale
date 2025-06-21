import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Box,
  Button,
  Switch,
  Select,
  MenuItem,
  FormControlLabel,
  Tooltip,
} from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { RemoveCircle } from "@mui/icons-material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { TwitterPicker } from "react-color";
import { toast, Zoom } from "react-toastify";
import dayjs from "dayjs";
import { activityOrderSchema } from "../../utils/validations/validationSchemes";
import { createSchema } from "../../services/activitiesService";
import { useNavigate } from "react-router-dom";
import {
  activitiesById,
  isOperatorAvailable,
} from "../../utils/functions/taskManager";
import useSession from "../../hooks/useSession";
import CalendarTool from "../Calendar/CalendarTool";

const DynamicTable = ({ 
  formikValues, 
  personale, 
  formStep, 
  setFormStep,
  activities = [],
  onActivitiesChange = () => {},
  onFinalSubmit = () => {},
  loading = false
}) => {
  const { session } = useSession();
  const [isValid, setIsValid] = useState(false);
  const [errors, setErrors] = useState({});
  const [saveNewSchema, setSaveNewSchema] = useState(false);
  const [newSchemaName, setNewSchemaName] = useState("");
  const [selectedOperatorActivities, setSelectedOperatorActivities] = useState(
    []
  );
  const [selectedOperator, setSelectedOperator] = useState(null);

  const [tooltipIsOpen, setTooltipIsOpen] = useState(false);
  const [toolTipText, setToolTipText] = useState("");

  const getWorkerName = (id) =>
    personale.find((p) => p.id === id)?.workerName || "Sconosciuto";

  const navigate = useNavigate();

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

  const [rows, setRows] = useState(activities || []);
  const [newRow, setNewRow] = useState({
    name: "",
    inCalendar: false,
    color: "",
    responsible: "",
    startDate: dayjs().add(5, "minute"),
    endDate: dayjs().add(15, "minute"),
  });

  // Sincronizza le attività con il componente padre
  useEffect(() => {
    if (JSON.stringify(rows) !== JSON.stringify(activities)) {
      onActivitiesChange(rows);
    }
  }, [rows, onActivitiesChange, activities]);

  // --- UTILITY per controllare il conflitto con le attività nella stessa commessa
  const isTimeConflict = (start, end, rows) => {
    return rows.some((row) => {
      // Verifichiamo solo le attività con lo stesso operatore
      if (row.responsible !== newRow.responsible) return false;
      // Sovrapposizione: start < row.endDate e end > row.startDate
      return (
        dayjs(start).isBefore(dayjs(row.endDate)) &&
        dayjs(end).isAfter(dayjs(row.startDate))
      );
    });
  };

  const handleChange = (field, value) => {
    setNewRow({ ...newRow, [field]: value });
    if (field === "responsible") {
      setSelectedOperator(value);
    }
  };

  const handleAddRow = () => {
    // Verifica se i campi name, startDate, ed endDate sono popolati
    if (
      newRow.name.trim() !== "" &&
      newRow.startDate &&
      newRow.endDate &&
      newRow.responsible
    ) {
      setRows([...rows, { ...newRow }]);
      setNewRow({
        name: "",
        inCalendar: false,
        color: "",
        responsible: "",
        startDate: dayjs().add(5, "minute"),
        endDate: dayjs().add(15, "minute"),
      });
    }
  };

  const formatRows = (rowsToFormat) => {
    if (rowsToFormat) {
      return rowsToFormat.map((row) => ({
        ...row,
        startDate: row.startDate ? dayjs(row.startDate).toDate() : null,
        endDate: row.endDate ? dayjs(row.endDate).toDate() : null,
        status: "Standby",
        completed: null,
        note: [],
      }));
    }
  };

  const schemaActivities = () => {
    return rows.map((item) => item.name);
  };

  useEffect(() => {
    activityOrderSchema
      .validate(newRow, { abortEarly: false })
      .then(() => {
        setIsValid(true);
        setErrors({});
      })
      .catch((err) => {
        setIsValid(false);
        const errorsObj = {};
        err.inner.forEach((error) => {
          errorsObj[error.path] = error.message;
        });
        setErrors(errorsObj);
      });
  }, [newRow]);

  const submitNewSchema = async (schemaName, activities) => {
    if (saveNewSchema) {
      const result = await createSchema(schemaName, activities);
      if (result.success) {
        console.log("Dati inseriti con successo:", result.data);
      } else {
        console.error("Errore durante l'inserimento:", result.error);
        return;
      }
    }
  };

  const handleConfirm = async () => {
    if (saveNewSchema && newSchemaName.trim() === "") {
      notifyWarn("Inserisci un nome per il nuovo schema");
      return;
    }
    
    if (saveNewSchema) {
      await submitNewSchema(newSchemaName, schemaActivities());
    }
    
    // Utilizza la funzione di submit dal componente padre
    await onFinalSubmit();
  };

  // Carichiamo le attività dell’operatore selezionato da DB, per controllare la disponibilità
  useEffect(() => {
    if (newRow.responsible) {
      const fetchActivities = async () => {
        try {
          const data = await activitiesById(newRow.responsible);
          setSelectedOperatorActivities(data);
        } catch (err) {
          console.log(err.message);
        }
      };
      fetchActivities();
    }
  }, [newRow.responsible]);

  // Qui verifichiamo costantemente disponibilità + conflitto
  useEffect(() => {
    const operatorIsAvailable = isOperatorAvailable(
      selectedOperatorActivities,
      newRow.startDate,
      newRow.endDate
    );

    // Verifica conflitto con le attività create in questa stessa commessa
    const conflictWithRows = isTimeConflict(
      newRow.startDate,
      newRow.endDate,
      rows
    );

    if (!operatorIsAvailable) {
      setTooltipIsOpen(true);
      setToolTipText("Operatore non disponibile");
    } else if (conflictWithRows) {
      setTooltipIsOpen(true);
      setToolTipText(
        "Attività in conflitto con un'altra già inserita per questo operatore"
      );
    } else {
      setTooltipIsOpen(false);
      setToolTipText("");
    }
  }, [
    selectedOperatorActivities,
    newRow.startDate,
    newRow.endDate,
    newRow.responsible,
    rows,
  ]);

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <FormControlLabel
          onChange={(e) => setSaveNewSchema(e.target.checked)}
          control={<Switch color="primary" />}
          label="Salva schema"
          labelPlacement="start"
        />
        <AnimatePresence>
          {saveNewSchema ? (
            <motion.div
              key="newSchemaNameMotion"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              layout
            >
              <TextField
                value={newSchemaName}
                required={saveNewSchema}
                onChange={(e) => setNewSchemaName(e.target.value)}
                label="Nome schema"
                variant="outlined"
              />
            </motion.div>
          ) : (
            <motion.div>
              <TextField
                disabled
                label="Nome schema"
                variant="outlined"
                sx={{ visibility: "hidden" }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
      <TableContainer>
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
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
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
                <TableCell>{getWorkerName(row.responsible)}</TableCell>
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
                      duration: 0.2,
                      ease: "easeInOut",
                    }}
                  >
                    <RemoveCircle
                      sx={{ cursor: "pointer", width: "32px", height: "32px" }}
                      color="error"
                      onClick={() =>
                        setRows(rows.filter((_, i) => i !== index))
                      }
                    />
                  </motion.div>
                </TableCell>
              </TableRow>
            ))}

            {/* Riga per aggiungere nuovi dati */}
            <TableRow>
              <TableCell>
                <TextField
                  value={newRow.name}
                  name="name"
                  onChange={(e) => handleChange("name", e.target.value)}
                  label="Nome attività"
                  variant="outlined"
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name}
                />
              </TableCell>
              <TableCell>
                <Switch
                  checked={newRow.inCalendar}
                  onChange={(e) => handleChange("inCalendar", e.target.checked)}
                />
              </TableCell>
              <TableCell>
                {newRow.inCalendar ? (
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
                ) : (
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
                )}
              </TableCell>
              <TableCell>
                <Select
                  value={newRow.responsible}
                  onChange={(e) => handleChange("responsible", e.target.value)}
                  displayEmpty
                  fullWidth
                  error={!!errors.responsible}
                >
                  <MenuItem disabled value="">
                    <em>Seleziona responsabile</em>
                  </MenuItem>
                  {personale.map((p) => (
                    <MenuItem key={p.workerName} value={p.id}>
                      {p.workerName}
                    </MenuItem>
                  ))}
                </Select>
              </TableCell>
              <TableCell>
                <CalendarTool operatorId={selectedOperator} />
              </TableCell>
              <TableCell>
                <DateTimePicker
                  label="Data inizio"
                  skipDisabled
                  value={newRow.startDate}
                  defaultValue={dayjs().add(5, "minute")}
                  onChange={(date) => handleChange("startDate", date)}
                  minDate={dayjs()}
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
                  minDate={newRow.startDate}
                  minTime={dayjs().hour(6).minute(0)}
                  maxTime={dayjs().hour(20).minute(0)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </TableCell>
              <TableCell>
                <Tooltip
                  open={tooltipIsOpen}
                  disableHoverListener
                  onOpen={() => setTooltipIsOpen(true)}
                  onClose={() => setTooltipIsOpen(false)}
                  title={toolTipText}
                >
                  <Button
                    disabled={
                      !isValid ||
                      !newRow.responsible ||
                      // Disabilitiamo se l’operatore è occupato o c’è conflitto interno
                      !!toolTipText
                    }
                    onClick={handleAddRow}
                    variant="contained"
                    color="primary"
                  >
                    Aggiungi
                  </Button>
                </Tooltip>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ textAlign: "center", my: 2 }}>
        <Button
          type="button"
          disabled={!rows.length > 0 || loading}
          size="large"
          variant="contained"
          color="secondary"
          onClick={handleConfirm}
        >
          {loading ? "Salvataggio..." : "Conferma"}
        </Button>
      </Box>
    </Box>
  );
};

export default DynamicTable;
