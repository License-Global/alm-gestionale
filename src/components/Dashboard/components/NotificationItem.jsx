import React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import { motion } from "framer-motion";

const NotificationItem = ({ notif, idx, isLast }) => (
  <>
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.05 * idx }}
    >
      <ListItem
        alignItems="flex-start"
        sx={{
          "&:hover": {
            background: "#f5f7fa",
            cursor: "pointer",
            transition: "background 0.18s",
          },
          px: 2,
          py: 1.2,
        }}
      >
        <ListItemText
          primary={
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontWeight: 600,
                color: "#222",
                fontSize: 14,
                lineHeight: 1.2,
              }}
            >
              {notif.payload?.icon && (
                <i
                  className={`icon-${notif.payload.icon}`}
                  style={{
                    fontSize: 16,
                    color: "#1976d2",
                    marginRight: 4,
                  }}
                />
              )}
              <span
                style={{
                  flex: 1,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                {(() => {
                  const title = notif.payload?.title || "Notifica";
                  
                  // Funzione per creare il chip con colori appropriati
                  const createStatusChip = (keyword, backgroundColor) => {
                    const parts = title.split(keyword);
                    return (
                      <>
                        {parts[0]}
                        <Chip
                          label={keyword}
                          size="small"
                          sx={{
                            backgroundColor: backgroundColor,
                            color: "white",
                            fontSize: "10px",
                            height: "18px",
                            "& .MuiChip-label": {
                              padding: "0 6px",
                              fontSize: "10px",
                              fontWeight: 600,
                            },
                          }}
                        />
                        {parts[1]}
                      </>
                    );
                  };

                  if (title.includes("Bloccato")) {
                    return createStatusChip("Bloccato", "#d32f2f"); // Rosso
                  }
                  if (title.includes("In corso")) {
                    return createStatusChip("In corso", "#1976d2"); // Blu
                  }
                  if (title.includes("Completato")) {
                    return createStatusChip("Completato", "#2e7d32"); // Verde
                  }
                  
                  return title;
                })()}
              </span>
            </div>
          }
          secondary={
            <div
              style={{
                color: "#555",
                fontSize: 12,
                display: "flex",
                flexDirection: "column",
                gap: 2,
                marginTop: 2,
              }}
            >
              <span
                style={{
                  whiteSpace: "pre-line",
                  wordBreak: "break-word",
                }}
              >
                {notif.payload?.message || notif.message || ""}
              </span>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginTop: 2,
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  {notif.payload?.action_url && notif.payload?.action_label && (
                    <a
                      href={notif.payload.action_url}
                      style={{
                        color: "#1976d2",
                        fontWeight: 600,
                        fontSize: 11,
                        textDecoration: "underline",
                        borderRadius: 3,
                        padding: "1px 6px",
                        background: "#f1f5fb",
                        transition: "background 0.2s",
                      }}
                    >
                      {notif.payload.action_label}
                    </a>
                  )}
                </div>
                <span
                  style={{
                    color: "#888",
                    fontSize: 11,
                    marginLeft: "auto",
                    whiteSpace: "nowrap",
                    minWidth: 80,
                    textAlign: "right",
                  }}
                  title={
                    notif.created_at
                      ? new Date(notif.created_at).toLocaleString()
                      : ""
                  }
                >
                  {notif.created_at
                    ? new Date(notif.created_at).toLocaleDateString("it-IT", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                </span>
              </div>
            </div>
          }
        />
      </ListItem>
    </motion.div>
    {!isLast && <Divider component="li" style={{ margin: 0 }} />}
  </>
);

export default NotificationItem;
