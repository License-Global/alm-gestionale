import React, { useState, useEffect } from "react";
import MainTable from "../components/Tables/MainTable";
import useSession from "../hooks/useSession";
import { useNavigate } from "react-router-dom";
import NoOrders from "../components/Orders/NoOrders";

import { useOrders } from "../hooks/useOrders";

const Home = () => {
  const { session } = useSession();
  const [allOrders, setAllOrders] = useState([]);
  const { orders } = useOrders();

  useEffect(() => {
    setAllOrders(orders);
  }, [orders]);

  return (
    <div>
      {allOrders.length === 0 ? (
        <NoOrders />
      ) : (
        <MainTable orders={allOrders} setOrders={setAllOrders} />
      )}
    </div>
  );
};

export default Home;
