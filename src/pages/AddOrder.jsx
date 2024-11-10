import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Grid,
  Typography,
  Paper,
  InputAdornment,
  Switch,
  Divider,
} from "@mui/material";

import { Inventory2, Construction, Assignment } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { DateTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { usePersonale } from "../hooks/usePersonale";
import useSession from "../hooks/useSession";
import { useNavigate } from "react-router-dom";
import AddTable from "../components/Tables/AddTable";
import {
  createOrder,
  createSchema,
  fetchActivitiesSchemes,
} from "../services/activitiesService";
import ClassicTable from "../components/Tables/ClassicTable";

const OrderForm = () => {
  const { session, loading } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!session) {
        navigate("/login");
      }
    }
  }, [session, loading, navigate]);

  const [orderName, setOrderName] = useState("");
  const [selectedDate, setSelectedDate] = useState(dayjs().add(1, "minute"));
  const [materialShelf, setMaterialShelf] = useState("");
  const [urgency, setUrgency] = useState("");
  const [accessories, setAccessories] = useState("");
  const [orderManager, setOrderManager] = useState("");

  const [isNewSchema, setIsNewSchema] = useState(false);
  const [newSchemaName, setNewSchemaName] = useState("");
  const [newOrder, setNewOrder] = useState("");
  const [activitiesNames, setActivitiesNames] = useState([]);

  const [activitiesSchemes, setActivitiesSchemes] = useState([]);
  const [selectedSchema, setSelectedSchema] = useState("");

  const [presetActivities, setPresetActivities] = useState([]);

  // Funzione per aggiornare lo stato
  const newOrderHandler = (ordine, activitiesNames) => {
    setNewOrder(ordine);
    if (activitiesNames) {
      setActivitiesNames(activitiesNames);
    }
  };

  const [formValues, setFormValues] = useState({
    orderName: orderName,
    startDate: selectedDate,
    materialShelf: materialShelf,
    urgency: urgency,
    accessories: accessories,
    orderManager: orderManager,
  });
  useEffect(() => {
    setFormValues({
      orderName: orderName,
      startDate: selectedDate.toDate(),
      materialShelf: materialShelf,
      urgency: urgency,
      accessories: accessories,
      orderManager: orderManager,
    });
  }, [
    orderName,
    selectedDate,
    materialShelf,
    urgency,
    accessories,
    orderManager,
  ]);

  useEffect(() => {
    const getActivitiesSchemes = async () => {
      try {
        const schemes = await fetchActivitiesSchemes();
        setActivitiesSchemes(schemes);
      } catch (err) {
        console.log(err.message);
      }
    };

    getActivitiesSchemes();
  }, []);

  // const handleSelectChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormValues({
  //     ...formValues,
  //     [name]: value,
  //   });
  // };

  const { personale } = usePersonale();

  const submitNewSchema = async (schemaName, activities) => {
    if (isNewSchema) {
      const result = await createSchema(schemaName, activities);

      if (result.success) {
        console.log("Dati inseriti con successo:", result.data);
      } else {
        console.error("Errore durante l'inserimento:", result.error);
      }
    } else return;
  };
  const handleConfirm = async (event) => {
    event.preventDefault();

    try {
      let orderData;

      if (selectedSchema && isNewSchema === false) {
        orderData = {
          ...formValues,
          activities: presetActivities.map((activity) => ({
            ...activity,
            status: "Standby",
            completed: false,
            note: [],
          })),
        };
      } else {
        if (isNewSchema) {
          await submitNewSchema(newSchemaName, activitiesNames);
        }
        orderData = {
          ...newOrder,
          activities: newOrder.activities.map((activity) => ({
            ...activity,
            status: "Standby",
            completed: false,
            note: [],
          })),
        };
      }

      await createOrder(orderData); // Se non ci sono errori, si considera completato con successo
      console.log("Ordine creato con successo");
      navigate("/");
    } catch (error) {
      console.error("Errore durante la creazione dell'ordine:", error);
      // Gestione dell'errore, come mostrare un messaggio all'utente
    }
  };

  useEffect(() => {
    console.log(newOrder);
  }, [newOrder]);

  return (
    <Box sx={{ p: 3 }}>
      <form onSubmit={handleConfirm}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontFamily: "Montserrat, sans-serif",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Nuova commessa
        </Typography>

        {/* Prima sezione del form */}
        <Paper sx={{ p: 3, mb: 3, boxShadow: " 15px 15px 15px #ccc" }}>
          <Typography variant="h6" gutterBottom>
            Dettagli commessa
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nome commessa"
                name="orderName"
                required
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Assignment />
                      </InputAdornment>
                    ),
                  },
                }}
                value={orderName}
                onChange={(e) => setOrderName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DateTimePicker
                disablePast
                sx={{ width: "100%" }}
                label="Inizio commessa"
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Scaffale accessori"
                required
                name="accessories"
                value={formValues.accessories}
                onChange={(e) => setAccessories(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Construction />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={"Scaffale materiale"}
                required
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Inventory2 />
                      </InputAdornment>
                    ),
                  },
                }}
                name="materialShelf"
                value={materialShelf}
                onChange={(e) => setMaterialShelf(e.target.value)}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="orderPriority-label">Priorità</InputLabel>
                <Select
                  labelId="orderPriority-label"
                  required
                  label="Priorità"
                  name="urgency"
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value)}
                >
                  <MenuItem value="Urgente">Urgente</MenuItem>
                  <MenuItem value="Alta">Alta</MenuItem>
                  <MenuItem value="Media">Media</MenuItem>
                  <MenuItem value="Bassa">Bassa</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="orderManager-label">Responsabile</InputLabel>
                <Select
                  required
                  labelId="orderManager-label"
                  label="Responsabile"
                  name="orderManager"
                  value={orderManager}
                  onChange={(e) => setOrderManager(e.target.value)}
                >
                  {personale.map((worker, index) => (
                    <MenuItem key={index} value={worker.workerName}>
                      {worker.workerName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>
        <Divider sx={{ my: 4 }} />
        <Paper sx={{ p: 3, boxShadow: " 15px 15px 15px #ccc" }}>
          <Typography sx={{ mb: 2 }} fontSize={28} variant="h6">
            Attività
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography fontSize={14} variant="h6">
              Memorizzare schema?
            </Typography>
            <Switch
              checked={isNewSchema}
              onChange={() => setIsNewSchema(!isNewSchema)}
              color="primary"
            />
          </Box>
          <AnimatePresence mode="popLayout">
            {isNewSchema ? (
              <motion.div
                key="new-schema"
                initial={{ opacity: 0, scale: 0.8, y: -20 }} // Inizia invisibile e più piccolo
                animate={{ opacity: 1, scale: 1, y: 0 }} // Appare con una transizione fluida
                exit={{ opacity: 0, scale: 0.8, y: 20 }} // Scompare con effetto di riduzione e scorrimento verso il basso
                transition={{
                  duration: 1.0, // Durata della transizione
                  type: "spring", // Usa una transizione di tipo molla
                  stiffness: 300,
                  damping: 20,
                }}
              >
                <TextField
                  value={newSchemaName}
                  required={true}
                  onChange={(e) => setNewSchemaName(e.target.value)}
                  id="standard-basic"
                  label="Nome schema"
                  variant="outlined"
                />
              </motion.div>
            ) : (
              <motion.div
                key="select-schema"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.3 }}
              >
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Schema</InputLabel>
                  <Select
                    sx={{ width: 300 }}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedSchema}
                    label="Scegli schema"
                    onChange={(e) => setSelectedSchema(e.target.value)}
                  >
                    <MenuItem value="">
                      <em>Nessuno</em>
                    </MenuItem>
                    {activitiesSchemes.map((schema, index) => (
                      <MenuItem key={index} value={schema}>
                        {schema.schemaName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </motion.div>
            )}
          </AnimatePresence>
          {isNewSchema === false && selectedSchema !== "" ? (
            <ClassicTable
              selectedSchema={selectedSchema}
              personale={personale}
              setPresetActivities={setPresetActivities}
            />
          ) : (
            <AddTable
              isNewSchema={isNewSchema}
              newSchemaName={newSchemaName}
              personale={personale}
              genericOrderData={formValues}
              newOrderHandler={newOrderHandler}
            />
          )}
        </Paper>
        <Box sx={{ textAlign: "center" }}>
          <Button
            type="submit"
            size="large"
            variant="contained"
            color="secondary"
            style={{ margin: "20px" }}
          >
            Conferma
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default OrderForm;
