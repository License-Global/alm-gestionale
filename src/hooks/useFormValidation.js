import { useEffect, useMemo, useCallback } from "react";
import * as Yup from "yup";
import { useNewOrderForm } from "../context/NewOrderFormContext";
import { useAllOrders } from "./useOrders";

// Schema di validazione principale
const createMainOrderSchema = (orders) =>
  Yup.object({
    orderName: Yup.string()
      .matches(/^[a-zA-ZÀ-ÿ ]+$/, "Sono ammesse solo lettere e spazi")
      .max(30, "Non deve superare i 30 caratteri")
      .test(
        "uniqueOrderNamePerClient",
        "Nome commessa già esistente per questo cliente",
        function (value) {
          const clientId = this.parent.clientId;
          if (!value || !clientId) return true;

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
    materialShelf: Yup.string(),
    urgency: Yup.string().required("Campo obbligatorio"),
    accessories: Yup.string(),
    orderManager: Yup.string().required("Campo obbligatorio"),
    zone_consegna: Yup.string(), // Campo facoltativo
  });

/**
 * Hook per la validazione del form NewOrder
 */
export const useFormValidation = () => {
  const { state, actions } = useNewOrderForm();
  const { orders } = useAllOrders();

  // Schema di validazione memoizzato
  const validationSchema = useMemo(() => {
    return createMainOrderSchema(orders || []);
  }, [orders]);

  // Valida i campi e aggiorna gli errori
  const validateForm = useCallback(async () => {
    try {
      await validationSchema.validate(state, { abortEarly: false });
      actions.setValidationErrors({});
      return true;
    } catch (error) {
      const validationErrors = {};
      if (error.inner) {
        error.inner.forEach((err) => {
          if (err.path) {
            validationErrors[err.path] = err.message;
          }
        });
      }
      actions.setValidationErrors(validationErrors);
      return false;
    }
  }, [validationSchema, state, actions]);

  // Valida un singolo campo
  const validateField = useCallback(
    async (fieldName, value) => {
      try {
        await validationSchema.validateAt(fieldName, {
          ...state,
          [fieldName]: value,
        });
        const newErrors = { ...state.validationErrors };
        delete newErrors[fieldName];
        actions.setValidationErrors(newErrors);
        return true;
      } catch (error) {
        const newErrors = { ...state.validationErrors };
        newErrors[fieldName] = error.message;
        actions.setValidationErrors(newErrors);
        return false;
      }
    },
    [validationSchema, state, actions]
  );

  // Controlla se il primo step è completato
  const isFirstStepCompleted = useMemo(() => {
    const requiredFields = [
      "orderName",
      "clientId",
      "startDate",
      "endDate",
      "urgency",
      "orderManager",
    ];
    const hasAllFields = requiredFields.every((field) => {
      const value = state[field];
      return value !== null && value !== undefined && value !== "";
    });

    const hasNoErrors = Object.keys(state.validationErrors).length === 0;
    return hasAllFields && hasNoErrors;
  }, [
    state.orderName,
    state.clientId,
    state.startDate,
    state.endDate,
    state.urgency,
    state.orderManager,
    state.validationErrors,
  ]);

  // Valida automaticamente quando i valori cambiano
  useEffect(() => {
    if (state.touched && Object.keys(state.touched).length > 0) {
      const timeoutId = setTimeout(() => {
        validateForm();
      }, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [
    state.orderName,
    state.clientId,
    state.startDate,
    state.endDate,
    state.urgency,
    state.orderManager,
    state.touched,
    validateForm,
  ]);

  return {
    validationErrors: state.validationErrors,
    touched: state.touched,
    isFirstStepCompleted,
    validateForm,
    validateField,
    validationSchema,
  };
};
