// useOrderActivityUpdate.js - Hook per aggiornare le attività in un ordine su Supabase
import { supabase } from "../supabase/supabaseClient";
import { useState } from "react";

export const useOrderActivityUpdate = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Aggiorna l'intero array delle attività per un ordine specifico
  const updateActivities = async (orderId, activities) => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase
        .from("orders")
        .update({ activities })
        .eq("id", orderId);

      if (error) throw error;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Aggiorna una singola attività per un ordine specifico
  const updateActivityByName = async (
    orderId,
    activityName,
    updatedActivity
  ) => {
    setLoading(true);
    setError(null);
    try {
      // Recupera l'attuale array di attività per questo ordine
      const { data, error: fetchError } = await supabase
        .from("orders")
        .select("activities")
        .eq("id", orderId)
        .single();

      if (fetchError) throw fetchError;

      // Aggiorna solo l'attività specificata
      const newActivities = data.activities.map((activity) =>
        activity.name === activityName
          ? { ...activity, ...updatedActivity }
          : activity
      );

      // Salva l'array aggiornato
      const { error: updateError } = await supabase
        .from("orders")
        .update({ activities: newActivities })
        .eq("id", orderId);

      if (updateError) throw updateError;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    updateActivities,
    updateActivityByName,
  };
};
