import { supabase } from "../supabase/supabaseClient";

/**
 * Sottoscrizione agli aggiornamenti di un ordine specifico e delle sue attività
 * @param {String} orderId - L'ID dell'ordine da monitorare
 * @param {Function} onUpdate - Callback eseguita quando l'ordine viene aggiornato
 * @returns {Object} - Oggetto con i canali di sottoscrizione
 */
export const subscribeToOrderUpdates = (orderId, onUpdate) => {
  // Funzione per recuperare l'ordine completo con le attività
  const fetchCompleteOrder = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          activities!activities_order_id_fkey (*)
        `)
        .eq("id", orderId)
        .order("id", { foreignTable: "activities", ascending: true })
        .single();

      if (error) {
        console.error("Errore nel recupero dell'ordine:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Errore nel fetch dell'ordine completo:", error);
      return null;
    }
  };

  // Canale per gli aggiornamenti della tabella orders
  const ordersChannel = supabase
    .channel(`public:orders:id=eq.${orderId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "orders",
        filter: `id=eq.${orderId}`,
      },
      async (payload) => {
        console.log("Modifica rilevata nella tabella orders:", payload);
        const completeOrder = await fetchCompleteOrder();
        if (completeOrder && onUpdate) {
          onUpdate(completeOrder);
        }
      }
    )
    .subscribe();

  // Canale per gli aggiornamenti delle attività correlate a questo ordine
  const activitiesChannel = supabase
    .channel(`public:activities:order_id=eq.${orderId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "activities",
        filter: `order_id=eq.${orderId}`,
      },
      async (payload) => {
        console.log("Modifica rilevata nelle attività:", payload);
        const completeOrder = await fetchCompleteOrder();
        if (completeOrder && onUpdate) {
          onUpdate(completeOrder);
        }
      }
    )
    .subscribe();

  return {
    ordersChannel,
    activitiesChannel,
    unsubscribe: () => {
      supabase.removeChannel(ordersChannel);
      supabase.removeChannel(activitiesChannel);
    }
  };
};

/**
 * Disconnette i canali Realtime
 * @param {Object} channels - I canali da rimuovere
 */
export const unsubscribeFromOrderUpdates = (channels) => {
  if (channels && typeof channels.unsubscribe === 'function') {
    channels.unsubscribe();
  } else if (channels) {
    // Backward compatibility per il vecchio sistema
    supabase.removeChannel(channels);
  }
};
