import { supabase } from "../supabase/supabaseClient"; // Modifica il path se necessario

// src/services/notificationService.js
// CRUD per le notifiche
// Ogni notifica segue la struttura dell'esempio fornito

// NOTIFICHE CRUD CON SUPABASE
// Cambia TABLE_NAME e importa il tuo supabaseClient

const TABLE_NAME = "notifications"; // Cambia se la tabella ha un altro nome

// Crea una nuova notifica
export const createNotification = async (notification) => {
  // NON serializzare notification.payload! Supabase gestisce JSONB automaticamente
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert([notification])
    .select();
  if (error) throw error;
  return data?.[0];
};

// Ottieni tutte le notifiche per tenant_id
export const getNotifications = async (tenant_id) => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("*")
    .eq("tenant_id", tenant_id)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
};

// Aggiorna una notifica (es: segna come letta, modifica contenuto)
export const updateNotification = async (id, updates) => {
  // Se aggiorno il payload, lo serializzo
  if (updates.payload && typeof updates.payload !== "string") {
    updates.payload = JSON.stringify(updates.payload);
  }
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .update(updates)
    .eq("id", id)
    .select();
  if (error) throw error;
  return data?.[0];
};

// Elimina una notifica
export const deleteNotification = async (id) => {
  const { error } = await supabase.from(TABLE_NAME).delete().eq("id", id);
  if (error) throw error;
  return true;
};

// Elimina tutte le notifiche di un tenant
export const deleteAllNotifications = async (tenant_id) => {
  const { error } = await supabase
    .from(TABLE_NAME)
    .delete()
    .eq("tenant_id", tenant_id);
  if (error) throw error;
  return true;
};
