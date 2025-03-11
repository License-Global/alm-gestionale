import React from "react";
import MainTable from "../components/Tables/MainTable";
import NoOrders from "../components/Orders/NoOrders";
import useRealtimeOrderWithActivities from "../hooks/useRealTime";

const urgencyLevels = {
  Bassa: 0,
  Media: 1,
  Alta: 2,
  Urgente: 3,
};

const Home = () => {
  let orders = useRealtimeOrderWithActivities("orders", "activities");

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
