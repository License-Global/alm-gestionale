import { useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseClient";

export function useNotifications(tenant_id) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!tenant_id) return;

    const fetchInitial = async () => {
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("tenant_id", tenant_id)
        .order("created_at", { ascending: false });

      if (data) setNotifications(data);
    };

    fetchInitial();

    const channel = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `tenant_id=eq.${tenant_id}`,
        },
        (payload) => {
          setNotifications((prev) => {
            // Evita duplicati se la notifica è già presente
            if (prev.some((n) => n.id === payload.new.id)) return prev;
            return [payload.new, ...prev];
          });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "notifications",
          filter: `tenant_id=eq.${tenant_id}`,
        },
        (payload) => {
          setNotifications((prev) =>
            prev.map((n) => (n.id === payload.new.id ? payload.new : n))
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tenant_id]);

  return notifications;
}
