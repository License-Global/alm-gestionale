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
