import React from "react";
import {
  PageContainer,
  SectionPaper,
  SectionTitle,
} from "../styles/ArchiveDashboardStyles.js";
import ArchivedOrdersTable from "../components/Orders/ArchivedOrdersTable.jsx";

const ArchivedOrderPage = () => {
  return (
    <PageContainer>
      <SectionPaper>
        <SectionTitle variant="h4">Ordini Archiviati</SectionTitle>
        <ArchivedOrdersTable />
      </SectionPaper>
    </PageContainer>
  );
};

export default ArchivedOrderPage;
