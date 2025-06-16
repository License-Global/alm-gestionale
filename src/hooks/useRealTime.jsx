import { useState, useEffect } from "react";
import { supabase } from "../supabase/supabaseClient";

/**
 * orderTable: tabella principale (es: 'orders')
 * activityTable: tabella figlia collegata (es: 'activities')
 */
const useRealtimeOrderWithActivities = (orderTable, activityTable) => {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    const { data: orders, error } = await supabase
      .from(orderTable)
      .select(
        `
        *,
        orderManager:personale (id, workerName),
        client:customers (id, customer_name),
        ${activityTable} (
          *,
          responsible:personale (id, workerName)
        )
      `
      )
      .order("id", { ascending: true, foreignTable: activityTable });

    if (error) {
      console.error("Error fetching data:", error);
    } else {
      setData(orders);
    }
  };

  useEffect(() => {
    fetchData();

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

    const activitiesChannel = supabase
      .channel(`${activityTable}-realtime`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: activityTable },
        () => {
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
