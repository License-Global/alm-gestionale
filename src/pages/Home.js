import React, { useState, useEffect } from "react";
import MainTable from "../components/Tables/MainTable";
import useSession from "../hooks/useSession";
import { useNavigate } from "react-router-dom";
import NoOrders from "../components/Orders/NoOrders";
import { useOrders } from "../hooks/useOrders";
import { supabase } from "../supabase/supabaseClient";

const Home = () => {
  const { session } = useSession();
  const [allOrders, setAllOrders] = useState([]);
  const { orders } = useOrders();

  useEffect(() => {
    // Aggiorna gli ordini iniziali
    setAllOrders(orders);

    // Crea un canale per abbonarti agli eventi in tempo reale
    const channel = supabase
      .channel("orders-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        (payload) => {
          console.log("Change received!", payload);

          // Gestisci gli eventi in tempo reale
          if (payload.eventType === "INSERT") {
            setAllOrders((prevOrders) => [...prevOrders, payload.new]);
          } else if (payload.eventType === "UPDATE") {
            setAllOrders((prevOrders) =>
              prevOrders.map((order) =>
                order.id === payload.new.id ? payload.new : order
              )
            );
          } else if (payload.eventType === "DELETE") {
            setAllOrders((prevOrders) =>
              prevOrders.filter((order) => order.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    // Cleanup: annulla l'abbonamento quando il componente si smonta
    return () => {
      supabase.removeChannel(channel);
    };
  }, [orders]);

  return (
    <div>
      {allOrders.length === 0 ? (
        <NoOrders />
      ) : (
        allOrders.map((order) => <MainTable key={order.id} order={order} />)
      )}
    </div>
  );
};

export default Home;
