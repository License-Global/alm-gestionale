import { supabase } from "../supabase/supabaseClient";

/**
 * Fetch notes for a specific activity within an order
 */
export async function getNotes(orderId, activityName) {
  const { data, error } = await supabase
    .from("orders")
    .select("activities")
    .eq("id", orderId)
    .single();

  if (error) {
    console.error("Error fetching notes:", error);
    return null;
  }

  const activity = data.activities.find(
    (activity) => activity.activityName === activityName
  );
  return activity ? activity.note : [];
}

/**
 * Add a new note to a specific activity within an order
 */
export async function addNote(
  orderId,
  activityName,
  noteContent,
  sender = "admin"
) {
  // Recupera l'ordine con le attività
  const { data, error } = await supabase
    .from("orders")
    .select("activities")
    .eq("id", orderId)
    .single();

  if (error) {
    console.error("Errore recupero ordine:", error);
    return null;
  }

  // Trova l'attività e aggiungi la nota
  const activities = data.activities.map((activity) => {
    if (activity.name === activityName) {
      const newNote = {
        content: noteContent,
        created_at: new Date().toISOString(),
        sender,
        _id: Date.now(),
      };
      // Aggiungi la nuova nota
      activity.note = [...activity.note, newNote];
    }
    return activity;
  });

  // Esegui l'aggiornamento con `activities` modificato
  const { error: updateError } = await supabase
    .from("orders")
    .update({ activities })
    .eq("id", orderId);

  if (updateError) {
    console.error("Errore aggiornamento ordine:", updateError);
    return null;
  }

  return "Nota aggiunta con successo";
}

/**
 * Update a note in a specific activity within an order
 */
export async function updateNote(orderId, activityName, noteId, newContent) {
  const { data, error } = await supabase
    .from("orders")
    .select("activities")
    .eq("id", orderId)
    .single();

  if (error) {
    console.error("Error fetching order:", error);
    return null;
  }

  const activities = data.activities.map((activity) => {
    if (activity.activityName === activityName) {
      activity.note = activity.note.map((note) =>
        note._id === noteId ? { ...note, content: newContent } : note
      );
    }
    return activity;
  });

  const { error: updateError } = await supabase
    .from("orders")
    .update({ activities })
    .eq("id", orderId);

  if (updateError) {
    console.error("Error updating note:", updateError);
    return null;
  }

  return "Note updated successfully";
}

/**
 * Delete a note from a specific activity within an order
 */
export async function deleteNote(orderId, activityName, noteId) {
  const { data, error } = await supabase
    .from("orders")
    .select("activities")
    .eq("id", orderId)
    .single();

  if (error) {
    console.error("Error fetching order:", error);
    return null;
  }

  const activities = data.activities.map((activity) => {
    if (activity.activityName === activityName) {
      activity.note = activity.note.filter((note) => note._id !== noteId);
    }
    return activity;
  });

  const { error: updateError } = await supabase
    .from("orders")
    .update({ activities })
    .eq("id", orderId);

  if (updateError) {
    console.error("Error deleting note:", updateError);
    return null;
  }

  return "Note deleted successfully";
}
