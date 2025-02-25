import { supabase } from "../supabase/supabaseClient";

export const fetchCustomers = async () => {
  const { data, error } = await supabase.from("customers").select(`*`);
  if (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
  return data;
};

export const fetchCustomerById = async (customer_id) => {
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("id", customer_id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
export const addCustomer = async (customerData) => {
  const { data, error } = await supabase
    .from("customers")
    .insert([
      {
        customer_name: customerData.customer_name,
        customer_address: customerData.customer_address,
        customer_email: customerData.customer_email,
        customer_phone: customerData.customer_phone,
        customer_note: customerData.customer_note,
      },
    ])
    .select();
  if (error) {
    console.error("Errore nell'inserimento:", error.message);
    return data;
  }
};

export async function updateCustomer(id, customerData) {
  const { data, error } = await supabase
    .from("customers")
    .update({
      customer_name: customerData.customer_name,
      customer_address: customerData.customer_address,
      customer_email: customerData.customer_email,
      customer_phone: customerData.customer_phone,
      customer_note: customerData.customer_note,
    })
    .eq("id", id);

  if (error) {
    console.error("Errore nell'aggiornamento del cliente:", error.message);
    return { data: null, error };
  }

  return { data };
}

export async function deleteCustomer(id) {
  const { data, error } = await supabase
    .from("customers")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Errore nella rimozione del cliente:", error.message);
    return { error };
  }

  return { data };
}
