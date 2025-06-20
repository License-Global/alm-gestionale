import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import Badge from "@mui/material/Badge";
import Paper from "@mui/material/Paper";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { useNotifications } from "../../hooks/useNotification";
import { motion, AnimatePresence } from "framer-motion";
import { markAllAsRead } from "../../utils/notificationUtils";
import NotificationItem from "./components/NotificationItem";

const NotificationTool = ({ userId }) => {
  const notifications = useNotifications(userId) || [];
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const anchorRef = useRef(null);

  // Conteggio delle notifiche non lette
  const unreadCount = useMemo(() => {
    return notifications.filter(n => !n.read_at && !n.read).length;
  }, [notifications]);

  // Close dropdown on click outside
  const handleClickAway = useCallback(() => setOpen(false), []);

  // Toggle dropdown with callback optimization
  const handleToggle = useCallback(() => setOpen((prev) => !prev), []);

  // Keyboard navigation (esc to close)
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // Pulse animation for bell if there are notifications - memoizzata per performance
  const bellPulse = useMemo(() => {
    return unreadCount > 0
      ? {
          animate: {
            scale: [1, 1.08, 0.97, 1.05, 1],
            transition: { duration: 1.2, repeat: 2, repeatDelay: 2 },
          },
        }
      : {};
  }, [unreadCount]);

  // Segna tutte come lette
  const handleMarkAllAsRead = useCallback(async () => {
    if (!userId || notifications.length === 0) return;
    
    setLoading(true);
    try {
      const unreadNotifications = notifications.filter(n => !n.read_at && !n.read);
      
      if (unreadNotifications.length === 0) {
        setLoading(false);
        return;
      }

      await markAllAsRead(userId);
    } catch (error) {
      console.error('Errore nel segnare le notifiche come lette:', error);
    } finally {
      setLoading(false);
    }
  }, [userId, notifications]);

  return (
    <div
      style={{ position: "relative", display: "inline-block" }}
      ref={anchorRef}
    >
      <motion.div {...bellPulse}>
        <Badge
          badgeContent={unreadCount}
          color="error"
          sx={{
            "& .MuiBadge-badge": {
              boxShadow: "0 0 0 2px #fff",
              fontWeight: "bold",
              fontSize: 13,
            },
          }}
        >
          <NotificationsNoneOutlinedIcon
            onClick={handleToggle}
            style={{
              cursor: "pointer",
              fontSize: 30,
              color: open ? "#1976d2" : "#222",
              filter: open
                ? "drop-shadow(0 2px 8px #1976d255)"
                : "drop-shadow(0 1px 2px #0001)",
              transition: "color 0.2s, filter 0.2s",
            }}
          />
        </Badge>
      </motion.div>
      <AnimatePresence>
        {open && (
          <ClickAwayListener onClickAway={handleClickAway}>
            <motion.div
              initial={{ opacity: 0, y: -16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              style={{
                position: "absolute",
                right: 0,
                top: 38,
                zIndex: 1300,
                minWidth: 340,
                maxWidth: 400,
                maxHeight: 420,
                borderRadius: 16,
                boxShadow:
                  "0 8px 32px 0 rgba(60,60,120,0.18), 0 1.5px 8px 0 rgba(0,0,0,0.08)",
                overflow: "hidden",
                background: "rgba(255,255,255,0.98)",
                backdropFilter: "blur(2px)",
              }}
            >
              <Paper
                elevation={0}
                style={{ background: "transparent", boxShadow: "none" }}
              >
                <div
                  style={{
                    padding: "14px 20px 8px 20px",
                    borderBottom: "1px solid #e3e6ee",
                    background:
                      "linear-gradient(90deg,#f8fafc 60%,#f1f5fb 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span
                    style={{
                      fontWeight: 700,
                      fontSize: 18,
                      color: "#222",
                    }}
                  >
                    Notifiche
                  </span>
                  {notifications.length > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      disabled={loading}
                      style={{
                        fontSize: 13,
                        background: "none",
                        border: "none",
                        color: loading ? "#aaa" : "#1976d2",
                        cursor: loading ? "not-allowed" : "pointer",
                        fontWeight: 600,
                        padding: "2px 8px",
                        borderRadius: 6,
                        transition: "color 0.2s",
                      }}
                      title="Segna tutte come lette"
                    >
                      Segna tutte come lette
                    </button>
                  )}
                </div>
                {/* Scrollable notifications list */}
                <div
                  style={{
                    maxHeight: 320,
                    overflowY: "auto",
                    overflowX: "hidden",
                  }}
                >
                  <List dense sx={{ py: 0 }}>
                    {notifications.length === 0 && (
                      <ListItem>
                        <ListItemText
                          primary="Nessuna notifica"
                          primaryTypographyProps={{
                            style: { color: "#888", fontStyle: "italic" },
                          }}
                        />
                      </ListItem>
                    )}
                    {notifications.map((notif, idx) => (
                      <NotificationItem
                        key={notif.id || idx}
                        notif={notif}
                        idx={idx}
                        isLast={idx === notifications.length - 1}
                      />
                    ))}
                  </List>
                </div>
              </Paper>
            </motion.div>
          </ClickAwayListener>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationTool;
