// src/hooks/useOrders.js
import { useState, useEffect } from "react";
import {
  fetchArchivedOrders,
  fetchArchivedOrderById,
} from "../services/orderService";

export const useArchivedOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getArchivedOrders = async () => {
      try {
        const data = await fetchArchivedOrders();
        setOrders(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    getArchivedOrders();
  }, []);

  return { orders, loading, error };
};

export const useArchivedOrder = (orderId) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getArchivedOrder = async () => {
      try {
        const data = await fetchArchivedOrderById(orderId);
        setOrder(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      getArchivedOrder();
    }
  }, [orderId]);

  return { order, loading, error };
};
