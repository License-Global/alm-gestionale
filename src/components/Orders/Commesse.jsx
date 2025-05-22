import MainTable from "../Tables/MainTable";
import NoOrders from "./NoOrders";

const Commesse = ({ orders }) => {

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

export default Commesse;
