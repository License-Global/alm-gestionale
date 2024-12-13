import React from "react";
import useActiveUser from "../hooks/useActiveUser";
import OrderSummary from "../components/Orders/OrderSummary";
import ArchivedOrderPage from "./ArchivedOrderPage";

const Archivio = () => {
  return (
    <div>
      <ArchivedOrderPage />
    </div>
  );
};

export default Archivio;
