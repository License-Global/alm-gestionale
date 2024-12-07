import React from "react";
import MainTable from "../components/Tables/MainTable";
import useSession from "../hooks/useSession";
import NoOrders from "../components/Orders/NoOrders";
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
