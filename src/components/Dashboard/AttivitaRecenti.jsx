import React from "react";
import { Typography, CircularProgress, Box } from "@mui/material";
import NotificationCard from "./components/NotificationCard";
import { useNotifications } from "../../hooks/useNotification";
import useUser from "../../hooks/useUser";

const AttivitaRecenti = () => {
  const { userId, loading } = useUser();
  const notifications = useNotifications(userId);

  // Mostra solo le ultime 10 notifiche
  const recentNotifications = notifications.slice(0, 10);
  return (
    <div>
      <div
        style={{
          maxHeight: "400px",
          overflowY: "auto",
          overflowX: "hidden",
          paddingRight: "4px",
        }}
      >
        {" "}
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{ p: 4 }}
          >
            <CircularProgress size={24} />
          </Box>
        ) : recentNotifications.length > 0 ? (
          recentNotifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              type={getNotificationType(notification.payload?.type)}
              title={notification.payload?.title || "Notifica"}
              id={notification.payload?.id || ""}
              name={notification.payload?.name || ""}
              category={notification.payload?.category || ""}
              date={new Date(notification.created_at).toLocaleDateString(
                "it-IT"
              )}
              time={new Date(notification.created_at).toLocaleTimeString(
                "it-IT",
                {
                  hour: "2-digit",
                  minute: "2-digit",
                }
              )}
              displayMode={
                getNotificationType(notification?.type)
              }
              message={notification.payload?.message || ""}
              action_url={notification.payload?.action_url}
              action_label={notification.payload?.action_label}
            />
          ))
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
            Nessuna attività recente
          </Typography>
        )}
      </div>
    </div>
  );
};

// Funzione helper per mappare il tipo di notifica
const getNotificationType = (type) => {
  switch (type) {
    case "customer":
    case "cliente":
      return "cliente";
    case "order":
    case "commessa":
      return "commessa";
    case "message":
    case "messaggio":
      return "messaggio";
    default:
      return "cliente";
  }
};

export default AttivitaRecenti;
