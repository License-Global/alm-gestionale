// src/services/orderService.js
import { supabase } from "../supabase/supabaseClient";

export const fetchOrders = async () => {
  const { data, error } = await supabase.from("orders").select(`*`);
  if (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
  return data;
};
export const fetchArchivedOrders = async () => {
  const { data, error } = await supabase.from("archived").select(`*`);
  if (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
  return data;
};

export const fetchOrderById = async (orderId) => {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
export const fetchArchivedOrderById = async (orderId) => {
  const { data, error } = await supabase
    .from("archived")
    .select("*")
    .eq("id", orderId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const archiveOrder = async (orderId) => {
  try {
    const { data, error } = await supabase
      .from("orders") // Nome della tabella
      .update({ isArchived: true }) // Aggiorna la colonna isArchived
      .eq("id", orderId); // Filtra per ID dell'ordine

    if (error) {
      console.error("Errore durante l'archiviazione dell'ordine:", error);
      return { success: false, error };
    }

    console.log("Ordine archiviato con successo:", data);
    return { success: true, data };
  } catch (err) {
    console.error("Errore sconosciuto:", err);
    return { success: false, error: err };
  }
};

export async function updateOrder(orderId, orderData) {
  try {
    const { data, error } = await supabase
      .from("orders")
      .update(orderData) // Passa direttamente l'oggetto con i campi
      .eq("id", orderId); // Condizione per identificare la riga

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Errore durante l'aggiornamento dell'ordine:", error.message);
    throw error;
  }
}
