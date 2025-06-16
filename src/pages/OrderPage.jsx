import React, { useEffect } from "react";
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

  return (
    <div>
      {!order ? (
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
          <MainTable order={order} />
        </div>
      )}
    </div>
  );
};

export default OrderPage;
