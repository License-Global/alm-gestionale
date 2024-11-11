// useOrderUpdate.js - Hook per aggiornare i campi della tabella orders
import { supabase } from "../supabase/supabaseClient";
import { useState } from "react";

export const useOrderUpdate = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateField = async (orderId, fieldName, value) => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase
        .from("orders")
        .update({ [fieldName]: value })
        .eq("id", orderId);

      if (error) throw error;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Funzioni per aggiornare ciascun campo
  const updateStartDate = (orderId, startDate) =>
    updateField(orderId, "startDate", startDate);
  const updateIsConfirmed = (orderId, isConfirmed) =>
    updateField(orderId, "isConfirmed", isConfirmed);
  const updateOrderName = (orderId, orderName) =>
    updateField(orderId, "orderName", orderName);
  const updateMaterialShelf = (orderId, materialShelf) =>
    updateField(orderId, "materialShelf", materialShelf);
  const updateAccessories = (orderId, accessories) =>
    updateField(orderId, "accessories", accessories);
  const updateUrgency = (orderId, urgency) =>
    updateField(orderId, "urgency", urgency);
  const updateOrderManager = (orderId, orderManager) =>
    updateField(orderId, "orderManager", orderManager);

  return {
    loading,
    error,
    updateStartDate,
    updateIsConfirmed,
    updateOrderName,
    updateMaterialShelf,
    updateAccessories,
    updateUrgency,
    updateOrderManager,
  };
};
