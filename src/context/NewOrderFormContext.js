import React, { createContext, useContext, useReducer, useEffect } from "react";
import dayjs from "dayjs";
import { useFormPersistence } from "../hooks/useFormPersistence";

// Azioni del reducer
export const FORM_ACTIONS = {
  LOAD_STATE: "LOAD_STATE",
  UPDATE_FIELD: "UPDATE_FIELD",
  UPDATE_MULTIPLE_FIELDS: "UPDATE_MULTIPLE_FIELDS",
  SET_FORM_STEP: "SET_FORM_STEP",
  SET_SELECTED_SCHEMA: "SET_SELECTED_SCHEMA",
  UPDATE_ACTIVITIES: "UPDATE_ACTIVITIES",
  RESET_FORM: "RESET_FORM",
  SET_VALIDATION_ERRORS: "SET_VALIDATION_ERRORS",
};

// Valori iniziali del form
const getInitialFormState = () => ({
  // Dati principali
  orderName: "",
  clientId: "",
  startDate: dayjs().add(2, "minute"),
  endDate: dayjs().add(1, "day"),
  materialShelf: "",
  urgency: "",
  accessories: "",
  orderManager: "",
  zone_consegna: "",
  activities: [],

  // Stato del form
  formStep: 1,
  selectedSchema: null,

  // Validazione
  validationErrors: {},
  touched: {},
});

// Reducer per la gestione dello stato
const formReducer = (state, action) => {
  switch (action.type) {
    case FORM_ACTIONS.LOAD_STATE:
      return { ...state, ...action.payload };

    case FORM_ACTIONS.UPDATE_FIELD:
      return {
        ...state,
        [action.field]: action.value,
        touched: { ...state.touched, [action.field]: true },
      };

    case FORM_ACTIONS.UPDATE_MULTIPLE_FIELDS:
      return {
        ...state,
        ...action.payload,
        touched: {
          ...state.touched,
          ...Object.keys(action.payload).reduce(
            (acc, key) => ({ ...acc, [key]: true }),
            {}
          ),
        },
      };

    case FORM_ACTIONS.SET_FORM_STEP:
      return { ...state, formStep: action.payload };

    case FORM_ACTIONS.SET_SELECTED_SCHEMA:
      return { ...state, selectedSchema: action.payload };

    case FORM_ACTIONS.UPDATE_ACTIVITIES:
      return { ...state, activities: action.payload };

    case FORM_ACTIONS.SET_VALIDATION_ERRORS:
      return { ...state, validationErrors: action.payload };

    case FORM_ACTIONS.RESET_FORM:
      return getInitialFormState();

    default:
      return state;
  }
};

// Contesto
const NewOrderFormContext = createContext(null);

// Provider del contesto
export const NewOrderFormProvider = ({ children }) => {
  const [state, dispatch] = useReducer(formReducer, getInitialFormState());
  const { saveToStorage, loadFromStorage, clearStorage } = useFormPersistence(
    "newOrderFormState",
    getInitialFormState()
  );

  // Carica lo stato salvato all'avvio
  useEffect(() => {
    const savedState = loadFromStorage();
    if (savedState && Object.keys(savedState).length > 0) {
      dispatch({ type: FORM_ACTIONS.LOAD_STATE, payload: savedState });
    }
  }, []);

  // Salva lo stato ad ogni cambiamento (debounced) - Solo per i campi principali
  useEffect(() => {
    // Solo salva se ci sono effettivamente dei dati significativi
    const hasData =
      state.orderName || state.clientId || state.activities.length > 0;

    if (hasData) {
      const timeoutId = setTimeout(() => {
        const stateToSave = {
          orderName: state.orderName,
          clientId: state.clientId,
          startDate: state.startDate,
          endDate: state.endDate,
          materialShelf: state.materialShelf,
          urgency: state.urgency,
          accessories: state.accessories,
          orderManager: state.orderManager,
          zone_consegna: state.zone_consegna,
          activities: state.activities,
          formStep: state.formStep,
          selectedSchema: state.selectedSchema,
        };
        saveToStorage(stateToSave);
      }, 500); // Aumentato il debounce per evitare loop

      return () => clearTimeout(timeoutId);
    }
  }, [
    state.orderName,
    state.clientId,
    state.startDate,
    state.endDate,
    state.materialShelf,
    state.urgency,
    state.accessories,
    state.orderManager,
    state.zone_consegna,
    state.activities,
    state.formStep,
    state.selectedSchema,
  ]);

  // Azioni del contesto
  const actions = {
    updateField: (field, value) => {
      dispatch({ type: FORM_ACTIONS.UPDATE_FIELD, field, value });
    },

    updateMultipleFields: (fields) => {
      dispatch({ type: FORM_ACTIONS.UPDATE_MULTIPLE_FIELDS, payload: fields });
    },

    setFormStep: (step) => {
      dispatch({ type: FORM_ACTIONS.SET_FORM_STEP, payload: step });
    },

    setSelectedSchema: (schema) => {
      dispatch({ type: FORM_ACTIONS.SET_SELECTED_SCHEMA, payload: schema });
    },

    updateActivities: (activities) => {
      dispatch({ type: FORM_ACTIONS.UPDATE_ACTIVITIES, payload: activities });
    },

    setValidationErrors: (errors) => {
      dispatch({ type: FORM_ACTIONS.SET_VALIDATION_ERRORS, payload: errors });
    },

    resetForm: () => {
      dispatch({ type: FORM_ACTIONS.RESET_FORM });
      clearStorage();
    },

    clearPersistedData: () => {
      clearStorage();
    },
  };

  const value = {
    state,
    actions,
  };

  return (
    <NewOrderFormContext.Provider value={value}>
      {children}
    </NewOrderFormContext.Provider>
  );
};

// Hook per utilizzare il contesto
export const useNewOrderForm = () => {
  const context = useContext(NewOrderFormContext);
  if (!context) {
    throw new Error(
      "useNewOrderForm deve essere utilizzato all'interno di NewOrderFormProvider"
    );
  }
  return context;
};
