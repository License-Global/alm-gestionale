import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Chip,
  Badge,
  IconButton,
  Stack,
  Tooltip,
  Divider,
  Avatar,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

const CommessaCard = ({ order, customers }) => {
  const navigate = useNavigate();

  const handleProgressPercentage = (activities) => {
    if (!Array.isArray(activities) || activities.length === 0) {
      return 0; // Restituisce 0 se non ci sono attività
    }

    const completedCount = activities.filter(
      (activity) => activity.status === "Completato"
    ).length;
    const percentage = (completedCount / activities.length) * 100;

    return Math.round(percentage); // Arrotonda la percentuale
  };
  const handleOrderPriorityHighlight = (priority) => {
    if (priority === "Urgente") {
      return "#f44336";
    } else if (priority === "Alta") {
      return "#ff9800";
    } else if (priority === "Media") {
      return "#ffc107";
    } else if (priority === "Bassa") {
      return "#8bc34a";
    }
  };

  // Calcola la percentuale di avanzamento
  const progress = handleProgressPercentage(order.activities);

  // Funzione per determinare il colore del led in base al progresso
  const getLedStatus = (order) => {
    const hasBlockedActivity = order?.activities.some(
      (activity) => activity.status === "Bloccato"
    );
    const allActivitiesInStandby = order?.activities.every(
      (activity) => activity.status === "Standby"
    );
    const hasInProgressActivity = order?.activities.some(
      (activity) => activity.status === "In corso"
    );

    if (hasBlockedActivity) return "red";
    if (allActivitiesInStandby) return "orange";
    if (hasInProgressActivity) return "green";
  };

  const ledStatus = getLedStatus(order);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{
        scale: 1.025,
        boxShadow: "0 16px 40px 0 rgba(31, 38, 135, 0.22)",
        transition: { duration: 0.25 },
      }}
      transition={{ duration: 0.4 }}
      style={{ borderRadius: 20 }}
    >
      <Card
        sx={{
          width: 420,
          borderRadius: 5,
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.18)",
          background: "linear-gradient(135deg, #f8fafc 0%, #e3e6ee 100%)",
          position: "relative",
          overflow: "hidden",
          border: "1px solid #e0e4ea",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            px: 3,
            py: 2,
            background: "linear-gradient(90deg, #4f8cff 0%, #6dd5ed 100%)",
            color: "#fff",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            boxShadow: "0 2px 8px 0 rgba(79,140,255,0.10)",
            position: "relative",
          }}
        >
          <Avatar
            onClick={() => navigate("/" + order.id)}
            sx={{
              bgcolor: "#fff",
              color: "#4f8cff",
              mr: 2,
              boxShadow: 2,
              width: 40,
              height: 40,
              cursor: "pointer",
              ":hover": {
                transform: "scale(1.1)",
                transition: "transform 0.2s",
              },
            }}
          >
            <AssignmentIcon fontSize="medium" />
          </Avatar>
          <Box flexGrow={1}>
            <Typography
              onClick={() => navigate("/" + order.id)}
              variant="h6"
              fontWeight="bold"
              sx={{
                letterSpacing: 1,
                ":hover": { cursor: "pointer", textDecoration: "underline" },
              }}
            >
              {order.orderName}
              <br />
              <span style={{ fontWeight: 500, opacity: 0.8 }}>
                # {order.internal_id}
              </span>
            </Typography>
            {/* <Typography variant="body2" sx={{ opacity: 0.85 }}>
              Gestione avanzata
            </Typography> */}
          </Box>
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 18,
              delay: 0.2,
            }}
            style={{ display: "flex", alignItems: "center" }}
          >
            <IconButton sx={{ color: "#fff" }}>
              <Badge
                badgeContent={1}
                color="error"
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                classes={{ badge: "pulse-badge" }}
              >
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </motion.div>
        </Box>

        <Divider sx={{ mb: 0, mt: 0 }} />

        <CardContent sx={{ pt: 2, pb: 3 }}>
          <Stack spacing={2}>
            {/* Info principali */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4, type: "spring" }}
            >
              <Stack
                direction="row"
                spacing={3}
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Cliente
                  </Typography>
                  <Link
                    style={{ textDecoration: "none" }}
                    to={`/clienti/${order.clientId}`}
                  >
                    <Typography
                      variant="body1"
                      fontWeight={500}
                      color="#4f8cff"
                      sx={{
                        "&:hover": {
                          textDecoration: "underline",
                          cursor: "pointer",
                        },
                      }}
                    >
                      {
                        customers.find((c) => c.id === order.clientId)
                          ?.customer_name
                      }
                    </Typography>
                  </Link>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Data fine
                  </Typography>
                  <Typography variant="body1" fontWeight={500} color="#4f8cff">
                    {new Date(order.endDate).toLocaleDateString("it-IT", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </Typography>
                </Box>
              </Stack>
            </motion.div>

            <Divider flexItem sx={{ my: 1 }} />

            {/* Avanzamento */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: 0.25, duration: 0.5, type: "spring" }}
              style={{ overflow: "hidden" }}
            >
              <Box>
                <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
                  <Typography variant="body2" color="text.secondary">
                    Avanzamento
                  </Typography>
                  <Chip
                    label={`${handleProgressPercentage(order.activities)}%`}
                    size="small"
                    sx={{
                      bgcolor: "#e3f2fd",
                      color: "#1976d2",
                      fontWeight: "bold",
                      fontSize: 13,
                    }}
                  />
                </Stack>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.35, duration: 0.7, type: "spring" }}
                  style={{ overflow: "hidden" }}
                >
                  <LinearProgress
                    variant="determinate"
                    value={handleProgressPercentage(order.activities)}
                    sx={{
                      height: 12,
                      borderRadius: 6,
                      backgroundColor: "#e0e0e0",
                      "& .MuiLinearProgress-bar": {
                        borderRadius: 6,
                        background:
                          "linear-gradient(90deg, #4f8cff 0%, #6dd5ed 100%)",
                      },
                    }}
                  />
                </motion.div>
              </Box>
            </motion.div>

            <Divider flexItem sx={{ my: 1 }} />

            {/* Priorità */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.55, duration: 0.3 }}
            >
              <Box display="flex" justifyContent="space-between">
                {/* Semaforo led */}
                <Stack
                  direction="row"
                  spacing={2}
                  mt={1}
                  alignItems="center"
                  justifyContent="center"
                >
                  <Tooltip title="Stato critico">
                    <Box
                      sx={{
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        bgcolor: ledStatus === "red" ? "red" : "#f2bcbc",
                        boxShadow:
                          ledStatus === "red"
                            ? "0 0 8px 2px #ff1744"
                            : "0 0 0 2px #fff",
                        border: "2px solid #fff",
                        transition: "box-shadow 0.2s, background 0.2s",
                      }}
                    />
                  </Tooltip>
                  <Tooltip title="Attenzione">
                    <Box
                      sx={{
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        bgcolor: ledStatus === "orange" ? "orange" : "#ffe0b2",
                        boxShadow:
                          ledStatus === "orange"
                            ? "0 0 8px 2px #ff9800"
                            : "0 0 0 2px #fff",
                        border: "2px solid #fff",
                        transition: "box-shadow 0.2s, background 0.2s",
                      }}
                    />
                  </Tooltip>
                  <Tooltip title="OK">
                    <Box
                      sx={{
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        bgcolor: ledStatus === "green" ? "green" : "#b9f6ca",
                        boxShadow:
                          ledStatus === "green"
                            ? "0 0 8px 2px #00e676"
                            : "0 0 0 2px #fff",
                        border: "2px solid #fff",
                        transition: "box-shadow 0.2s, background 0.2s",
                      }}
                    />
                  </Tooltip>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="body2" color="text.secondary">
                    Priorità:
                  </Typography>
                  <Chip
                    label={order.urgency}
                    size="small"
                    sx={{
                      fontWeight: "bold",
                      backgroundColor: handleOrderPriorityHighlight(
                        order?.urgency
                      ),
                      borderRadius: 2,
                      fontSize: 14,
                      px: 1.5,
                      boxShadow: "0 1px 4px 0 rgba(0,0,0,0.08)",
                    }}
                  />
                </Stack>
              </Box>
            </motion.div>
          </Stack>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CommessaCard;

/* Aggiungi questo CSS nel tuo file globale (es. index.css o App.css):
.pulse-badge {
  animation: pulseBadge 1.2s infinite alternate;
}
@keyframes pulseBadge {
  0% { transform: scale(1);}
  100% { transform: scale(1.18);}
}
*/
