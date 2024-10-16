// src/hooks/useOrders.js
import { useState, useEffect } from "react";
import { fetchPersonale } from "../services/personaleService";

export const usePersonale = () => {
  const [personale, setPersonale] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getPersonale = async () => {
      try {
        const data = await fetchPersonale();
        setPersonale(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    getPersonale();
  }, []);

  return { personale, loading, error };
};
