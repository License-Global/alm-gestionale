import { lazy, Suspense, memo } from "react";
import { Box, Grid, Typography, Skeleton, Grid2 } from "@mui/material";
import { motion } from "framer-motion";
import StatHeader from "../components/Widgets/StatHeader";
import AttivitaRecenti from "../components/Dashboard/AttivitaRecenti";
import useRealtimeOrderWithActivities from "../hooks/useRealTime";
import WidgetCard from "../components/Widgets/WidgetCard";
import {
  CardContent,
  Stack,
  Chip,
  Avatar,
  Divider,
  Tooltip,
  Box as MuiBox,
} from "@mui/material";
import {
  BarChart,
  AssignmentTurnedIn,
  AccessTime,
  PriorityHigh,
  Note,
  EventBusy,
  Group,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { fontWeight } from "@mui/system";

// Lazy load heavy components
const Timeline = lazy(() =>
  import("../components/Widgets/components/Timeline")
);

const MotionBox = motion(Box);

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.2,
      staggerChildren: 0.08,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 15,
    scale: 0.98,
    filter: "blur(2px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

const titleVariants = {
  hidden: {
    opacity: 0,
    x: -20,
    filter: "blur(1px)",
  },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
      type: "spring",
      stiffness: 120,
      damping: 20,
    },
  },
};

const skeletonVariants = {
  hidden: {
    opacity: 0,
    scale: 0.96,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
      type: "spring",
      stiffness: 150,
      damping: 25,
    },
  },
};

const DashboardPage = memo(() => {
  const navigate = useNavigate();
  const orders = useRealtimeOrderWithActivities("orders", "activities");

  if (!orders) {
    return (
      <MotionBox
        sx={{ p: { xs: 2, md: 3 } }}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={skeletonVariants}>
          <Skeleton variant="text" width="40%" height={60} sx={{ mb: 2 }} />
        </motion.div>
        <Grid container spacing={{ xs: 1, md: 2 }}>
          {[...Array(8)].map((_, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <motion.div variants={skeletonVariants}>
                <Skeleton
                  variant="rectangular"
                  height={200}
                  sx={{ borderRadius: 2 }}
                />
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </MotionBox>
    );
  }

  return (
    <MotionBox
      sx={{ p: { xs: 2, md: 3 } }}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div
        variants={titleVariants}
        whileHover={{
          scale: 1.02,
          transition: { duration: 0.3, ease: "easeOut" },
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          fontWeight={700}
          sx={{
            fontSize: { xs: "1.75rem", md: "2.125rem" },
            mb: { xs: 2, md: 3 },
          }}
        >
          Bentornato, Utente! 👋
        </Typography>
      </motion.div>

      <motion.div
        variants={itemVariants}
        whileHover={{
          y: -2,
          transition: { duration: 0.2, ease: "easeOut" },
        }}
      >
        <Box sx={{ mb: 3 }}>
          <StatHeader orders={orders} />
        </Box>
      </motion.div>

      <motion.div
        variants={itemVariants}
        whileHover={{
          y: -2,
          transition: { duration: 0.2, ease: "easeOut" },
        }}
      >
        <Box sx={{ mb: 3 }}>
          <WidgetCard title="Attività Recenti">
            <AttivitaRecenti />
          </WidgetCard>
        </Box>
      </motion.div>

      <Suspense
        fallback={
          <motion.div variants={itemVariants}>
            <Skeleton
              variant="rectangular"
              height={300}
              sx={{ borderRadius: 2, mb: 3 }}
            />
          </motion.div>
        }
      >
        <motion.div
          variants={itemVariants}
          whileHover={{
            y: -2,
            transition: { duration: 0.2, ease: "easeOut" },
          }}
        >
          <Box sx={{ mb: 2 }}>
            <WidgetCard title={"Timeline Attività"}>
              <Timeline orders={orders} />
            </WidgetCard>
          </Box>
        </motion.div>
      </Suspense>
      {/* secondary widgets */}
      <Grid
        container
        spacing={{ xs: 1, md: 2 }}
        sx={{ justifyContent: "center" }}
      >
        {/* <Grid item xs={12} sm={6} md={4}>
          <WidgetCard
            title={
              <Stack direction="row" alignItems="center" spacing={1}>
                <BarChart color="primary" />
                <span>Statistiche Ordini</span>
              </Stack>
            }
            sx={{
              width: { xs: "100%", md: "calc(50% - 16px)" },
              bgcolor: "#e3e8f0", // blu-grigio più saturo
              minHeight: 170,
            }}
          >
            <CardContent>
              <Typography variant="body1" color="text.primary">
                Le statistiche degli ordini sono in fase di sviluppo.
              </Typography>
            </CardContent>
          </WidgetCard>
        </Grid> */}
        <Grid item xs={12} sm={6} md={4}>
          <WidgetCard
            title={
              <Stack direction="row" alignItems="center" spacing={1}>
                <AssignmentTurnedIn sx={{ color: "#388e3c" }} />
                <span>Stato attività ordini</span>
              </Stack>
            }
            sx={{
              width: { xs: "100%", md: "calc(50% - 16px)" },
              bgcolor: "#e6f4ea", // verde più saturo
              minHeight: 170,
            }}
          >
            <CardContent>
              <Stack spacing={1}>
                {Object.entries(
                  orders.reduce((acc, order) => {
                    order.activities.forEach((activity) => {
                      acc[activity.status] = (acc[activity.status] || 0) + 1;
                    });
                    return acc;
                  }, {})
                ).map(([status, count]) => (
                  <Chip
                    key={status}
                    label={`${status}: ${count}`}
                    variant="filled"
                    sx={{
                      fontWeight: 900,
                      color: "#fff",
                      bgcolor:
                        status === "Completato"
                          ? "#388e3c" // Verde
                          : status === "In corso"
                          ? "#1976d2" // Blu
                          : status === "Standby"
                          ? "#fbc02d" // Giallo
                          : status === "Bloccato"
                          ? "#d32f2f" // Rosso
                          : "#757575", // Grigio per stati non definiti
                    }}
                  />
                ))}
              </Stack>
            </CardContent>
          </WidgetCard>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <WidgetCard
            title={
              <Stack direction="row" alignItems="center" spacing={1}>
                <AccessTime sx={{ color: "#f57c00" }} />
                <span>Ordini in scadenza (24h)</span>
              </Stack>
            }
            sx={{
              width: { xs: "100%", md: "calc(50% - 16px)" },
              bgcolor: "#fff3e0", // arancio chiaro più saturo
              minHeight: 170,
            }}
          >
            <CardContent>
              <Stack spacing={1}>
                {(() => {
                  const ordersExpiring = orders.filter((order) => {
                    if (!order.endDate) return false;

                    try {
                      const endDate = new Date(order.endDate);
                      const now = new Date();

                      // Verifica che la data sia valida
                      if (isNaN(endDate.getTime())) return false;

                      const diffHours = (endDate - now) / (1000 * 60 * 60);
                      return diffHours > 0 && diffHours <= 24;
                    } catch (error) {
                      console.warn(
                        "Errore nel parsing della data:",
                        order.endDate,
                        error
                      );
                      return false;
                    }
                  });

                  return ordersExpiring.length > 0 ? (
                    ordersExpiring.map((order) => (
                      <Chip
                        key={order.id}
                        avatar={<AccessTime fontSize="small" />}
                        label={`${order.internal_id || order.id} - ${
                          order.orderName || "Nome non disponibile"
                        }`}
                        color="warning"
                        variant="filled"
                        sx={{fontWeight: 800, bgcolor: "#fbc02d", color: "#fff" }}
                        onClick={() => navigate(`/${order.id}`)}
                      />
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Nessun ordine in scadenza nelle prossime 24h.
                    </Typography>
                  );
                })()}
              </Stack>
            </CardContent>
          </WidgetCard>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <WidgetCard
            title={
              <Stack direction="row" alignItems="center" spacing={1}>
                <PriorityHigh sx={{ color: "#d32f2f" }} />
                <span>Distribuzione urgenza</span>
              </Stack>
            }
            sx={{
              width: { xs: "100%", md: "calc(50% - 16px)" },
              bgcolor: "#ffebee", // rosso chiaro più saturo
              minHeight: 170,
            }}
          >
            <CardContent>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {Object.entries(
                  orders.reduce((acc, order) => {
                    acc[order.urgency] = (acc[order.urgency] || 0) + 1;
                    return acc;
                  }, {})
                ).map(([urgency, count]) => (
                  <Chip
                    key={urgency}
                    label={`${urgency}: ${count}`}
                    icon={<PriorityHigh />}
                    variant="filled"
                    sx={{
                      fontWeight: 800,
                      
                      color: "#fff",
                      bgcolor:
                        urgency === "Alta"
                          ? "#fbc02d" // Rosso
                          : urgency === "Media"
                          ? "#1976d2" // Blu
                          : urgency === "Bassa"
                          ? "#388e3c" // Verde
                          : "#d32f2f", // Grigio per urgenze non definite
                          
                    }}
                  />
                ))}
              </Stack>
            </CardContent>
          </WidgetCard>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <WidgetCard
            title={
              <Stack direction="row" alignItems="center" spacing={1}>
                <Note sx={{ color: "#1976d2" }} />
                <span>Ordini con più note</span>
              </Stack>
            }
            sx={{
              width: { xs: "100%", md: "calc(50% - 16px)" },
              bgcolor: "#e3f2fd", // blu chiaro più saturo
              minHeight: 170,
            }}
          >
            <CardContent>
              <Stack spacing={1}>
                {[...orders]
                  .map((order) => ({
                    ...order,
                    noteCount: order.activities.reduce(
                      (sum, act) => sum + act.note.length,
                      0
                    ),
                  }))
                  .sort((a, b) => b.noteCount - a.noteCount)
                  .slice(0, 3)
                  .map((order) => (
                    <Chip
                    
                      key={order.id}
                      label={`${order.internal_id} - ${order.noteCount} note`}
                      color="info"
                      variant="filled"
                      sx={{ fontWeight: 800, bgcolor: "#1976d2", color: "#fff" }}
                    />
                  ))}
                {[...orders]
                  .map((order) => ({
                    ...order,
                    noteCount: order.activities.reduce(
                      (sum, act) => sum + act.note.length,
                      0
                    ),
                  }))
                  .sort((a, b) => b.noteCount - a.noteCount)
                  .slice(0, 3).length === 0 && (
                  <Typography variant="body2" color="text.secondary">
                    Nessuna nota presente.
                  </Typography>
                )}
              </Stack>
            </CardContent>
          </WidgetCard>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <WidgetCard
            title={
              <Stack direction="row" alignItems="center" spacing={1}>
                <EventBusy sx={{ color: "#1565c0" }} />
                <span>Attività non in calendario</span>
              </Stack>
            }
            sx={{
              width: { xs: "100%", md: "calc(50% - 16px)" },
              bgcolor: "#ede7f6", // viola chiaro più saturo
              minHeight: 170,
            }}
          >
            <CardContent>
              <Stack spacing={1}>
                {orders
                  .flatMap((order) => order.activities)
                  .filter((act) => !act.inCalendar)
                  .map((act) => (
                    <Tooltip title="Vai all'ordine" key={act.id}>
                      <Chip
                        label={`${act.name} - ${act.status}`}
                        color="secondary"
                        variant="filled"
                        onClick={() => navigate(`/${act.order_id}`)}
                        sx={{
                          cursor: "pointer",
                          fontWeight: 500,
                          bgcolor: "#1565c0",
                          color: "#fff",
                        }}
                      />
                    </Tooltip>
                  ))}
                {orders
                  .flatMap((order) => order.activities)
                  .filter((act) => !act.inCalendar).length === 0 && (
                  <Typography variant="body2" color="text.secondary">
                    Tutte le attività sono in calendario.
                  </Typography>
                )}
              </Stack>
            </CardContent>
          </WidgetCard>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <WidgetCard
            title={
              <Stack direction="row" alignItems="center" spacing={1}>
                <Group sx={{ color: "#1565c0" }} />
                <span>Attività per responsabile</span>
              </Stack>
            }
            sx={{
              width: { xs: "100%", md: "calc(50% - 16px)" },
              bgcolor: "#e3f6fd", // azzurro-verde chiaro più saturo
              minHeight: 170,
            }}
          >
            <CardContent>
              <Stack spacing={1}>
                {Object.entries(
                  orders
                    .flatMap((order) => order.activities)
                    .reduce((acc, act) => {
                      acc[act.responsible] = (acc[act.responsible] || 0) + 1;
                      return acc;
                    }, {})
                ).map(([resp, count]) => (
                  <Chip
                    key={resp}
                    avatar={
                      <Avatar sx={{ bgcolor: "#1565c0", color: "#fff" }}>
                        <Group fontSize="small" />
                      </Avatar>
                    }
                    label={`Responsabile ${resp}: ${count} attività`}
                    color="primary"
                    variant="filled"
                    sx={{ bgcolor: "#1565c0", color: "#fff" }}
                  />
                ))}
              </Stack>
            </CardContent>
          </WidgetCard>
        </Grid>
      </Grid>
    </MotionBox>
  );
});

DashboardPage.displayName = "DashboardPage";

export default DashboardPage;
