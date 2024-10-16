// src/services/orderService.js
import { supabase } from "../supabase/supabaseClient";

export const fetchPersonale = async () => {
  const { data, error } = await supabase.from("Personale").select(`*`);
  if (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
  return data;
};

export const createOrder = async (orderData) => {
  const { data, error } = await supabase.from("Orders").insert([orderData]);
  if (error) {
    console.error("Error creating order:", error);
    throw error;
  }
  return data;
};
