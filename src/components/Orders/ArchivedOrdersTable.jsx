import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { TableContainer } from "../../styles/ArchiveDashboardStyles";
import { supabase } from "../../supabase/supabaseClient";
import { useNavigate } from "react-router-dom";

const ArchivedOrdersTable = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orderBy, setOrderBy] = useState("startDate");
  const [order, setOrder] = useState("desc");

  // Recupera gli ordini da Supabase
  const fetchOrders = async (column, direction) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("archived")
        .select("*")
        .order(column, { ascending: direction === "asc" });

      if (error) throw error;
      setOrders(data);
    } catch (error) {
      console.error("Errore durante il fetch dei dati:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Effettua il fetch all'inizializzazione e quando cambia l'ordinamento
  useEffect(() => {
    fetchOrders(orderBy, order);
  }, [orderBy, order]);

  // Gestisce l'ordinamento
  const handleRequestSort = (property) => {
    setOrderBy(property);
    setOrder(order === "asc" ? "desc" : "asc");
  };

  // Elimina un ordine
  const handleDelete = async (id) => {
    try {
      const { error } = await supabase.from("archived").delete().eq("id", id);
      if (error) throw error;

      setOrders((prevOrders) => prevOrders.filter((order) => order.id !== id));
    } catch (error) {
      console.error(
        "Errore durante l'eliminazione dell'ordine:",
        error.message
      );
    }
  };

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <TableSortLabel
                active={orderBy === "orderName"}
                direction={orderBy === "orderName" ? order : "asc"}
                onClick={() => handleRequestSort("orderName")}
              >
                Nome Ordine
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === "startDate"}
                direction={orderBy === "startDate" ? order : "asc"}
                onClick={() => handleRequestSort("startDate")}
              >
                Data Inizio
              </TableSortLabel>
            </TableCell>
            <TableCell>Azioni</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={3}>Caricamento...</TableCell>
            </TableRow>
          ) : (
            orders.map((order) => (
              <TableRow
                onClick={() => navigate(`/archivio/${order.id}`)}
                key={order.id}
              >
                <TableCell>{order.orderName}</TableCell>
                <TableCell>
                  {new Date(order.startDate).toLocaleDateString("it-IT")}
                </TableCell>
                <TableCell>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(order.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ArchivedOrdersTable;
