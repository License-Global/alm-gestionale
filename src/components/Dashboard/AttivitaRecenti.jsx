import React, { useState } from "react";
import { Typography, CircularProgress, Box } from "@mui/material";
import NotificationCard from "./components/NotificationCard";
import { useNotifications } from "../../hooks/useNotification";
import useUser from "../../hooks/useUser";

const AttivitaRecenti = () => {
  const { userId, loading } = useUser();
  const notifications = useNotifications(userId);

  // Numero di notifiche da mostrare inizialmente e incremento
  const INITIAL_COUNT = 10;
  const INCREMENT = 10;
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  // Mostra solo le notifiche visibili
  const visibleNotifications = notifications.slice(0, visibleCount);

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
        ) : visibleNotifications.length > 0 ? (
          <>
            {visibleNotifications.map((notification) => (
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
                displayMode={getNotificationType(notification?.type)}
                message={notification.payload?.message || ""}
                action_url={notification.payload?.action_url}
                action_label={notification.payload?.action_label}
                action_object={notification.payload?.action_object}
                reference_object={notification.payload?.reference_object}
              />
            ))}
            {notifications.length > visibleCount && (
              <Box display="flex" justifyContent="center" sx={{ mt: 2 }}>
                <button
                  style={{
                    padding: "6px 16px",
                    borderRadius: "4px",
                    border: "none",
                    background: "#1976d2",
                    color: "#fff",
                    cursor: "pointer",
                    fontSize: "0.95rem",
                  }}
                  onClick={() => setVisibleCount((c) => c + INCREMENT)}
                >
                  Mostra altre
                </button>
              </Box>
            )}
          </>
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
