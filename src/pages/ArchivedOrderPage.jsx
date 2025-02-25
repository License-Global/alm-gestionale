import React from "react";
import {
  PageContainer,
  SectionTitle,
} from "../styles/ArchiveDashboardStyles.js";
import { Box, Paper } from "@mui/material";
import ArchivedOrdersTable from "../components/Orders/ArchivedOrdersTable.jsx";

const ArchivedOrderPage = () => {
  return (
    <PageContainer>
      <Box sx={{ p: 3 }}>
        <Paper sx={{ p: 3, mb: 3, boxShadow: " 15px 15px 15px #ccc" }}>
          <SectionTitle variant="h4">Ordini Archiviati</SectionTitle>
          <ArchivedOrdersTable />
        </Paper>
      </Box>
    </PageContainer>
  );
};

export default ArchivedOrderPage;
