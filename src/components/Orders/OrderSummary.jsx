import React, { useRef } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Divider,
  LinearProgress,
  Avatar,
  Paper,
} from "@mui/material";
import { styled } from "@mui/system";
import {
  AccessTime,
  Assignment,
  CalendarToday,
  Person,
  Inventory,
  Build,
  Flag,
} from "@mui/icons-material";
import { useReactToPrint } from "react-to-print";

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: "90vw",
  margin: "auto",
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
  borderRadius: "16px",
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
  background: "linear-gradient(145deg, #ffffff, #f0f0f0)",
  "@media print": {
    boxShadow: "none",
    background: "none",
  },
}));

const HeaderBox = styled(Box)(({ theme }) => ({
  background: "linear-gradient(90deg, #2196f3, #21cbf3)",
  color: "white",
  padding: theme.spacing(3),
  borderTopLeftRadius: "16px",
  borderTopRightRadius: "16px",
  "@media print": {
    background: "none",
    color: "black",
    borderBottom: "2px solid #2196f3",
  },
}));

const ColoredChip = styled(Chip)(({ urgencycolor }) => ({
  backgroundColor: urgencycolor,
  color: "#fff",
  fontWeight: "bold",
  padding: "16px 12px",
  fontSize: "1rem",
  "@media print": {
    border: `2px solid ${urgencycolor}`,
    color: "black",
    backgroundColor: "transparent",
  },
}));

const InfoBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginBottom: theme.spacing(3),
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  marginRight: theme.spacing(2),
  color: theme.palette.primary.main,
  fontSize: "2rem",
}));

const ActivityPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: "12px",
  boxShadow: "0 3px 10px rgba(0, 0, 0, 0.08)",
  "@media print": {
    boxShadow: "none",
    border: "1px solid #e0e0e0",
    pageBreakInside: "avoid",
  },
}));

const ActivityHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: theme.spacing(2),
}));

const ActivityProgress = styled(LinearProgress)(({ theme }) => ({
  height: 12,
  borderRadius: 6,
  backgroundColor: theme.palette.grey[200],
  "& .MuiLinearProgress-bar": {
    borderRadius: 6,
  },
}));

const urgencyColors = {
  Bassa: "#4caf50",
  Media: "#ff9800",
  Alta: "#f44336",
};

// Dati di esempio basati sullo schema del CSV
const orderData = {
  id: "65",
  created_at: "2024-12-09 22:19:12.433969+00",
  startDate: "2024-12-11 19:15:04.112+00",
  isConfirmed: "false",
  orderName: "Prova scorrimento",
  materialShelf: "A48",
  accessories: "A12",
  internal_id: "2024/0065",
  urgency: "Bassa",
  orderManager: "Tizio",
  activities: JSON.stringify([
    {
      name: "Scorre",
      color: "#eb144c",
      status: "Standby",
      responsible: "Mario",
      startDate: "2024-12-10T20:45:04.158Z",
      endDate: "2024-12-10T20:45:04.158Z",
    },
    {
      name: "Giu",
      color: "#9900ef",
      status: "Standby",
      responsible: "Tizio",
      startDate: "2024-12-10T16:20:04.158Z",
      endDate: "2024-12-10T17:25:04.158Z",
    },
    {
      name: "Sotto",
      color: "#00d084",
      status: "Standby",
      responsible: "Mario",
      startDate: "2024-12-10T20:10:04.158Z",
      endDate: "2024-12-12T22:10:04.158Z",
    },
    {
      name: "Basso",
      color: "#0693e3",
      status: "Standby",
      responsible: "Caio",
      startDate: "2024-12-10T18:15:04.158Z",
      endDate: "2024-12-10T22:10:04.158Z",
    },
  ]),
  endDate: "2024-12-12 19:10:04.112+00",
  isArchived: "true",
};

export default function OrderSummary() {
  const activities = JSON.parse(orderData.activities);
  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  return (
    <StyledCard>
      <button
        onClick={() => reactToPrintFn()}
        style={{
          display: "block", // Mostra normalmente
          marginTop: "20px",
          "@media print": { display: "none" }, // Nascondi durante la stampa
        }}
      >
        Stampa
      </button>
      <div ref={contentRef}>
        <HeaderBox>
          <Typography variant="h4" gutterBottom>
            Riepilogo Commessa
          </Typography>
          <Typography variant="h5">{orderData.orderName}</Typography>
        </HeaderBox>
        <CardContent>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <InfoBox>
                <IconWrapper>
                  <Assignment fontSize="inherit" />
                </IconWrapper>
                <Box>
                  <Typography variant="subtitle1" color="textSecondary">
                    ID Commessa
                  </Typography>
                  <Typography variant="h6">{orderData.internal_id}</Typography>
                </Box>
              </InfoBox>
              <InfoBox>
                <IconWrapper>
                  <CalendarToday fontSize="inherit" />
                </IconWrapper>
                <Box>
                  <Typography variant="subtitle1" color="textSecondary">
                    Data Inizio
                  </Typography>
                  <Typography variant="h6">
                    {new Date(orderData.startDate).toLocaleString()}
                  </Typography>
                </Box>
              </InfoBox>
              <InfoBox>
                <IconWrapper>
                  <AccessTime fontSize="inherit" />
                </IconWrapper>
                <Box>
                  <Typography variant="subtitle1" color="textSecondary">
                    Data Fine
                  </Typography>
                  <Typography variant="h6">
                    {new Date(orderData.endDate).toLocaleString()}
                  </Typography>
                </Box>
              </InfoBox>
            </Grid>
            <Grid item xs={12} md={6}>
              <InfoBox>
                <IconWrapper>
                  <Person fontSize="inherit" />
                </IconWrapper>
                <Box>
                  <Typography variant="subtitle1" color="textSecondary">
                    Responsabile Commessa
                  </Typography>
                  <Typography variant="h6">{orderData.orderManager}</Typography>
                </Box>
              </InfoBox>
              <InfoBox>
                <IconWrapper>
                  <Flag fontSize="inherit" />
                </IconWrapper>
                <Box>
                  <Typography variant="subtitle1" color="textSecondary">
                    Stato
                  </Typography>
                  <Typography variant="h6">
                    {orderData.isConfirmed === "true"
                      ? "Confermato"
                      : "Non Confermato"}
                  </Typography>
                </Box>
              </InfoBox>
              <Box mt={3}>
                <ColoredChip
                  label={`Urgenza: ${orderData.urgency}`}
                  urgencycolor={urgencyColors[orderData.urgency] || "#999"}
                  icon={<Flag style={{ fontSize: "1.5rem" }} />}
                />
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                <Inventory
                  fontSize="medium"
                  style={{ verticalAlign: "middle", marginRight: "8px" }}
                />
                Materiali
              </Typography>
              <InfoBox>
                <Typography variant="subtitle1" color="textSecondary">
                  Scaffale Materiali:
                </Typography>
                <Typography variant="body1" style={{ marginLeft: "8px" }}>
                  {orderData.materialShelf}
                </Typography>
              </InfoBox>
              <InfoBox>
                <Typography variant="subtitle1" color="textSecondary">
                  Accessori:
                </Typography>
                <Typography variant="body1" style={{ marginLeft: "8px" }}>
                  {orderData.accessories}
                </Typography>
              </InfoBox>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                <Build
                  fontSize="medium"
                  style={{ verticalAlign: "middle", marginRight: "8px" }}
                />
                Progresso Attività
              </Typography>
              <LinearProgress
                variant="determinate"
                value={70}
                sx={{ height: 12, borderRadius: 6, mb: 2 }}
              />
              <Typography variant="body1" color="textSecondary">
                70% Completato
              </Typography>
            </Grid>
          </Grid>

          <div style={{ pageBreakBefore: "always", breakBefore: "page" }}></div>
          <Divider sx={{ my: 4, "@media print": { visibility: "hidden" } }} />

          <Typography
            variant="h5"
            gutterBottom
            sx={{
              fontWeight: "bold",
              color: "#2196f3",
              mb: 3,
            }}
          >
            <Build
              fontSize="medium"
              style={{ verticalAlign: "middle", marginRight: "12px" }}
            />
            Attività della Commessa
          </Typography>

          {activities.map((activity, index) => (
            <ActivityPaper key={index} elevation={3}>
              <ActivityHeader>
                <Box display="flex" alignItems="center">
                  <Avatar
                    sx={{
                      bgcolor: activity.color,
                      width: 48,
                      height: 48,
                      fontSize: "1.25rem",
                      mr: 2,
                    }}
                  >
                    {" "}
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{activity.name}</Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                      Responsabile: {activity.responsible}
                    </Typography>
                  </Box>
                </Box>
                <Chip
                  label={activity.status}
                  color={
                    activity.status === "Completato" ? "success" : "default"
                  }
                  sx={{ fontSize: "0.9rem", padding: "16px 12px" }}
                />
              </ActivityHeader>
              <ActivityProgress
                variant="determinate"
                value={activity.status === "Completato" ? 100 : 50}
                sx={{ mb: 2 }}
              />
              <Typography variant="h6" color="textSecondary">
                {activity.status === "Completato" ? "Completato" : "In corso"}
              </Typography>
              <Box mt={2}>
                <Typography variant="body1">
                  <strong>Data Inizio:</strong>{" "}
                  {new Date(activity.startDate).toLocaleString()}
                </Typography>
                <Typography variant="body1">
                  <strong>Data Fine:</strong>{" "}
                  {new Date(activity.endDate).toLocaleString()}
                </Typography>
              </Box>
            </ActivityPaper>
          ))}
        </CardContent>
      </div>
    </StyledCard>
  );
}
