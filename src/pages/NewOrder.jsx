import React, { useState, useEffect } from "react";
import { Box, Button, Paper } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { usePersonale } from "../hooks/usePersonale";
import DynamicTable from "../components/Tables/DynamicTable";
import { fetchActivitiesSchemes } from "../services/activitiesService";
import { PageContainer, SectionTitle } from "../styles/ArchiveDashboardStyles";
import { ToastContainer } from "react-toastify";
import ActivityTable from "../components/Tables/ActivityTable";
import { fetchCustomers } from "../services/customerService";
import { createOrder } from "../services/activitiesService";
import { createFolder } from "../services/bucketServices";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

// Nuovi componenti step
import OrderDetailsStep from "../components/NewOrder/OrderDetailsStep";
import TemplateSelectionStep from "../components/NewOrder/TemplateSelectionStep";

// Nuovo sistema di gestione stato
import {
  NewOrderFormProvider,
  useNewOrderForm,
} from "../context/NewOrderFormContext";
import { useFormValidation } from "../hooks/useFormValidation";
import useSession from "../hooks/useSession";

/**
 * Componente interno che utilizza il contesto del form
 */
const NewOrderContent = () => {
  const { state, actions } = useNewOrderForm();
  const { isFirstStepCompleted } = useFormValidation();
  const { session } = useSession();
  const { personale } = usePersonale();
  const navigate = useNavigate();

  // Stati locali per dati esterni
  const [activitiesSchemes, setActivitiesSchemes] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [customersList, setCustomersList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Carica i dati esterni
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customersData, schemesData] = await Promise.all([
          fetchCustomers(),
          fetchActivitiesSchemes(),
        ]);

        setCustomers(customersData);
        setActivitiesSchemes(schemesData);
      } catch (error) {
        console.error("Errore nel caricamento dei dati:", error);
      }
    };

    fetchData();
  }, []);

  // Prepara la lista clienti
  useEffect(() => {
    setCustomersList(
      customers.map((customer) => ({
        label: customer.customer_name,
        id: customer.id,
      }))
    );
  }, [customers]);

  // Sistema di navigazione semplificato
  const handleRestart = () => {
    actions.resetForm();
  };

  const goToStep = (step) => {
    actions.setFormStep(step);
  };

  const goBack = () => {
    if (state.formStep > 1) {
      // Da qualsiasi step torniamo sempre al precedente logico
      if (state.formStep === 3 || state.formStep === 4) {
        actions.setFormStep(2); // Dalla creazione attività o selezione modello torna alla scelta
      } else if (state.formStep === 5) {
        actions.setFormStep(4); // Dal conferma modello torna alla selezione modello
      } else {
        actions.setFormStep(state.formStep - 1);
      }
    }
  };

  // Determina il percorso attuale
  const getCurrentPath = () => {
    if (state.activities.length > 0 && !state.selectedSchema) {
      return "custom"; // Percorso attività personalizzate
    }
    if (state.selectedSchema) {
      return "template"; // Percorso da modello
    }
    return "none"; // Nessun percorso scelto
  };

  // Gestione delle scelte del percorso
  const chooseCustomActivities = () => {
    // Reset del modello se presente
    if (state.selectedSchema) {
      actions.setSelectedSchema(null);
    }
    actions.setFormStep(3);
  };

  const chooseTemplate = () => {
    // Reset delle attività se presenti
    if (state.activities.length > 0) {
      actions.updateActivities([]);
    }
    actions.setFormStep(4);
  };

  // Gestione attività personalizzate
  const handleActivitiesChange = (newActivities) => {
    actions.updateActivities(newActivities);
  };

  // Formatta le attività per l'invio
  const formatActivitiesForSubmission = (activities) => {
    return activities.map((activity) => ({
      ...activity,
      startDate: activity.startDate ? dayjs(activity.startDate).toDate() : null,
      endDate: activity.endDate ? dayjs(activity.endDate).toDate() : null,
      status: "Standby",
      completed: null,
      note: [],
    }));
  };

  // Gestisce il submit finale
  const handleFinalSubmit = async () => {
    if (!session?.user?.id) {
      console.error("Sessione utente non valida");
      return;
    }

    const orderData = {
      orderName: state.orderName,
      clientId: state.clientId,
      startDate: state.startDate,
      endDate: state.endDate,
      materialShelf: state.materialShelf,
      urgency: state.urgency,
      accessories: state.accessories,
      orderManager: state.orderManager,
      zone_consegna: state.zone_consegna,
      activities: formatActivitiesForSubmission(state.activities),
      user_id: session.user.id,
    };

    try {
      setLoading(true);

      await createOrder(orderData);
      await createFolder(session.user.id, state.orderName + state.clientId);

      // Cancella i dati persistenti e reindirizza
      actions.clearPersistedData();
      navigate("/");
    } catch (error) {
      console.error("Errore durante la creazione della commessa:", error);
    } finally {
      setLoading(false);
    }
  };

  // Mostra il contenuto direttamente senza dipendere da isLoaded
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
        transition="Zoom"
      />

      <Paper sx={{ p: 3, mb: 3, boxShadow: "15px 15px 15px #ccc" }}>
        <SectionTitle variant="h4">Nuova commessa</SectionTitle>

        {/* Indicatore di progresso compatto */}
        <Box sx={{ mb: 3, textAlign: "center" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 1.5,
              mb: 2,
            }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background:
                  state.formStep >= 1
                    ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    : "linear-gradient(135deg, #e0e0e0 0%, #bdbdbd 100%)",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                fontSize: "1rem",
                boxShadow:
                  state.formStep >= 1
                    ? "0 3px 12px rgba(102, 126, 234, 0.25)"
                    : "none",
                transition: "all 0.3s ease",
              }}
            >
              1
            </Box>
            <Box
              sx={{
                width: 40,
                height: 3,
                borderRadius: 2,
                background:
                  state.formStep >= 2
                    ? "linear-gradient(90deg, #667eea 0%, #764ba2 100%)"
                    : "linear-gradient(90deg, #e0e0e0 0%, #bdbdbd 100%)",
                transition: "all 0.5s ease",
              }}
            />
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background:
                  state.formStep >= 2
                    ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    : "linear-gradient(135deg, #e0e0e0 0%, #bdbdbd 100%)",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                fontSize: "1rem",
                boxShadow:
                  state.formStep >= 2
                    ? "0 3px 12px rgba(102, 126, 234, 0.25)"
                    : "none",
                transition: "all 0.3s ease",
              }}
            >
              2
            </Box>
            {getCurrentPath() !== "none" && (
              <>
                <Box
                  sx={{
                    width: 40,
                    height: 3,
                    borderRadius: 2,
                    background:
                      state.formStep >= 3
                        ? "linear-gradient(90deg, #667eea 0%, #764ba2 100%)"
                        : "linear-gradient(90deg, #e0e0e0 0%, #bdbdbd 100%)",
                    transition: "all 0.5s ease",
                  }}
                />
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background:
                      state.formStep >= 3
                        ? getCurrentPath() === "custom"
                          ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                          : "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
                        : "linear-gradient(135deg, #e0e0e0 0%, #bdbdbd 100%)",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    boxShadow:
                      state.formStep >= 3
                        ? "0 3px 12px rgba(102, 126, 234, 0.25)"
                        : "none",
                    transition: "all 0.3s ease",
                  }}
                >
                  3
                </Box>
                {getCurrentPath() === "template" && state.formStep >= 4 && (
                  <>
                    <Box
                      sx={{
                        width: 40,
                        height: 3,
                        borderRadius: 2,
                        background:
                          state.formStep >= 4
                            ? "linear-gradient(90deg, #f093fb 0%, #f5576c 100%)"
                            : "linear-gradient(90deg, #e0e0e0 0%, #bdbdbd 100%)",
                        transition: "all 0.5s ease",
                      }}
                    />
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        background:
                          state.formStep >= 4
                            ? "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
                            : "linear-gradient(135deg, #e0e0e0 0%, #bdbdbd 100%)",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bold",
                        fontSize: "1rem",
                        boxShadow:
                          state.formStep >= 4
                            ? "0 3px 12px rgba(240, 147, 251, 0.25)"
                            : "none",
                        transition: "all 0.3s ease",
                      }}
                    >
                      4
                    </Box>
                  </>
                )}
              </>
            )}
          </Box>

          {/* Titolo step corrente compatto */}
          <Box
            sx={{
              fontSize: "1.1rem",
              fontWeight: "bold",
              background: "linear-gradient(45deg, #667eea, #764ba2)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {state.formStep === 1 && "✨ Dettagli della commessa"}
            {state.formStep === 2 && "🎨 Scegli il tipo di attività"}
            {state.formStep === 3 && "🎯 Crea le tue attività"}
            {state.formStep === 4 && "📋 Seleziona un modello"}
            {state.formStep === 5 && "✅ Conferma le attività del modello"}
          </Box>
        </Box>

        <AnimatePresence mode="wait">
          {/* Step 1: Dettagli ordine */}
          {state.formStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <OrderDetailsStep
                customersList={customersList}
                personale={personale}
                customers={customers}
              />
            </motion.div>
          )}

          {/* Step 2: Scelta tipo attività */}
          {state.formStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Box sx={{ textAlign: "center", py: 2 }}>
                <Box sx={{ mb: 3 }}>
                  <Box
                    sx={{
                      fontSize: "1.3rem",
                      fontWeight: "bold",
                      mb: 1.5,
                      color: "primary.main",
                      background: "linear-gradient(45deg, #1976d2, #42a5f5)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Come vuoi gestire le attività?
                  </Box>
                  <Box
                    sx={{
                      fontSize: "0.9rem",
                      color: "text.secondary",
                      maxWidth: 450,
                      mx: "auto",
                      lineHeight: 1.5,
                    }}
                  >
                    Scegli se creare attività personalizzate oppure utilizzare
                    un modello predefinito
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    gap: 3,
                    justifyContent: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <Paper
                    elevation={3}
                    sx={{
                      p: 3,
                      cursor: "pointer",
                      minWidth: 240,
                      maxWidth: 280,
                      borderRadius: 3,
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      color: "white",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      position: "relative",
                      overflow: "hidden",
                      "&:hover": {
                        transform: "translateY(-6px) scale(1.02)",
                        boxShadow: "0 15px 30px rgba(102, 126, 234, 0.4)",
                      },
                      "&:active": {
                        transform: "translateY(-3px) scale(1.01)",
                      },
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: "rgba(255, 255, 255, 0.1)",
                        opacity: 0,
                        transition: "opacity 0.3s",
                      },
                      "&:hover::before": {
                        opacity: 1,
                      },
                    }}
                    onClick={chooseCustomActivities}
                  >
                    <Box
                      sx={{
                        fontSize: "3rem",
                        mb: 1.5,
                        filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.2))",
                      }}
                    >
                      🎯
                    </Box>
                    <Box
                      sx={{
                        fontSize: "1.2rem",
                        fontWeight: "bold",
                        mb: 1.5,
                        textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                      }}
                    >
                      Crea Attività
                    </Box>
                    <Box
                      sx={{
                        fontSize: "0.85rem",
                        opacity: 0.9,
                        lineHeight: 1.4,
                        textShadow: "0 1px 2px rgba(0,0,0,0.2)",
                      }}
                    >
                      Progetta attività completamente personalizzate per questa
                      commessa
                    </Box>
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 8,
                        right: 12,
                        fontSize: "1.1rem",
                        opacity: 0.7,
                      }}
                    >
                      →
                    </Box>
                  </Paper>

                  <Paper
                    elevation={3}
                    sx={{
                      p: 3,
                      cursor: "pointer",
                      minWidth: 240,
                      maxWidth: 280,
                      borderRadius: 3,
                      background:
                        "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                      color: "white",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      position: "relative",
                      overflow: "hidden",
                      "&:hover": {
                        transform: "translateY(-6px) scale(1.02)",
                        boxShadow: "0 15px 30px rgba(240, 147, 251, 0.4)",
                      },
                      "&:active": {
                        transform: "translateY(-3px) scale(1.01)",
                      },
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: "rgba(255, 255, 255, 0.1)",
                        opacity: 0,
                        transition: "opacity 0.3s",
                      },
                      "&:hover::before": {
                        opacity: 1,
                      },
                    }}
                    onClick={chooseTemplate}
                  >
                    <Box
                      sx={{
                        fontSize: "3rem",
                        mb: 1.5,
                        filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.2))",
                      }}
                    >
                      📋
                    </Box>
                    <Box
                      sx={{
                        fontSize: "1.2rem",
                        fontWeight: "bold",
                        mb: 1.5,
                        textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                      }}
                    >
                      Usa Modello
                    </Box>
                    <Box
                      sx={{
                        fontSize: "0.85rem",
                        opacity: 0.9,
                        lineHeight: 1.4,
                        textShadow: "0 1px 2px rgba(0,0,0,0.2)",
                      }}
                    >
                      Parti da un modello di attività già predefinito e
                      risparmia tempo
                    </Box>
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 8,
                        right: 12,
                        fontSize: "1.1rem",
                        opacity: 0.7,
                      }}
                    >
                      →
                    </Box>
                  </Paper>
                </Box>
              </Box>
            </motion.div>
          )}

          {/* Step 3: Tabella dinamica per nuove attività */}
          {state.formStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <DynamicTable
                formikValues={state}
                personale={personale}
                setFormStep={actions.setFormStep}
                formStep={state.formStep}
                activities={state.activities}
                onActivitiesChange={handleActivitiesChange}
                onFinalSubmit={handleFinalSubmit}
                loading={loading}
              />
            </motion.div>
          )}

          {/* Step 4: Selezione template */}
          {state.formStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <TemplateSelectionStep activitiesSchemes={activitiesSchemes} />
            </motion.div>
          )}

          {/* Step 5: Tabella attività da template */}
          {state.formStep === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ActivityTable
                formikValues={state}
                personale={personale}
                selectedSchema={state.selectedSchema}
                activities={state.activities}
                onActivitiesChange={handleActivitiesChange}
                onFinalSubmit={handleFinalSubmit}
                loading={loading}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </Paper>

      {/* Controlli di navigazione compatti */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: 600,
          mx: "auto",
          gap: 2,
          mt: 3,
        }}
      >
        {/* Pulsante Indietro */}
        <Button
          variant="outlined"
          color="primary"
          onClick={goBack}
          disabled={loading || state.formStep === 1}
          sx={{
            minWidth: 120,
            height: 42,
            borderRadius: 3,
            borderWidth: 2,
            fontWeight: "bold",
            fontSize: "0.9rem",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              borderWidth: 2,
              transform: "translateY(-2px)",
              boxShadow: "0 6px 20px rgba(25, 118, 210, 0.25)",
            },
            "&:disabled": {
              opacity: 0.4,
            },
          }}
        >
          ← Indietro
        </Button>

        {/* Pulsante Ricomincia */}
        <Button
          variant="contained"
          color="warning"
          onClick={handleRestart}
          disabled={loading}
          sx={{
            minWidth: 120,
            height: 42,
            borderRadius: 3,
            fontWeight: "bold",
            fontSize: "0.9rem",
            background: "linear-gradient(45deg, #ff9800, #f57c00)",
            boxShadow: "0 3px 12px rgba(255, 152, 0, 0.3)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              background: "linear-gradient(45deg, #f57c00, #ef6c00)",
              transform: "translateY(-2px)",
              boxShadow: "0 6px 20px rgba(255, 152, 0, 0.4)",
            },
            "&:disabled": {
              opacity: 0.5,
            },
          }}
        >
          🔄 Ricomincia
        </Button>

        {/* Pulsante Continua */}
        {state.formStep === 1 && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => goToStep(2)}
            disabled={!isFirstStepCompleted || loading}
            sx={{
              minWidth: 120,
              height: 42,
              borderRadius: 3,
              fontWeight: "bold",
              fontSize: "0.9rem",
              background: "linear-gradient(45deg, #1976d2, #42a5f5)",
              boxShadow: "0 3px 12px rgba(25, 118, 210, 0.3)",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                background: "linear-gradient(45deg, #1565c0, #1976d2)",
                transform: "translateY(-2px)",
                boxShadow: "0 6px 20px rgba(25, 118, 210, 0.4)",
              },
              "&:disabled": {
                opacity: 0.5,
                background: "grey.400",
              },
            }}
          >
            Continua →
          </Button>
        )}

        {state.formStep === 4 && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => goToStep(5)}
            disabled={!state.selectedSchema || loading}
            sx={{
              minWidth: 120,
              height: 42,
              borderRadius: 3,
              fontWeight: "bold",
              fontSize: "0.9rem",
              background: "linear-gradient(45deg, #1976d2, #42a5f5)",
              boxShadow: "0 3px 12px rgba(25, 118, 210, 0.3)",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                background: "linear-gradient(45deg, #1565c0, #1976d2)",
                transform: "translateY(-2px)",
                boxShadow: "0 6px 20px rgba(25, 118, 210, 0.4)",
              },
              "&:disabled": {
                opacity: 0.5,
                background: "grey.400",
              },
            }}
          >
            Continua →
          </Button>
        )}

        {/* Spazio vuoto per gli step dove la navigazione è gestita dalle tabelle */}
        {(state.formStep === 2 ||
          state.formStep === 3 ||
          state.formStep === 5) && <Box sx={{ minWidth: 120 }} />}
      </Box>
    </PageContainer>
  );
};

/**
 * Componente principale che fornisce il contesto
 */
const NewOrder = () => {
  return (
    <NewOrderFormProvider>
      <NewOrderContent />
    </NewOrderFormProvider>
  );
};

export default NewOrder;
