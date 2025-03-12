// src/hooks/useOrders.js
import { useState, useEffect } from "react";
import { fetchOrders, fetchOrderById } from "../services/orderService";
import { supabase } from "../supabase/supabaseClient";

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

export const useAllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        // 1. Recupera gli ordini dalla tabella 'orders'
        //    con le attività collegate tramite la foreign key esistente
        const { data: ordersData, error: ordersError } = await supabase.from(
          "orders"
        ).select(`
            *,
            activities(*)
          `);

        if (ordersError) throw ordersError;

        // 2. Recupera gli ordini dalla tabella 'archived'
        //    Se non hai relazioni con 'activities', basta fare una select dei campi di archived
        const { data: archivedData, error: archivedError } = await supabase
          .from("archived")
          .select("*"); // qui niente activities(*)

        if (archivedError) throw archivedError;

        // 3. Combina i risultati in un unico array
        const combinedData = [...ordersData, ...archivedData];

        // 4. Aggiorna lo stato
        setOrders(combinedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return { orders, loading, error };
};

export const useOrderIdByActivity = (activityId) => {
  const [orderId, setOrderId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
      const fetchOrderId = async () => {
          setLoading(true);
          try {
              let { data, error } = await supabase
                  .from('activities')
                  .select('order_id')
                  .eq('id', activityId)
                  .single();
              
              if (error) throw error;
              setOrderId(data ? data.order_id : null);
          } catch (err) {
              setError(err);
              console.error('Errore nel recupero dell ID ordine:', err);
          } finally {
              setLoading(false);
          }
      };

      if (activityId) {
          fetchOrderId();
      }
  }, [activityId]);

  return { orderId, loading, error };
};
