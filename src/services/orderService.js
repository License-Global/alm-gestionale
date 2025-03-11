// src/services/orderService.js
import { supabase } from "../supabase/supabaseClient";

export const fetchOrders = async () => {
  const { data, error } = await supabase.from("orders").select(`
      *,
      activities!activities_order_id_fkey (*)
    `);

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
    .select(
      `
      *,
      activities!activities_order_id_fkey (*)
    `
    )
    .eq("id", orderId)
    .order("id", { foreignTable: "activities" }) // Ordina le attività per id in ordine crescente
    .single(); // Restituisce un solo oggetto invece di un array

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
    // 1. Recupera l'ordine con le attività correlate dalla tabella "orders"
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .select(`*, activities(*)`)
      .eq("id", orderId)
      .single();

    if (orderError) throw orderError;
    if (!orderData) throw new Error("Ordine non trovato");

    // 2. Prepara il record da inserire in "archived"
    //    Separa le attività dal resto dei campi, e forza isArchived a true
    const { activities, ...restOfOrder } = orderData;
    const orderToArchive = {
      ...restOfOrder,
      activities, // Salviamo l'array delle attività nel campo JSONB (o come previsto)
      isArchived: true, // Imposta il flag a true
    };

    // 3. Inserisci il record nella tabella "archived"
    const { data: archivedInsert, error: archivedInsertError } = await supabase
      .from("archived")
      .insert(orderToArchive)
      .select() // per ottenere il record inserito
      .single();

    if (archivedInsertError) throw archivedInsertError;

    // 4. Elimina l'ordine dalla tabella "orders"
    const { error: deleteError } = await supabase
      .from("orders")
      .delete()
      .eq("id", orderId);

    if (deleteError) throw deleteError;

    return { success: true, data: archivedInsert };
  } catch (err) {
    console.error("Errore durante l'archiviazione dell'ordine:", err);
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
