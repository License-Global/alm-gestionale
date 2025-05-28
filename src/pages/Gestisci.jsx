import React from "react";
import { useOrders } from "../hooks/useOrders";
import BasicTable from "../components/Tables/BasicTable";
import { Box, Paper } from "@mui/material";
import { PageContainer, SectionTitle } from "../styles/ArchiveDashboardStyles";

const Gestisci = () => {
  const { orders } = useOrders();
  return (
    <div>
      <PageContainer>
        <Box sx={{ p: 3 }}>
          <Paper sx={{ p: 3, mb: 3, boxShadow: " 15px 15px 15px #ccc" }}>
            <SectionTitle variant="h4">Dettagli commessa</SectionTitle>
            <BasicTable orders={orders} />
          </Paper>
        </Box>
      </PageContainer>
    </div>
  );
};

export default Gestisci;
