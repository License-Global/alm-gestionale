import React from "react";
import { Box, Grid, Tooltip } from "@mui/material";
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
        inserite: 0,
        inProgress: 0,
        completed: 0,
        revenue: 0,
      };
    }

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Commesse INSERITE: tutte quelle create nel mese corrente (attive + archiviate)
    const inseriteAttive = orders.filter((order) => {
      if (!order.created_at) return false;
      const d = new Date(order.created_at);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }).length;

    const inseriteArchiviate = archivedOrders.filter((order) => {
      if (!order.created_at) return false;
      const d = new Date(order.created_at);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }).length;

    const inserite = inseriteAttive + inseriteArchiviate;

    const total = orders.length + archivedOrders.length;

    // Commesse in corso: ordini con almeno 1 attività non in "Standby"
    const inProgress = orders.filter(
      (order) =>
        order.activities &&
        order.activities.some(
          (activity) => activity.status && activity.status !== "Standby"
        )
    ).length;

    // Commesse completate: solo quelle archiviate nel mese corrente
    const completed = archivedOrders.filter((order) => {
      if (!order.archived_at && !order.updated_at && !order.created_at)
        return false;
      // Usa archived_at se disponibile, altrimenti updated_at, altrimenti created_at
      const archiveDate = new Date(
        order.archived_at || order.updated_at || order.created_at
      );
      return (
        archiveDate.getMonth() === currentMonth &&
        archiveDate.getFullYear() === currentYear
      );
    }).length;

    return {
      total,
      inserite,
      inProgress,
      completed,
      revenue: 0, // Mantieni 0 o calcola se hai dati di fatturato
    };
  };

  const stats = calculateStats();

  return (
    <Box sx={{ mb: 4 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <Tooltip
            title="Numero di commesse create nel mese corrente, sia attive che archiviate."
            arrow
          >
            <span>
              <StatWidget
                title="Commesse inserite (mese)"
                value={stats.inserite.toString()}
                icon={<PeopleAlt />}
                color="primary"
              />
            </span>
          </Tooltip>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Tooltip
            title="Totale di tutte le commesse, sia attive che archiviate."
            arrow
          >
            <span>
              <StatWidget
                title="Totale commesse"
                value={stats.total.toString()}
                icon={<ShoppingCart />}
                color="secondary"
              />
            </span>
          </Tooltip>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Tooltip
            title="Commesse attive con almeno una attività non in stato 'Standby'."
            arrow
          >
            <span>
              <StatWidget
                title="Commesse in Corso"
                value={stats.inProgress.toString()}
                icon={<ShoppingCart />}
                color="warning"
              />
            </span>
          </Tooltip>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Tooltip
            title="Commesse archiviate nel mese corrente (una commessa è considerata completata solo quando viene archiviata)."
            arrow
          >
            <span>
              <StatWidget
                title="Commesse Completate (mese)"
                value={stats.completed.toString()}
                icon={<TrendingUp />}
                color="info"
              />
            </span>
          </Tooltip>
        </Grid>
      </Grid>
    </Box>
  );
}
