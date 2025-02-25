// src/hooks/useOrders.js
import { useState, useEffect } from "react";
import { fetchCustomers, fetchCustomerById } from "../services/customerService";
import { supabase } from "../supabase/supabaseClient";

export const useCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getCustomers = async () => {
      try {
        const data = await fetchCustomers();
        setCustomers(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    getCustomers();
  }, []);

  return { customers, loading, error };
};

export const useCustomer = (customer_id) => {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getCustomer = async () => {
      try {
        const data = await fetchCustomerById(customer_id);
        setCustomer(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    if (customer_id) {
      getCustomer();
    }
  }, [customer_id]);

  return { customer, loading, error };
};
