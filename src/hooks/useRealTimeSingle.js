import { useState, useEffect } from "react";
import { supabase } from "../supabase/supabaseClient";

/**
 * Hook per ottenere un singolo ordine con attività collegate in tempo reale
 *
 * @param {string} orderTable - tabella principale (es: 'orders')
 * @param {string} activityTable - tabella figlia (es: 'activities')
 * @param {number|string} orderId - ID dell'ordine da monitorare
 */
const useRealtimeSingleOrderWithActivities = (
  orderTable,
  activityTable,
  orderId
) => {
  const [order, setOrder] = useState(null);

  const fetchOrder = async () => {
    const { data, error } = await supabase
      .from(orderTable)
      .select(
        `
        *,
        orderManager:personale (workerName),
        client:customers (customer_name),
        ${activityTable} (
          *,
          responsible:personale (workerName)
        )
      `
      )
      .eq("id", orderId)
      .single(); // restituisce direttamente un singolo oggetto

    if (error) {
      console.error("Error fetching order:", error);
    } else {
      setOrder(data);
    }
  };

  useEffect(() => {
    if (!orderId) return;

    fetchOrder();

    const orderChannel = supabase
      .channel(`${orderTable}-${orderId}-realtime`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: orderTable,
          filter: `id=eq.${orderId}`,
        },
        (payload) => {
          switch (payload.eventType) {
            case "UPDATE":
            case "INSERT":
              fetchOrder(); // ricarico tutto per ottenere join aggiornati
              break;
            case "DELETE":
              setOrder(null);
              break;
            default:
              break;
          }
        }
      )
      .subscribe();

    const activitiesChannel = supabase
      .channel(`${activityTable}-${orderId}-realtime`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: activityTable,
          filter: `order_id=eq.${orderId}`,
        },
        () => {
          fetchOrder();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(orderChannel);
      supabase.removeChannel(activitiesChannel);
    };
  }, [orderId, orderTable, activityTable]);

  return order;
};

export default useRealtimeSingleOrderWithActivities;
