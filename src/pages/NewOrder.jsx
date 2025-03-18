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
  alpha,
  Card,
  CardContent,
} from "@mui/material";
import { Inventory2, Construction } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { usePersonale } from "../hooks/usePersonale";
import DynamicTable from "../components/Tables/DynamicTable";
import theme from "../theme";
import { fetchActivitiesSchemes } from "../services/activitiesService";
import { PageContainer, SectionTitle } from "../styles/ArchiveDashboardStyles";
import { ToastContainer } from "react-toastify";
import { useFormik } from "formik";
import ActivityTable from "../components/Tables/ActivityTable";
import * as Yup from "yup";
import { useAllOrders } from "../hooks/useOrders";
import { fetchCustomers } from "../services/customerService";

const NewOrder = () => {
  const [formStep, setFormStep] = useState(1);
  const [activitiesSchemes, setActivitiesSchemes] = useState([]);
  const [selectedSchema, setSelectedSchema] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [customersList, setCustomersList] = useState([]);
  const { personale } = usePersonale();
  const { orders } = useAllOrders();

  const MotionCard = motion(Card);
  const MotionGrid = motion(Grid);

  useEffect(() => {
    const fetchCustomersData = async () => {
      const data = await fetchCustomers();
      setCustomers(data);
    };

    fetchCustomersData();
  }, []);

  useEffect(() => {
    setCustomersList(
      customers.map((customer) => ({
        label: customer.customer_name,
        id: customer.id,
      }))
    );
  }, [customers]);

  useEffect(() => {
    console.log(customersList);
  }, [customersList]);

  const mainOrderSchema = Yup.object({
    orderName: Yup.string()
      .matches(/^[a-zA-Z0-9À-ÿ ]+$/, "Sono ammessi solo lettere e numeri")
      .max(30, "Non deve superare i 30 caratteri")
      .test(
        "uniqueOrderNamePerClient",
        "Nome commessa già esistente per questo cliente",
        function (value) {
          const clientId = this.parent.clientId;

          // Confronta clientId come numero per gestire il caso in cui uno sia stringa e uno numero
          const isDuplicate = orders.some(
            (order) =>
              order.orderName === value &&
              Number(order.clientId) === Number(clientId)
          );

          return !isDuplicate;
        }
      )
      .required("Campo obbligatorio"),
    clientId: Yup.string().required("Campo obbligatorio"),
    startDate: Yup.date().required("Campo obbligatorio"),
    endDate: Yup.date().required("Campo obbligatorio"),
    materialShelf: Yup.string().required("Campo obbligatorio"),
    urgency: Yup.string().required("Campo obbligatorio"),
    accessories: Yup.string().required("Campo obbligatorio"),
    orderManager: Yup.string().required("Campo obbligatorio"),
  });

  const formik = useFormik({
    initialValues: {
      orderName: "",
      clientId: "",
      startDate: dayjs().add(2, "minute"),
      endDate: dayjs().add(1, "day"),
      materialShelf: "",
      urgency: "",
      accessories: "",
      orderManager: "",
      activities: [],
    },
    validationSchema: mainOrderSchema,
    onSubmit: (values) => {
      console.log(values);
    },
  });

  const isFirstStepCompleted = () => {
    if (
      formik.values.orderName &&
      formik.values.startDate &&
      formik.values.endDate &&
      formik.values.materialShelf &&
      formik.values.urgency &&
      formik.values.accessories &&
      formik.values.orderManager &&
      formik.values.clientId &&
      formik.isValid
    ) {
      return true;
    } else {
      return false;
    }
  };
  const handleRestart = () => {
    formik.resetForm();
    setFormStep(1);
  };
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

  return (
    <PageContainer>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        limit={1}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="light"
        transition={"Zoom"}
      />
      <form onSubmit={formik.handleSubmit}>
        <Paper sx={{ p: 3, mb: 3, boxShadow: " 15px 15px 15px #ccc" }}>
          <SectionTitle variant="h4">Nuova commessa</SectionTitle>
          <AnimatePresence mode="wait">
            {formStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                layout
              >
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
                      error={
                        formik.touched.orderName &&
                        Boolean(formik.errors.orderName)
                      }
                      helperText={
                        formik.touched.orderName && formik.errors.orderName
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                      <InputLabel id="clientId">Cliente</InputLabel>
                      <Select
                        fullWidth
                        id="clientId"
                        name="clientId"
                        label="Cliente"
                        value={formik.values.clientId}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.clientId &&
                          Boolean(formik.errors.clientId)
                        }
                        helperText={
                          formik.touched.clientId && formik.errors.clientId
                        }
                      >
                        {customersList.map((customer) => (
                          <MenuItem key={customer.id} value={customer.id}>
                            {customer.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <DatePicker
                      id="startDate"
                      name="startDate"
                      disablePast
                      sx={{ width: "100%" }}
                      label="Inizio commessa"
                      value={formik.values.startDate}
                      onChange={(value) =>
                        formik.setFieldValue("startDate", value)
                      }
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.startDate &&
                        Boolean(formik.errors.startDate)
                      }
                      helperText={
                        formik.touched.startDate && formik.errors.startDate
                      }
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
                      onChange={(value) =>
                        formik.setFieldValue("endDate", value)
                      }
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.endDate && Boolean(formik.errors.endDate)
                      }
                      helperText={
                        formik.touched.endDate && formik.errors.endDate
                      }
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
                      error={
                        formik.touched.accessories &&
                        Boolean(formik.errors.accessories)
                      }
                      helperText={
                        formik.touched.accessories && formik.errors.accessories
                      }
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
                      error={
                        formik.touched.materialShelf &&
                        Boolean(formik.errors.materialShelf)
                      }
                      helperText={
                        formik.touched.materialShelf &&
                        formik.errors.materialShelf
                      }
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
                        error={
                          formik.touched.urgency &&
                          Boolean(formik.errors.urgency)
                        }
                        helperText={
                          formik.touched.urgency && formik.errors.urgency
                        }
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
                      <InputLabel id="orderManager-label">
                        Responsabile
                      </InputLabel>
                      <Select
                        id="orderManager"
                        name="orderManager"
                        required
                        labelId="orderManager-label"
                        label="Responsabile"
                        value={formik.values.orderManager}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.orderManager &&
                          Boolean(formik.errors.orderManager)
                        }
                        helperText={
                          formik.touched.orderManager &&
                          formik.errors.orderManager
                        }
                      >
                        {personale.map((worker, index) => (
                          <MenuItem key={index} value={worker.id}>
                            {worker.workerName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </motion.div>
            )}
            {formStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                layout
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    my: 3,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="h4">
                      Vuoi scegliere un modello?
                    </Typography>
                    <div>
                      <Button
                        type="button"
                        size="large"
                        variant="contained"
                        color="primary"
                        onClick={() => setFormStep(3)}
                        style={{ margin: "20px" }}
                      >
                        Nuova
                      </Button>
                      <Button
                        type="button"
                        size="large"
                        variant="contained"
                        color="secondary"
                        onClick={() => setFormStep(4)}
                        style={{ margin: "20px" }}
                      >
                        Scegli un modello
                      </Button>
                    </div>
                  </Box>
                </Box>
              </motion.div>
            )}
            {formStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                layout
              >
                <DynamicTable
                  formikValues={formik.values}
                  personale={personale}
                  setFormStep={setFormStep}
                  formStep={formStep}
                />
              </motion.div>
            )}
            {formStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                layout
              >
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  layout
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      my: 3,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="h4">Seleziona un modello</Typography>
                      <Box sx={{ my: 3 }}>
                        {activitiesSchemes.map((schema, index) => (
                          <div key={index}>
                            <MotionGrid
                              item
                              xs={12}
                              sm={6}
                              md={4}
                              key={schema.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              transition={{ duration: 0.3 }}
                            >
                              <MotionCard
                                onClick={() => {
                                  setSelectedSchema(schema);
                                  setFormStep(5);
                                }}
                                whileHover={{
                                  y: -5,
                                  boxShadow:
                                    theme.shadows[4] ||
                                    "0px 4px 10px rgba(0,0,0,0.2)",
                                }}
                                transition={{ type: "spring", stiffness: 300 }}
                                sx={{
                                  bgcolor: "background.paper",
                                  borderRadius: 2,
                                  overflow: "hidden",
                                  boxShadow: theme.shadows[1],
                                  border: `1px solid ${alpha(
                                    theme.palette.primary.main,
                                    0.1
                                  )}`,
                                }}
                              >
                                <CardContent
                                  sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    cursor: "pointer",
                                    py: 2.5,
                                    px: 3,
                                    "&:last-child": { pb: 2.5 },
                                  }}
                                >
                                  <Typography
                                    variant="subtitle1"
                                    sx={{
                                      fontWeight: 600,

                                      color: "text.primary",
                                    }}
                                  >
                                    <i> {schema.schemaName}</i>
                                  </Typography>
                                </CardContent>
                              </MotionCard>
                            </MotionGrid>
                          </div>
                        ))}
                      </Box>
                    </Box>
                  </Box>
                </motion.div>
              </motion.div>
            )}
            {formStep === 5 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                layout
              >
                <ActivityTable
                  formikValues={formik.values}
                  personale={personale}
                  selectedSchema={selectedSchema}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </Paper>
        <Box sx={{ textAlign: "center", gap: 2 }}>
          <Button
            type="reset"
            size="large"
            variant="contained"
            color="warning"
            onClick={() => handleRestart()}
            style={{ margin: "20px" }}
          >
            Ricomincia
          </Button>
          <Button
            type="button"
            disabled={!isFirstStepCompleted()}
            size="large"
            variant="contained"
            color="secondary"
            onClick={() => setFormStep(2)}
            style={{
              display: `${formStep !== 1 ? "none" : ""}`,
              margin: "20px",
            }}
          >
            Continua
          </Button>
        </Box>
      </form>
    </PageContainer>
  );
};

export default NewOrder;
