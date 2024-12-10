import React from "react";
import useActiveUser from "../hooks/useActiveUser";
import OrderSummary from "../components/Orders/OrderSummary";
import ToDelete from "../components/ToDelete";

const Archivio = () => {
  return (
    <div>
      <ToDelete />
      <OrderSummary />{" "}
    </div>
  );
};

export default Archivio;
