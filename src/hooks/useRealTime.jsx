import { useState, useEffect } from "react";
import { supabase } from "../supabase/supabaseClient";

/**
 * orderTable: la tua tabella principale (ex: 'orders')
 * activityTable: la tabella figlia (ex: 'activities')
 */
const useRealtimeOrderWithActivities = (orderTable, activityTable) => {
  const [data, setData] = useState([]);

  // Funzione che ricarica tutti i dati (orders + activities nested, ordinate per id)
  const fetchData = async () => {
    const { data: orders, error } = await supabase
      .from(orderTable)
      .select(
        `
        *,
        ${activityTable} (*)
      `
      )
      // Ordina le attività del foreign table in base all'ID
      .order("id", { ascending: true, foreignTable: activityTable });

    if (error) {
      console.error("Error fetching data:", error);
    } else {
      setData(orders);
    }
  };

  useEffect(() => {
    fetchData();

    // --- Realtime su orders ---
    const ordersChannel = supabase
      .channel(`${orderTable}-realtime`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: orderTable },
        (payload) => {
          switch (payload.eventType) {
            case "INSERT":
              setData((prev) => [...prev, payload.new]);
              break;
            case "UPDATE":
              setData((prev) =>
                prev.map((item) =>
                  item.id === payload.new.id ? payload.new : item
                )
              );
              break;
            case "DELETE":
              setData((prev) =>
                prev.filter((item) => item.id !== payload.old.id)
              );
              break;
            default:
              break;
          }
        }
      )
      .subscribe();

    // --- Realtime su activities ---
    const activitiesChannel = supabase
      .channel(`${activityTable}-realtime`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: activityTable },
        () => {
          // Ricarica tutto per avere le attività ordinate per id.
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(ordersChannel);
      supabase.removeChannel(activitiesChannel);
    };
  }, [orderTable, activityTable]);

  return data;
};

export default useRealtimeOrderWithActivities;
