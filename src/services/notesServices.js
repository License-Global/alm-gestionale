import { supabase } from "../supabase/supabaseClient";

/**
 * Restituisce l'array di note (campo JSONB) per un'attività specifica
 */
export async function getNotes(activityId) {
  // maybeSingle() evita l'errore se non troviamo nessuna riga
  const { data, error } = await supabase
    .from("activities")
    .select("note")
    .eq("id", activityId)
    .maybeSingle();

  if (error) {
    console.error("Errore nel recupero delle note:", error);
    return null;
  }
  if (!data) {
    // Nessuna activity trovata con quell'id
    console.warn("Attività non trovata con id:", activityId);
    return null;
  }

  // data.note è l'array di note; se non è mai stato impostato, data.note potrebbe essere null
  return data.note || [];
}

/**
 * Aggiunge una nuova nota all'array note di un'attività
 */
export async function addNote(activityId, noteContent, sender = "admin") {
  // 1. Ottieni l'attività
  const { data, error } = await supabase
    .from("activities")
    .select("note")
    .eq("id", activityId)
    .maybeSingle();

  if (error) {
    console.error("Errore nel recupero dell'attività:", error);
    return null;
  }
  if (!data) {
    console.warn("Attività non trovata con id:", activityId);
    return null;
  }

  // 2. Prepara la nuova nota
  const newNote = {
    content: noteContent,
    created_at: new Date().toISOString(),
    sender,
    _id: Date.now(), // in alternativa, potresti usare una libreria come uuid
  };

  // 3. Unisci la nota nuova alle eventuali esistenti
  const existingNotes = data.note || [];
  const updatedNotes = [...existingNotes, newNote];

  // 4. Aggiorna la riga nella tabella
  const { error: updateError } = await supabase
    .from("activities")
    .update({ note: updatedNotes })
    .eq("id", activityId);

  if (updateError) {
    console.error("Errore durante l'aggiornamento delle note:", updateError);
    return null;
  }

  return "Nota aggiunta con successo";
}

/**
 * Aggiorna il contenuto di una nota, identificata da noteId
 */
export async function updateNote(activityId, noteId, newContent) {
  // 1. Recupera l'array di note
  const { data, error } = await supabase
    .from("activities")
    .select("note")
    .eq("id", activityId)
    .maybeSingle();

  if (error) {
    console.error("Errore nel recupero dell'attività:", error);
    return null;
  }
  if (!data) {
    console.warn("Attività non trovata con id:", activityId);
    return null;
  }

  // 2. Aggiorna la singola nota
  const existingNotes = data.note || [];
  const updatedNotes = existingNotes.map((note) =>
    note._id === noteId ? { ...note, content: newContent } : note
  );

  // 3. Salva le note aggiornate
  const { error: updateError } = await supabase
    .from("activities")
    .update({ note: updatedNotes })
    .eq("id", activityId);

  if (updateError) {
    console.error("Errore durante l'aggiornamento della nota:", updateError);
    return null;
  }

  return "Nota aggiornata con successo";
}

/**
 * Elimina una nota da un'attività
 */
export async function deleteNote(activityId, noteId) {
  // 1. Recupera l'array di note
  const { data, error } = await supabase
    .from("activities")
    .select("note")
    .eq("id", activityId)
    .maybeSingle();

  if (error) {
    console.error("Errore nel recupero dell'attività:", error);
    return null;
  }
  if (!data) {
    console.warn("Attività non trovata con id:", activityId);
    return null;
  }

  // 2. Rimuovi la nota specifica
  const existingNotes = data.note || [];
  const updatedNotes = existingNotes.filter((note) => note._id !== noteId);

  // 3. Salva l'array aggiornato
  const { error: updateError } = await supabase
    .from("activities")
    .update({ note: updatedNotes })
    .eq("id", activityId);

  if (updateError) {
    console.error("Errore durante l'eliminazione della nota:", updateError);
    return null;
  }

  return "Nota eliminata con successo";
}
