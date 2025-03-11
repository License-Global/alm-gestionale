import { useEffect } from "react";
import { useAllOrders } from "../../hooks/useOrders";
import { useCustomers } from "../../hooks/useCustomeres";
import { usePersonale } from "../../hooks/usePersonale";

const SearchDataLoader = ({ onDataLoaded }) => {
  const { orders, loading: ordersLoading } = useAllOrders();
  const { customers, loading: customersLoading } = useCustomers();
  const { personale, loading: operatorsLoading } = usePersonale();

  const loading = ordersLoading || customersLoading || operatorsLoading;

  // Quando i dati sono disponibili, li passa al componente padre
  useEffect(() => {
    if (!loading) {
      onDataLoaded({ orders, customers, personale });
    }
  }, [orders, customers, personale, loading, onDataLoaded]);

  return null; // Non renderizza nulla in UI
};

export default SearchDataLoader;
