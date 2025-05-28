import { lazy, Suspense, memo } from "react";
import { Box, Grid, Typography, Skeleton } from "@mui/material";
import { motion } from "framer-motion";
import StatHeader from "../components/Widgets/StatHeader";
import AttivitaRecenti from "../components/Dashboard/AttivitaRecenti";
import useRealtimeOrderWithActivities from "../hooks/useRealTime";
import WidgetCard from "../components/Widgets/WidgetCard";

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

      {/* <Grid
        container
        spacing={{ xs: 1, md: 2 }}
        sx={{ justifyContent: "center" }}
      >
        {" "}
        <Grid item xs={12} sm={6} md={4}>
          <MotionCard elevation={3} sx={{ borderRadius: 4, height: "100%" }}>
            <CardContent>
              <Typography
                variant="subtitle1"
                fontWeight={600}
                gutterBottom
                sx={{ fontSize: { xs: "1rem", md: "1.1rem" } }}
              >
                Statistiche del giorno
              </Typography>
              <Grid container spacing={2}>
                {[
                  {
                    label: "Nuove richieste",
                    value: dashboardStats.dailyStats.new,
                  },
                  {
                    label: "Risolte",
                    value: dashboardStats.dailyStats.resolved,
                    color: "success.main",
                  },
                  {
                    label: "In attesa",
                    value: dashboardStats.dailyStats.pending,
                    color: "warning.main",
                  },
                  {
                    label: "Rifiutate",
                    value: dashboardStats.dailyStats.rejected,
                    color: "error.main",
                  },
                ].map((stat, i) => (
                  <Grid item xs={6} key={i}>
                    <Typography variant="caption" color="text.secondary">
                      {stat.label}
                    </Typography>
                    <Typography
                      variant="h5"
                      color={stat.color || "text.primary"}
                      sx={{ fontSize: { xs: "1.25rem", md: "1.5rem" } }}
                    >
                      {stat.value}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </MotionCard>
        </Grid>{" "}
        <Grid item xs={12} sm={6} md={4}>
          <DashboardCard
            title="Stato Commesse"
            icon={<CommessaIcon color="primary" />}
            onMoreClick={handleMoreClick}
          >
            <Stack spacing={1}>
              <Chip
                label={`${dashboardStats.orderStatus.open} Aperte`}
                color="info"
                variant="outlined"
              />
              <Chip
                label={`${dashboardStats.orderStatus.inProgress} In lavorazione`}
                color="warning"
                variant="outlined"
              />
              <Chip
                label={`${dashboardStats.orderStatus.completed} Completate`}
                color="success"
                variant="outlined"
              />
            </Stack>
          </DashboardCard>
        </Grid>{" "}
        <Grid item xs={12} sm={6} md={4}>
          <MotionCard elevation={3} sx={{ borderRadius: 4, height: "100%" }}>
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <Badge
                    badgeContent={dashboardStats.notifications}
                    color="primary"
                  >
                    <NotificationsIcon color="action" />
                  </Badge>
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    sx={{ fontSize: { xs: "1rem", md: "1.1rem" } }}
                  >
                    Notifiche
                  </Typography>
                </Stack>
                <IconButton size="small">
                  <MoreIcon fontSize="small" />
                </IconButton>
              </Stack>
              <Divider sx={{ my: 1.5 }} />
              <Typography
                variant="body2"
                sx={{ fontSize: { xs: "0.8rem", md: "0.875rem" } }}
              >
                • Nuova richiesta di supporto
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontSize: { xs: "0.8rem", md: "0.875rem" } }}
              >
                • Report giornaliero disponibile
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontSize: { xs: "0.8rem", md: "0.875rem" } }}
              >
                • Password cambiata con successo
              </Typography>
            </CardContent>
          </MotionCard>
        </Grid>{" "}
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Avvisi"
            icon={<WarningIcon color="error" />}
            onMoreClick={handleRefresh}
          >
            <Typography variant="body2" color="text.secondary">
              {dashboardStats.warnings.map((warning, i) => (
                <span key={i}>
                  • {warning}
                  <br />
                </span>
              ))}
              {dashboardStats.warnings.length === 0 && "• Nessun avviso"}
            </Typography>
          </DashboardCard>
        </Grid>{" "}
        <Grid item xs={12} sm={6} md={4}>
          <MotionCard elevation={3} sx={{ borderRadius: 4, height: "100%" }}>
            <CardContent>
              <Typography
                variant="subtitle1"
                fontWeight={600}
                gutterBottom
                sx={{ fontSize: { xs: "1rem", md: "1.1rem" } }}
              >
                Prossimi Appuntamenti
              </Typography>
              <Divider sx={{ mb: 1 }} />
              {dashboardStats.upcomingAppointments.length > 0 ? (
                dashboardStats.upcomingAppointments.map((item, i) => (
                  <Box key={i} sx={{ mb: 1 }}>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {item.ora} - {item.titolo}
                    </Typography>
                    <Chip
                      label={item.stato}
                      size="small"
                      color={item.colore}
                      variant="outlined"
                    />
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Nessun appuntamento programmato
                </Typography>
              )}
            </CardContent>
          </MotionCard>
        </Grid>{" "}
        <Grid item xs={12} sm={6} md={4}>
          <MotionCard elevation={3} sx={{ borderRadius: 4, height: "100%" }}>
            <CardContent>
              <Typography
                variant="subtitle1"
                fontWeight={600}
                gutterBottom
                sx={{ fontSize: { xs: "1rem", md: "1.1rem" } }}
              >
                File Recenti
              </Typography>
              <Divider sx={{ mb: 1 }} />
              {dashboardStats.recentFiles.map((file, i) => (
                <Stack
                  key={i}
                  direction="row"
                  justifyContent="space-between"
                  sx={{ mb: 1 }}
                >
                  <Typography
                    variant="body2"
                    noWrap
                    sx={{
                      maxWidth: "70%",
                      fontSize: { xs: "0.8rem", md: "0.875rem" },
                    }}
                  >
                    {file.nome}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontSize: { xs: "0.7rem", md: "0.75rem" } }}
                  >
                    {file.data}
                  </Typography>
                </Stack>
              ))}
            </CardContent>
          </MotionCard>
        </Grid>{" "}
        <Grid item xs={12} md={6}>
          <MotionCard elevation={3} sx={{ borderRadius: 4, height: "100%" }}>
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={1}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <MailIcon color="secondary" />
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    sx={{ fontSize: { xs: "1rem", md: "1.1rem" } }}
                  >
                    Messaggi
                  </Typography>
                </Stack>
                <IconButton size="small">
                  <MoreIcon fontSize="small" />
                </IconButton>
              </Stack>
              <Divider sx={{ mb: 1.5 }} />
              {dashboardStats.messages.map((msg, i) => (
                <Stack
                  key={i}
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  mb={1}
                >
                  <Avatar sx={{ width: 24, height: 24 }}>{msg.nome[0]}</Avatar>
                  <Typography
                    variant="body2"
                    sx={{ fontSize: { xs: "0.8rem", md: "0.875rem" } }}
                  >
                    {msg.nome}: "{msg.messaggio}"
                  </Typography>
                </Stack>
              ))}
            </CardContent>
          </MotionCard>
        </Grid>
        <Grid item xs={12} md={6}>
          <MotionCard elevation={3} sx={{ borderRadius: 4, height: "100%" }}>
            <CardContent>
              {" "}
              <Typography
                variant="subtitle1"
                fontWeight={600}
                gutterBottom
                sx={{ fontSize: { xs: "1rem", md: "1.1rem" } }}
              >
                Checklist Giornaliera
              </Typography>
              <Divider sx={{ mb: 1 }} />
              {dashboardStats.todos.map((task, i) => (
                <Typography
                  key={i}
                  variant="body2"
                  sx={{
                    textDecoration: task.done ? "line-through" : "none",
                    color: task.done ? "text.disabled" : "text.primary",
                    mb: 0.5,
                    fontSize: { xs: "0.8rem", md: "0.875rem" },
                  }}
                >
                  {task.done ? "✅" : "⬜️"} {task.testo}
                </Typography>
              ))}
            </CardContent>
          </MotionCard>
        </Grid>
      </Grid> */}
    </MotionBox>
  );
});

DashboardPage.displayName = "DashboardPage";

export default DashboardPage;
