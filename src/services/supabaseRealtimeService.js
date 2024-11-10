import { supabase } from "../supabase/supabaseClient";
/**
 * Avvia il canale Supabase Realtime per ascoltare gli aggiornamenti della tabella 'orders'
 * @param {String} orderId - L'ID dell'ordine da monitorare
 * @param {Function} onUpdate - Callback eseguita ogni volta che l'ordine viene aggiornato
 */
export const subscribeToOrderUpdates = (orderId, onUpdate) => {
  const channel = supabase
    .channel(`public:orders:id=eq.${orderId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "orders",
        filter: `id=eq.${orderId}`,
      },
      (payload) => {
        console.log("Modifica rilevata nel servizio:", payload);
        if (onUpdate) onUpdate(payload.new); // Passa i dati aggiornati alla callback
      }
    )
    .subscribe();

  return channel;
};

/**
 * Disconnette il canale Realtime
 * @param {Object} channel - Il canale da rimuovere
 */
export const unsubscribeFromOrderUpdates = (channel) => {
  supabase.removeChannel(channel);
};
