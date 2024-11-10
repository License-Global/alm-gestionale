import React, { useState, useEffect } from "react";
import { useOrders } from "../hooks/useOrders";
import BasicTable from "../components/Tables/BasicTable";

const Gestisci = () => {
  const { orders, isLoading } = useOrders();
  return (
    <div>
      <BasicTable orders={orders} />
    </div>
  );
};

export default Gestisci;
