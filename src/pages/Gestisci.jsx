import React from "react";
import { useOrders } from "../hooks/useOrders";
import BasicTable from "../components/Tables/BasicTable";
import {
  PageContainer,
  SectionPaper,
  SectionTitle,
} from "../styles/ArchiveDashboardStyles";

const Gestisci = () => {
  const { orders, isLoading } = useOrders();
  return (
    <div>
      <PageContainer>
        <SectionPaper>
          <SectionTitle variant="h4">Gestione Ordini</SectionTitle>
          <BasicTable orders={orders} />
        </SectionPaper>
      </PageContainer>
    </div>
  );
};

export default Gestisci;
