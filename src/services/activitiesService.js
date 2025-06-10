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
// export const createOrder = async (newOrder) => {
//   try {
//     // Aggiungi ".select()" alla query
//     const { data, error } = await supabase
//       .from(TABLE_NAME)
//       .insert([newOrder])
//       .select("*");

//     if (error) {
//       throw error;
//     }

//     // Se il record inserito viene restituito correttamente,
//     // `data` sarà un array contenente l'ordine creato.
//     console.log("Ordine inserito con successo:", data);
//     return { success: true, data: data[0] };
//     // Se la tabella può restituire più record contemporaneamente,
//     // puoi restituire direttamente `data` invece di `data[0]`.
//   } catch (err) {
//     console.error("Errore durante l'inserimento dell'ordine:", err.message);
//     return { success: false, message: err.message };
//   }
// };

export async function createOrder(newOrder) {
  const {
    orderName,
    clientId,
    startDate,
    endDate,
    materialShelf,
    urgency,
    accessories,
    orderManager, // ID di un dipendente già esistente
    activities = [], // array di oggetti, ciascuno descrive un'attività
    user_id,
    internal_id,
  } = newOrder;

  try {
    // 1) Inserisci l'ordine in "orders_duplicate"
    //    Usiamo .select('*') per forzare la restituzione di tutti i campi, inclusa la PK "id"
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert([
        {
          orderName,
          clientId,
          startDate,
          endDate,
          materialShelf,
          urgency,
          accessories,
          // orderManager è un ID esistente di personale
          orderManager,
          user_id,
          internal_id,
        },
      ])
      .select("*") // <<--- forza a ricevere tutti i campi della riga
      .single();

    // Se c'è un errore, lo lanciamo
    if (orderError) {
      throw new Error(`Errore inserimento ordine: ${orderError.message}`);
    }

    // Se orderData è null, significa che Supabase non ci ha restituito la riga (potenziali cause: RLS, policy, ecc.)
    if (!orderData) {
      throw new Error(
        "Impossibile recuperare la riga inserita in orders: orderData è null."
      );
    }

    // 2) Se ci sono attività, le inseriamo nella tabella "activities" con FK "order_id"
    if (activities.length > 0) {
      // Colleghiamo ogni attività all'ordine appena creato usando orderData.id
      const activitiesToInsert = activities.map((activity) => ({
        ...activity,
        order_id: orderData.id,
      }));

      const { data: insertedActivities, error: activitiesError } =
        await supabase
          .from("activities")
          .insert(activitiesToInsert)
          .select("*"); // se vogliamo anche i dati delle attività

      if (activitiesError) {
        throw new Error(
          `Errore inserimento attività: ${activitiesError.message}`
        );
      }

      return {
        order: orderData,
        activities: insertedActivities,
      };
    }

    // Se non ci sono attività, restituiamo solo l'ordine
    return {
      order: orderData,
      activities: [],
    };
  } catch (error) {
    console.error(error);
    throw error; // rimanda l'errore al chiamante
  }
}

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

export const updateActivityStatusInOrder = async (activityId, newStatus) => {
  try {
    if (newStatus === "Completato") {
      const { data, error } = await supabase
        .from("activities")
        .update({ status: newStatus, completed: new Date().toISOString() })
        .eq("id", activityId)
        .select();

      if (error) {
        console.error("Errore nell'aggiornamento dello stato dell'attività:", error);
        throw error;
      }

      console.log("Stato dell'attività aggiornato con successo (Completato):", data);
      return { success: true, data };
    } else {
      const { data, error } = await supabase
        .from("activities")
        .update({ status: newStatus })
        .eq("id", activityId)
        .select();

      if (error) {
        console.error("Errore nell'aggiornamento dello stato dell'attività:", error);
        throw error;
      }

      console.log("Stato dell'attività aggiornato con successo:", data);
      return { success: true, data };
    }
  } catch (err) {
    console.error("Errore inaspettato nell'aggiornamento dell'attività:", err);
    throw err;
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
