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
import { useFormik } from "formik";
import { mainOrderSchema } from "../utils/validations/validationSchemes";

const OrderForm = () => {
  const { session, loading } = useSession();
  const { personale } = usePersonale();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      orderName: '',
      startDate: dayjs().add(2, "minute"),
      endDate: dayjs().add(1, "day"),
      materialShelf: '',
      urgency: '',
      accessories: '',
      orderManager: '',
      activities: [],
    },
    validationSchema: mainOrderSchema,
    onSubmit: (values) => {
      handleConfirm();
    },
  });

  const notifyError = (message) => toast.error(message);

  useEffect(() => {
    if (!loading) {
      if (!session) {
        navigate("/login");
      }
    }
  }, [session, loading, navigate]);

  const [isNewSchema, setIsNewSchema] = useState(false);
  const [newSchemaName, setNewSchemaName] = useState("");
  const [newOrder, setNewOrder] = useState("");
  const [activitiesNames, setActivitiesNames] = useState([]);

  const [activitiesSchemes, setActivitiesSchemes] = useState([]);
  const [selectedSchema, setSelectedSchema] = useState("");

  const [presetActivities, setPresetActivities] = useState([]);

  const [finalOrder, setFinalOrder] = useState([]);


  // Funzione per aggiornare lo stato
  const newOrderHandler = (ordine, activitiesNames) => {
    setNewOrder(ordine);
    if (activitiesNames) {
      setActivitiesNames(activitiesNames);
    }
    console.log(ordine, "ordine");
    console.log(newOrder, "newOrder");
  };

  // Richiede gli schemi di attività al caricamento della pagina
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
  //-------------------------------------------

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

  const handleOrder = () => {
    if (!isNewSchema) {
      setFinalOrder({
        ...formik.values,
        activities: presetActivities.map((activity) => ({
          ...activity,
          status: "Standby",
          completed: false,
          note: [],
        })),
      });
    } else if (isNewSchema) {
      setFinalOrder({
        ...newOrder,
        activities: newOrder.activities.map((activity) => ({
          ...activity,
          status: "Standby",
          completed: false,
          note: [],
        })),
      });
    } else if(selectedSchema !== "") {
      setFinalOrder({
        ...newOrder,
        activities: newOrder.activities.map((activity) => ({
          ...activity,
          status: "Standby",
          completed: false,
          note: [],
        })),
      });
    }
  }
  useEffect(() => {
    handleOrder();
  }, [presetActivities, newOrder, formik.values, selectedSchema]);
  
  const handleConfirm = async () => {
    try {
      try {
        const result = await createOrder(finalOrder);
        if (result.success) {
          // Se l'ordine è stato creato con successo, fornisci un feedback
          console.log("Ordine creato con successo!");
          await submitNewSchema(newSchemaName, activitiesNames);
          createBucket(finalOrder.orderName);
          // Puoi mostrare una notifica o aggiornare lo stato dell'interfaccia utente
        } else {
          // Se c'è stato un errore, mostra l'errore
          notifyError("Errore durante la creazione dell'ordine:", result.message);
          console.log(result.message)
          // Mostra un messaggio di errore all'utente (opzionale)
        }
      } catch (error) {
        // Se c'è un errore imprevisto, lo catturiamo qui
        console.error("Errore imprevisto:", error);
      } finally {
        // Dopo aver gestito il risultato (sia successo che errore), naviga alla home
        // navigate("/");
      }
    } catch (error) {
      console.error("Errore durante la creazione dell'ordine:", error);
      // Gestione dell'errore, come mostrare un messaggio all'utente
    }
  };

useEffect(() => {
  setFinalOrder(newOrder)
}, [newOrder])


  return (
    <PageContainer>
      <ToastContainer limit={1} />
      <Box sx={{ p: 3 }}>
        <form onSubmit={formik.handleSubmit}>
          {/* Prima sezione del form */}
          <Paper sx={{ p: 3, mb: 3, boxShadow: " 15px 15px 15px #ccc" }}>
            <SectionTitle variant="h4">Dettagli commessa</SectionTitle>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={4}>
                <TextField
                  id="orderName"
                  name="orderName"
                  fullWidth
                  label="Nome commessa"
                  required
                  value={formik.values.orderName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.orderName && Boolean(formik.errors.orderName)}
                  helperText={formik.touched.orderName && formik.errors.orderName}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <DatePicker
                  id="startDate"
                  name="startDate"
                  disablePast
                  sx={{ width: "100%" }}
                  label="Inizio commessa"
                  value={formik.values.startDate}
                  onChange={(value) => formik.setFieldValue('startDate', value)}
                  onBlur={formik.handleBlur}
                  error={formik.touched.startDate && Boolean(formik.errors.startDate)}
                  helperText={formik.touched.startDate && formik.errors.startDate}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <DatePicker
                  id="endDate"
                  name="endDate"
                  disablePast
                  minDate={formik.values.startDate}
                  sx={{ width: "100%" }}
                  label="Fine commessa"
                  value={formik.values.endDate}
                  onChange={(value) => formik.setFieldValue('endDate', value)}
                  onBlur={formik.handleBlur}
                  error={formik.touched.endDate && Boolean(formik.errors.endDate)}
                  helperText={formik.touched.endDate && formik.errors.endDate}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  id="accessories"
                  name="accessories"
                  fullWidth
                  label="Scaffale accessori"
                  required
                  value={formik.values.accessories}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.accessories && Boolean(formik.errors.accessories)}
                  helperText={formik.touched.accessories && formik.errors.accessories}
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
                  id="materialShelf"
                  name="materialShelf"
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
                  value={formik.values.materialShelf}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.materialShelf && Boolean(formik.errors.materialShelf)}
                  helperText={formik.touched.materialShelf && formik.errors.materialShelf}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="orderPriority-label">Priorità</InputLabel>
                  <Select
                    id="urgency"
                    name="urgency"
                    labelId="orderPriority-label"
                    required
                    label="Priorità"
                    value={formik.values.urgency}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.urgency && Boolean(formik.errors.urgency)}
                    helperText={formik.touched.urgency && formik.errors.urgency}
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
                    id="orderManager"
                    name="orderManager"
                    required
                    labelId="orderManager-label"
                    label="Responsabile"
                    value={formik.values.orderManager}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.orderManager && Boolean(formik.errors.orderManager)}
                    helperText={formik.touched.orderManager && formik.errors.orderManager}
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

          {/* Sezione attività */}
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
                genericOrderData={formik.values}
                newOrderHandler={newOrderHandler}
              />
            )}
          </Paper>
          <Box sx={{ textAlign: "center" }}>
            <Button
              disabled={!(formik.isValid && finalOrder.activities?.length > 0)}
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
