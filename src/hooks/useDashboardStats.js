import { useMemo } from "react";

export const useDashboardStats = (orders) => {
  return useMemo(() => {
    if (!orders || !Array.isArray(orders)) {
      return {
        dailyStats: { new: 0, resolved: 0, pending: 0, rejected: 0 },
        orderStatus: { open: 0, inProgress: 0, completed: 0 },
        notifications: 0,
        warnings: [],
        recentFiles: [],
        messages: [],
        todos: [],
        upcomingAppointments: [],
      };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Statistiche giornaliere - calcoli ottimizzati
    const todayOrders = orders.filter((order) => {
      const orderDate = new Date(order.created_at);
      return orderDate >= today && orderDate < tomorrow;
    });

    const completedToday = orders.filter((order) => {
      if (!order.activities || !Array.isArray(order.activities)) return false;
      return order.activities.some((activity) => {
        if (!activity.completed) return false;
        const completedDate = new Date(activity.completed);
        return completedDate >= today && completedDate < tomorrow;
      });
    });

    // Stato commesse
    const openOrders = orders.filter(
      (order) =>
        !order.activities ||
        order.activities.length === 0 ||
        order.activities.some((activity) => activity.status === "Standby")
    );

    const inProgressOrders = orders.filter(
      (order) =>
        order.activities &&
        order.activities.some(
          (activity) =>
            activity.status &&
            !["Standby", "Completato"].includes(activity.status)
        )
    );

    const completedOrders = orders.filter(
      (order) =>
        order.activities &&
        order.activities.length > 0 &&
        order.activities.every((activity) => activity.status === "Completato")
    );

    // Notifiche urgenti (ordini con scadenze vicine)
    const urgentOrders = orders.filter((order) => {
      if (!order.activities) return false;
      return order.activities.some((activity) => {
        if (!activity.endDate || activity.completed) return false;
        const endDate = new Date(activity.endDate);
        const diffDays = (endDate - new Date()) / (1000 * 60 * 60 * 24);
        return diffDays <= 3 && diffDays > 0; // Prossimi 3 giorni
      });
    });

    // Avvisi (ordini in ritardo)
    const overdueOrders = orders.filter((order) => {
      if (!order.activities) return false;
      return order.activities.some((activity) => {
        if (!activity.endDate || activity.completed) return false;
        return new Date(activity.endDate) < new Date();
      });
    });

    // Prossimi appuntamenti basati sulle scadenze delle attività
    const appointments = [];
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    orders.forEach((order) => {
      if (!order.activities) return;
      order.activities.forEach((activity) => {
        if (!activity.endDate || activity.completed) return;
        const endDate = new Date(activity.endDate);
        if (endDate >= today && endDate <= nextWeek) {
          appointments.push({
            ora: endDate.toLocaleTimeString("it-IT", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            titolo: activity.name || "Attività",
            stato:
              activity.status === "Completato"
                ? "Completato"
                : new Date(activity.endDate) < new Date()
                ? "In ritardo"
                : "Programmato",
            colore:
              activity.status === "Completato"
                ? "success"
                : new Date(activity.endDate) < new Date()
                ? "error"
                : "warning",
          });
        }
      });
    });

    const upcomingAppointments = appointments
      .sort((a, b) => a.ora.localeCompare(b.ora))
      .slice(0, 3);

    return {
      dailyStats: {
        new: todayOrders.length,
        resolved: completedToday.length,
        pending: inProgressOrders.length,
        rejected: 0, // Non abbiamo questa info, manteniamo 0
      },
      orderStatus: {
        open: openOrders.length,
        inProgress: inProgressOrders.length,
        completed: completedOrders.length,
      },
      notifications: urgentOrders.length,
      warnings: [
        ...(overdueOrders.length > 0
          ? [`${overdueOrders.length} ordini in ritardo`]
          : []),
        "Backup non eseguito oggi",
        "Spazio su disco al 92%",
      ].filter(Boolean),
      recentFiles: [
        { nome: "contratto_clienteA.pdf", data: "10 Mag" },
        { nome: "progetto_v2.xlsx", data: "9 Mag" },
        { nome: "offerta.docx", data: "7 Mag" },
      ],
      messages: [
        { nome: "Alessio", messaggio: "Conferma ricevuta" },
        { nome: "Luca", messaggio: "Richiesta modifiche..." },
        { nome: "Marco", messaggio: "Hai tempo per una call?" },
      ],
      todos: [
        { testo: "Controllare le mail", done: true },
        { testo: "Aggiornare la reportistica", done: false },
        { testo: "Inviare preventivi", done: false },
      ],
      upcomingAppointments,
    };
  }, [orders]);
};
