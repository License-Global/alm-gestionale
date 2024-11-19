import React, { useState, useEffect } from "react";
import MainTable from "../components/Tables/MainTable";
import useSession from "../hooks/useSession";
import { useNavigate } from "react-router-dom";
import NoOrders from "../components/Orders/NoOrders";
import { useOrders } from "../hooks/useOrders";
import { supabase } from "../supabase/supabaseClient";
import useRealtime from "../hooks/useRealTime";

const Home = () => {
  const { session } = useSession();

  let orders = useRealtime("orders");

  return (
    <div>
      {orders.length === 0 ? (
        <NoOrders />
      ) : (
        orders.map((order) => <MainTable key={order.id} order={order} />)
      )}
    </div>
  );
};

export default Home;
