import { supabase } from "./supabaseClient";
export const subscribeToOrderUpdates = (callback) => {
  return supabase
    .channel("realtime:orders")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "orders" },
      (payload) => {
        callback(payload);
      }
    )
    .subscribe();
};

export const unsubscribeFromOrderUpdates = (subscription) => {
  supabase.removeChannel(subscription);
};
