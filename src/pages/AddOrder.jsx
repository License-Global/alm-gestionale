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
import { DateTimePicker, DatePicker } from "@mui/x-date-pickers";
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
import { createBucket } from "../services/bucketServices";
import { PageContainer, SectionTitle } from "../styles/ArchiveDashboardStyles";
import { ToastContainer, toast } from "react-toastify";

const OrderForm = () => {
  const { session, loading } = useSession();
  const navigate = useNavigate();

  const notifyError = (message) => toast.error(message);

  useEffect(() => {
    if (!loading) {
      if (!session) {
        navigate("/login");
      }
    }
  }, [session, loading, navigate]);

  const [orderName, setOrderName] = useState("");
  const [selectedDate, setSelectedDate] = useState(dayjs().add(1, "minute"));
  const [endDate, setEndDate] = useState(dayjs());
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

  const handleKeyDown = (event) => {
    const regex = /^[a-zA-Z0-9 ]*$/; // Permette lettere, numeri e spazi
    if (
      !regex.test(event.key) &&
      event.key !== "Backspace" &&
      event.key !== "Delete"
      
    ) {
      notifyError("Inserire solo numeri e lettere");
      event.preventDefault();
    }
  };

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
    endDate: endDate,
    materialShelf: materialShelf,
    urgency: urgency,
    accessories: accessories,
    orderManager: orderManager,
  });
  useEffect(() => {
    setFormValues({
      orderName: orderName,
      startDate: selectedDate.toDate(),
      endDate: endDate.toDate(),
      materialShelf: materialShelf,
      urgency: urgency,
      accessories: accessories,
      orderManager: orderManager,
    });
  }, [
    orderName,
    selectedDate,
    endDate,
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

      await createOrder(orderData);
      navigate("/");
      createBucket(orderData.orderName);
    } catch (error) {
      console.error("Errore durante la creazione dell'ordine:", error);
      // Gestione dell'errore, come mostrare un messaggio all'utente
    }
  };

  return (
    <PageContainer>
    <ToastContainer  limit={1}/>
      <Box sx={{ p: 3 }}>
        <form onSubmit={handleConfirm}>
          {/* Prima sezione del form */}
          <Paper sx={{ p: 3, mb: 3, boxShadow: " 15px 15px 15px #ccc" }}>
            <SectionTitle variant="h4">Dettagli commessa</SectionTitle>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={4}>
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
                  onKeyDown={handleKeyDown}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <DatePicker
                  disablePast
                  sx={{ width: "100%" }}
                  label="Inizio commessa"
                  value={selectedDate}
                  onChange={(newValue) => setSelectedDate(newValue)}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <DatePicker
                  disablePast
                  minDateTime={selectedDate || dayjs()}
                  sx={{ width: "100%" }}
                  label="Fine commessa"
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue)}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
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
              <Grid item xs={12} sm={4}>
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

          <Paper sx={{ p: 3, boxShadow: " 15px 15px 15px #ccc" }}>
            <SectionTitle variant="h4">Attività</SectionTitle>
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
                    <InputLabel id="demo-simple-select-label">
                      Schema
                    </InputLabel>
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
    </PageContainer>
  );
};

export default OrderForm;
