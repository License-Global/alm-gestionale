import React from "react";
import EditOrder from "../components/Orders/EditOrder";
import { useParams } from "react-router-dom";
import { useOrder } from "../hooks/useOrders";
import { Typography } from "@mui/material";
import { CircularProgress } from "@mui/material";
import ModificaOrdine from "../components/Orders/ModificaOrdine";
import { usePersonale } from "../hooks/usePersonale";

const EditOrderPage = () => {
  const personale = usePersonale();
  const { id } = useParams();
  const { order, loading, error } = useOrder(id);

  if (loading || personale.loading)
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </div>
    );
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
      {/* <EditOrder order={order} /> */}
      <ModificaOrdine order={order} personale={personale} />
    </div>
  );
};

export default EditOrderPage;
