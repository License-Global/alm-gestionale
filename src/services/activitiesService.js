import { supabase } from "../supabase/supabaseClient";

// Nome della tabella in Supabase
const TABLE_NAME = "orders";

// Funzione per ottenere tutte le attività di un ordine
export const getActivities = async (orderId) => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("activities")
    .eq("id", orderId);

  if (error) {
    console.error("Errore nel recuperare le attività:", error);
    return [];
  }

  return data.length > 0 ? data[0].activities : [];
};

// Funzione per aggiungere una nuova attività a un ordine
export const addActivity = async (orderId, newActivity) => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("activities")
    .eq("id", orderId);

  if (error) {
    console.error("Errore nel recuperare le attività:", error);
    return null;
  }

  const currentActivities = data[0]?.activities || [];
  const updatedActivities = [...currentActivities, newActivity];

  const { error: updateError } = await supabase
    .from(TABLE_NAME)
    .update({ activities: updatedActivities })
    .eq("id", orderId);

  if (updateError) {
    console.error("Errore nell'aggiungere la nuova attività:", updateError);
    return null;
  }

  return updatedActivities;
};

// Funzione per aggiornare un'attività esistente
export const updateActivity = async (
  orderId,
  activityIndex,
  updatedActivity
) => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("activities")
    .eq("id", orderId);

  if (error) {
    console.error("Errore nel recuperare le attività:", error);
    return null;
  }

  const currentActivities = data[0]?.activities || [];
  currentActivities[activityIndex] = updatedActivity;

  const { error: updateError } = await supabase
    .from(TABLE_NAME)
    .update({ activities: currentActivities })
    .eq("id", orderId);

  if (updateError) {
    console.error("Errore nell'aggiornare l'attività:", updateError);
    return null;
  }

  return currentActivities;
};

// Funzione per eliminare un'attività
export const deleteActivity = async (orderId, activityIndex) => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("activities")
    .eq("id", orderId);

  if (error) {
    console.error("Errore nel recuperare le attività:", error);
    return null;
  }

  const currentActivities = data[0]?.activities || [];
  currentActivities.splice(activityIndex, 1); // Rimuove l'attività

  const { error: deleteError } = await supabase
    .from(TABLE_NAME)
    .update({ activities: currentActivities })
    .eq("id", orderId);

  if (deleteError) {
    console.error("Errore nell'eliminare l'attività:", deleteError);
    return null;
  }

  return currentActivities;
};

// Funzione per aggiornare parzialmente un'attività (PATCH)
export const patchActivity = async (orderId, activityIndex, updatedFields) => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("activities")
    .eq("id", orderId);

  if (error) {
    console.error("Errore nel recuperare le attività:", error);
    return null;
  }

  const currentActivities = data[0]?.activities || [];

  // Otteniamo l'attività corrente
  const currentActivity = currentActivities[activityIndex];

  // Aggiorniamo solo i campi forniti in updatedFields
  const updatedActivity = { ...currentActivity, ...updatedFields };

  // Sostituiamo l'attività aggiornata nell'array
  currentActivities[activityIndex] = updatedActivity;

  const { error: updateError } = await supabase
    .from(TABLE_NAME)
    .update({ activities: currentActivities })
    .eq("id", orderId);

  if (updateError) {
    console.error(
      "Errore nell'aggiornare parzialmente l'attività:",
      updateError
    );
    return null;
  }

  return currentActivities;
};

// Funzione per creare un nuovo ordine
export const createOrder = async (newOrder) => {
  const { data, error } = await supabase.from(TABLE_NAME).insert([newOrder]);

  if (error) {
    console.error("Errore nella creazione dell'ordine:", error);
    return null;
  }

  return data[0];
};
