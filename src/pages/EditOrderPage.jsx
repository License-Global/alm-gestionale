import React from "react";
import EditOrder from "../components/Orders/EditOrder";
import { useParams } from "react-router-dom";
import { useOrder } from "../hooks/useOrders";
import { Typography } from "@mui/material";

const EditOrderPage = () => {
  const { id } = useParams();
  const { order, loading, error } = useOrder(id);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!order) return <p>Order not found</p>;

  return (
    <div>
      <Typography
        variant="h4"
        component="h4"
        gutterBottom
        sx={{ mt: 2, mb: 1, textAlign: "center" }}
      >
        Dettaglio dell'ordine
      </Typography>
      <EditOrder order={order} />
    </div>
  );
};

export default EditOrderPage;
