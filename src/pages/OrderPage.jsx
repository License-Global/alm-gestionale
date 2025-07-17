import React, { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { useOrder } from "../hooks/useOrders";
import { Box } from "@mui/system";
import MainTable from "../components/Tables/MainTable";
import useRealtimeSingleOrderWithActivities from "../hooks/useRealTimeSingle";

const OrderPage = () => {
  const { id } = useParams();
  // const { order, loading } = useOrder(id);
  const order = useRealtimeSingleOrderWithActivities(
    "orders",
    "activities",
    id
  );

  // Ordina le attività per id crescente se presenti
  const sortedOrder = useMemo(() => {
    if (!order) return null;
    if (!Array.isArray(order.activities)) return order;
    return {
      ...order,
      activities: [...order.activities].sort(
        (a, b) => (a.id || 0) - (b.id || 0)
      ),
    };
  }, [order]);

  return (
    <div>
      {!sortedOrder ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <div>
          <MainTable order={sortedOrder} isSingleOrderPage={true} />
        </div>
      )}
    </div>
  );
};

export default OrderPage;
