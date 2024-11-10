// src/hooks/useOrders.js
import { useState, useEffect } from "react";
import { fetchOrders, fetchOrderById } from "../services/orderService";

export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getOrders = async () => {
      try {
        const data = await fetchOrders();
        setOrders(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    getOrders();
  }, []);

  return { orders, loading, error };
};

export const useOrder = (orderId) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getOrder = async () => {
      try {
        const data = await fetchOrderById(orderId);
        setOrder(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      getOrder();
    }
  }, [orderId]);

  return { order, loading, error };
};
