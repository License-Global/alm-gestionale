// src/services/orderService.js
import { supabase } from "../supabase/supabaseClient";

export const fetchPersonale = async () => {
  const { data, error } = await supabase.from("personale").select(`*`);
  if (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
  return data;
};

export const fetchPersonaleById = async (operator_id) => {
  const { data, error } = await supabase
    .from("personale")
    .select("*")
    .eq("id", operator_id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export async function insertPersonale(record) {
  try {
    const { data, error } = await supabase
      .from("personale")
      .insert([record])
      .select();

    if (error) {
      console.error("Errore nell'inserimento:", error.message);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err) {
    console.error("Errore imprevisto:", err.message);
    return { data: null, error: err };
  }
}

export async function updatePersonale(id, operatorData) {
  const { data, error } = await supabase
    .from("personale")
    .update({     workerName: operatorData.workerName,
      operator_address: operatorData.operator_address,
      operator_email: operatorData.operator_email,
      operator_phone: operatorData.operator_phone,
      operator_note: operatorData.operator_note, })
    .eq("id", id);

  if (error) {
    console.error("Errore nell'aggiornamento del personale:", error.message);
    return { data: null, error };
  }

  return { data, error: null };
}

export async function deletePersonale(id) {
  const { data, error } = await supabase
    .from("personale")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Errore nella rimozione del personale:", error.message);
    return { error };
  }

  return { data };
}


export const getActivitiesByStaffId = async (staffId) => {
  try {
      let { data, error } = await supabase
          .from('activities')
          .select('*')
          .eq('responsible', staffId);

      if (error) throw error;
      return data;
  } catch (err) {
      console.error('Errore nel recupero delle attività:', err);
      return [];
  }
};