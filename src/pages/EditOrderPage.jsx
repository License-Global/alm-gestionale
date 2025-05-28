import React from "react";
import { useParams } from "react-router-dom";
import { useOrder } from "../hooks/useOrders";
import { Box } from "@mui/material";
import { PageContainer } from "../styles/ArchiveDashboardStyles";
import { SectionTitle } from "../styles/ArchiveDashboardStyles";
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
    <Box sx={{ bgcolor: "white" }}>
      <PageContainer sx={{ bgcolor: "white" }}>
        <SectionTitle variant="h4">Gestione Ordini</SectionTitle>
        <ModificaOrdine order={order} personale={personale} />
      </PageContainer>
    </Box>
  );
};

export default EditOrderPage;
