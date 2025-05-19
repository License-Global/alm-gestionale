import MainTable from "../Tables/MainTable";
import NoOrders from "./NoOrders";

const urgencyLevels = {
  Bassa: 0,
  Media: 1,
  Alta: 2,
  Urgente: 3,
};

const Commesse = ({ orders }) => {
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

export default Commesse;
