import React from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  Badge,
  Chip,
  Divider,
  Stack,
  Avatar,
  useTheme,
} from "@mui/material";
import {
  Refresh as RefreshIcon,
  MoreVert as MoreIcon,
  Build as CommessaIcon,
  ErrorOutline as WarningIcon,
  Notifications as NotificationsIcon,
  MailOutline as MailIcon,
  People as PeopleIcon,
  Build as BuildIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import WidgetCard from "../components/Widgets/WidgetCard";
import StatHeader from "../components/Widgets/StatHeader";

const MotionCard = motion(Card);

export default function DashboardPage() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight={700}>
        Bentornato, Utente! 👋
      </Typography>
      <StatHeader />
      <Grid container spacing={2} sx={{ justifyContent: "center" }}>
        <Grid item xs={12} md={4}>
          <MotionCard elevation={3} sx={{ borderRadius: 4, height: "100%" }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Statistiche del giorno
              </Typography>
              <Grid container spacing={2}>
                {[
                  { label: "Nuove richieste", value: 15 },
                  { label: "Risolte", value: 12, color: "success.main" },
                  { label: "In attesa", value: 3, color: "warning.main" },
                  { label: "Rifiutate", value: 1, color: "error.main" },
                ].map((stat, i) => (
                  <Grid item xs={6} key={i}>
                    <Typography variant="caption" color="text.secondary">
                      {stat.label}
                    </Typography>
                    <Typography
                      variant="h5"
                      color={stat.color || "text.primary"}
                    >
                      {stat.value}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </MotionCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <MotionCard elevation={3} sx={{ borderRadius: 4, height: "100%" }}>
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <CommessaIcon color="primary" />
                  <Typography variant="subtitle1" fontWeight={600}>
                    Stato Commesse
                  </Typography>
                </Stack>
                <IconButton size="small">
                  <MoreIcon fontSize="small" />
                </IconButton>
              </Stack>
              <Divider sx={{ my: 1.5 }} />
              <Stack spacing={1}>
                <Chip label="5 Aperte" color="info" variant="outlined" />
                <Chip
                  label="2 In lavorazione"
                  color="warning"
                  variant="outlined"
                />
                <Chip
                  label="12 Completate"
                  color="success"
                  variant="outlined"
                />
              </Stack>
            </CardContent>
          </MotionCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <MotionCard elevation={3} sx={{ borderRadius: 4, height: "100%" }}>
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <Badge badgeContent={3} color="primary">
                    <NotificationsIcon color="action" />
                  </Badge>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Notifiche
                  </Typography>
                </Stack>
                <IconButton size="small">
                  <MoreIcon fontSize="small" />
                </IconButton>
              </Stack>
              <Divider sx={{ my: 1.5 }} />
              <Typography variant="body2">
                • Nuova richiesta di supporto
              </Typography>
              <Typography variant="body2">
                • Report giornaliero disponibile
              </Typography>
              <Typography variant="body2">
                • Password cambiata con successo
              </Typography>
            </CardContent>
          </MotionCard>
        </Grid>

        <Grid item xs={12} md={3}>
          <MotionCard elevation={3} sx={{ borderRadius: 4, height: "100%" }}>
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <WarningIcon color="error" />
                  <Typography variant="subtitle1" fontWeight={600}>
                    Avvisi
                  </Typography>
                </Stack>
                <IconButton size="small">
                  <RefreshIcon fontSize="small" />
                </IconButton>
              </Stack>
              <Divider sx={{ my: 1.5 }} />
              <Typography variant="body2" color="text.secondary">
                • Backup non eseguito oggi <br />
                • Spazio su disco al 92% <br />• 1 aggiornamento disponibile
              </Typography>
            </CardContent>
          </MotionCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <MotionCard elevation={3} sx={{ borderRadius: 4, height: "100%" }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Prossimi Appuntamenti
              </Typography>
              <Divider sx={{ mb: 1 }} />
              {[
                {
                  ora: "10:00",
                  titolo: "Call Cliente A",
                  stato: "Confermato",
                  colore: "success",
                },
                {
                  ora: "12:30",
                  titolo: "Revisione documenti",
                  stato: "Da confermare",
                  colore: "warning",
                },
                {
                  ora: "15:00",
                  titolo: "Demo Prodotto",
                  stato: "Annullato",
                  colore: "error",
                },
              ].map((item, i) => (
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
              ))}
            </CardContent>
          </MotionCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <MotionCard elevation={3} sx={{ borderRadius: 4, height: "100%" }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                File Recenti
              </Typography>
              <Divider sx={{ mb: 1 }} />
              {[
                { nome: "contratto_clienteA.pdf", data: "10 Mag" },
                { nome: "progetto_v2.xlsx", data: "9 Mag" },
                { nome: "offerta.docx", data: "7 Mag" },
              ].map((file, i) => (
                <Stack
                  key={i}
                  direction="row"
                  justifyContent="space-between"
                  sx={{ mb: 1 }}
                >
                  <Typography variant="body2" noWrap sx={{ maxWidth: "70%" }}>
                    {file.nome}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {file.data}
                  </Typography>
                </Stack>
              ))}
            </CardContent>
          </MotionCard>
        </Grid>

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
                  <Typography variant="subtitle1" fontWeight={600}>
                    Messaggi
                  </Typography>
                </Stack>
                <IconButton size="small">
                  <MoreIcon fontSize="small" />
                </IconButton>
              </Stack>
              <Divider sx={{ mb: 1.5 }} />
              {[
                { nome: "Alessio", messaggio: "Conferma ricevuta" },
                { nome: "Luca", messaggio: "Richiesta modifiche..." },
                { nome: "Marco", messaggio: "Hai tempo per una call?" },
              ].map((msg, i) => (
                <Stack
                  key={i}
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  mb={1}
                >
                  <Avatar sx={{ width: 24, height: 24 }}>{msg.nome[0]}</Avatar>
                  <Typography variant="body2">
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
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Checklist Giornaliera
              </Typography>
              <Divider sx={{ mb: 1 }} />
              {[
                { testo: "Controllare le mail", done: true },
                { testo: "Aggiornare la reportistica", done: false },
                { testo: "Inviare preventivi", done: false },
              ].map((task, i) => (
                <Typography
                  key={i}
                  variant="body2"
                  sx={{
                    textDecoration: task.done ? "line-through" : "none",
                    color: task.done ? "text.disabled" : "text.primary",
                    mb: 0.5,
                  }}
                >
                  {task.done ? "✅" : "⬜️"} {task.testo}
                </Typography>
              ))}
            </CardContent>
          </MotionCard>
        </Grid>
      </Grid>
    </Box>
  );
}
