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
  try {
    const { data, error } = await supabase.from(TABLE_NAME).insert([newOrder]);
  
    if (error) {
      throw error; // Solleva l'errore per essere catturato dal catch
    }
  
    // Se non c'è errore, successivamente restituiamo il risultato positivo
    console.log("Ordine inserito con successo:", data);
    return { success: true, data }; // Puoi restituire il dato dell'ordine o altro come feedback
  
  } catch (err) {
    // Gestione dell'errore
    console.error("Errore durante l'inserimento dell'ordine:", err.message);
    return { success: false, message: err.message }; // Restituisce un feedback con l'errore
  }
};

export const createSchema = async (schemaName, activities) => {
  try {
    // Effettua la chiamata POST per inserire i dati
    const { data, error } = await supabase
      .from("activitiesschemes") // Sostituisci con il nome della tua tabella
      .insert([
        { schemaName, activities }, // Oggetto da inserire
      ]);

    // Controllo degli errori
    if (error) {
      console.error("Errore durante l'inserimento:", error);
      return { success: false, error };
    }

    // Restituisce i dati inseriti se l'operazione ha successo
    return { success: true, data };
  } catch (error) {
    console.error("Errore imprevisto:", error);
    return { success: false, error };
  }
};

// Funzione per ottenere tutti gli schemi
export const fetchActivitiesSchemes = async () => {
  try {
    let { data: activitiesschemes, error } = await supabase
      .from("activitiesschemes")
      .select("*");

    if (error) {
      throw error;
    }

    return activitiesschemes;
  } catch (error) {
    console.error(
      "Errore nel recupero degli schemi di attività:",
      error.message
    );
    throw error; // Puoi rilanciare l'errore o gestirlo diversamente
  }
};

export const updateActivityStatusInOrder = async (
  orderId,
  activityIndex,
  newStatus
) => {
  try {
    // 1. Recupera l'ordine con le attività
    const { data: orderData, error: fetchError } = await supabase
      .from("orders")
      .select("activities")
      .eq("id", orderId)
      .single();

    if (fetchError) {
      console.error("Errore nel recupero dell'ordine:", fetchError);
      return null;
    }

    // 2. Modifica l'attività specifica nell'array JSONB
    const updatedActivities = [...orderData.activities];
    updatedActivities[activityIndex] = {
      ...updatedActivities[activityIndex],
      status: newStatus,
    };

    // 3. Aggiungi il campo "completed" con data e ora correnti, se lo stato è "completed"
    if (newStatus === "Completato") {
      updatedActivities[activityIndex].completed = new Date().toISOString();
    }

    // 4. Aggiorna l'ordine con il nuovo array activities
    const { data, error: updateError } = await supabase
      .from("orders")
      .update({ activities: updatedActivities })
      .eq("id", orderId);

    if (updateError) {
      console.error(
        "Errore durante l'aggiornamento dello stato dell'attività:",
        updateError
      );
      return null;
    }

    console.log("Stato dell'attività aggiornato con successo:", data);
    return data;
  } catch (err) {
    console.error("Errore inaspettato:", err);
    return null;
  }
};

// async function updateActivityCompleted(orderId, index, newCompleted) {
//   const { data, error } = await supabase
//     .from("orders")
//     .update({
//       activities: supabase.sql`jsonb_set(activities, '{${index},completed}', '${newCompleted}', true)`,
//     })
//     .eq("id", orderId);

//   if (error) {
//     console.error("Errore nell'aggiornamento del valore completed:", error);
//     return { success: false, error };
//   }

//   console.log("Completed aggiornato con successo:", data);
//   return { success: true, data };
// }
