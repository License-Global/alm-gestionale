import React from "react";
import { Box, Stack } from "@mui/material";
import { TrendingUp, PeopleAlt, ShoppingCart } from "@mui/icons-material";
import StatWidget from "./StatWidget";
import { useArchivedOrders } from "../../hooks/useArchivedOrder";

export default function StatHeader({ orders }) {
  const { orders: archivedOrders } = useArchivedOrders();
  // Calcola le statistiche dai dati degli ordini
  const calculateStats = () => {
    if (!orders || !Array.isArray(orders)) {
      return {
        total: 0,
        inProgress: 0,
        completed: 0,
        revenue: 0,
      };
    }

    const total = orders.length + archivedOrders.length;

    // Commesse in corso: ordini con almeno 1 attività non in "Standby"
    const inProgress = orders.filter(
      (order) =>
        order.activities &&
        order.activities.some(
          (activity) => activity.status && activity.status !== "Standby"
        )
    ).length;

    // Commesse completate: ordini dove tutte le attività sono completate
    const completed = orders.filter(
      (order) =>
        order.activities &&
        order.activities.length > 0 &&
        order.activities.every(
          (activity) => activity.completed !== null && activity.completed
        )
    ).length;

    return {
      total,
      inProgress,
      completed,
      revenue: 0, // Mantieni 0 o calcola se hai dati di fatturato
    };
  };

  const stats = calculateStats();

  return (
    <Box sx={{ mb: 4 }}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <StatWidget
          title="Totale commesse"
          value={stats.total.toString()
          }
          icon={<PeopleAlt />}
          color="primary"
        />
        <StatWidget
          title="Commesse in Corso"
          value={stats.total.toString() - archivedOrders.length}
          icon={<ShoppingCart />}
          color="secondary"
        />

        <StatWidget
          title="Commesse Completate"
          value={archivedOrders.length.toString()}
          icon={<TrendingUp />}
          color="info"
        />
      </Stack>
    </Box>
  );
}
