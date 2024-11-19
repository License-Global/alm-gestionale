import { useState, useEffect } from "react";
import { supabase } from "../supabase/supabaseClient";

const useRealtime = (table) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from(table).select("*");
      if (error) console.error("Error fetching data:", error);
      else setData(data);
    };

    fetchData();

    const channel = supabase
      .channel(`${table}-realtime`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table },
        (payload) => {
          switch (payload.eventType) {
            case "INSERT":
              setData((prevData) => [...prevData, payload.new]);
              break;
            case "UPDATE":
              setData((prevData) =>
                prevData.map((item) =>
                  item.id === payload.new.id ? payload.new : item
                )
              );
              break;
            case "DELETE":
              setData((prevData) =>
                prevData.filter((item) => item.id !== payload.old.id)
              );
              break;
            default:
              break;
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table]);

  return data;
};

export default useRealtime;
