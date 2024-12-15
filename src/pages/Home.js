import React from "react";
import MainTable from "../components/Tables/MainTable";
import useSession from "../hooks/useSession";
import NoOrders from "../components/Orders/NoOrders";
import useRealtime from "../hooks/useRealTime";

const urgencyLevels = {
  Bassa: 0,
  Media: 1,
  Alta: 2,
  Urgente: 3,
};

const Home = () => {
  let orders = useRealtime("orders");

  const sortedOrders = orders.sort((a, b) => {
    return urgencyLevels[b.urgency] - urgencyLevels[a.urgency];
  });

  return (
    <div>
      {orders.length === 0 ? (
        <NoOrders />
      ) : (
        sortedOrders.map((order) => <MainTable key={order.id} order={order} />)
      )}
    </div>
  );
};

export default Home;
