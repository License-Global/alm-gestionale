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
  Button,
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
  CheckCircle,
  Cancel,
} from "@mui/icons-material";

import { useReactToPrint } from "react-to-print";
import { useParams } from "react-router-dom";
import { useArchivedOrder } from "../../hooks/useArchivedOrder";
import { handleTargetLabel } from "../../utils/enums/timeManager";

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
  padding: theme.spacing(2),
  borderRadius: "8px",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  "@media print": {
    boxShadow: "none",
    border: "1px solid #e0e0e0",
    pageBreakInside: "avoid",
  },
}));

const urgencyColors = {
  Bassa: "#4caf50",
  Media: "#ff9800",
  Alta: "#f44336",
};

export default function OrderSummary() {
  const { id } = useParams();
  const { order } = useArchivedOrder(id);

  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  const activitiesProgress = (order) => {
    const completed = order.activities.filter(
      (activity) => activity.status === "Completato"
    );
    return (completed.length / order.activities.length) * 100;
  };

  return (
    order && (
      <StyledCard>
        <div ref={contentRef}>
          <HeaderBox>
            <Typography variant="h4" gutterBottom>
              Riepilogo Commessa
            </Typography>
            <Typography variant="h5">{order.orderName}</Typography>
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
                    <Typography variant="h6">{order.internal_id}</Typography>
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
                      {new Date(order.startDate).toLocaleString()}
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
                      {new Date(order.endDate).toLocaleString()}
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
                    <Typography variant="h6">{order.orderManager}</Typography>
                  </Box>
                </InfoBox>
                <InfoBox>
                  <IconWrapper>
                    <Flag fontSize="inherit" />
                  </IconWrapper>
                  <Box>
                    <Typography variant="subtitle1" color="textSecondary">
                      Confermato dal Cliente
                    </Typography>
                    <Typography variant="h6">
                      {order.isConfirmed === "true"
                        ? "Confermato"
                        : "Non Confermato"}
                    </Typography>
                  </Box>
                </InfoBox>
                <Box mt={3}>
                  <ColoredChip
                    label={`Urgenza: ${order.urgency}`}
                    urgencycolor={urgencyColors[order.urgency] || "#999"}
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
                    {order.materialShelf}
                  </Typography>
                </InfoBox>
                <InfoBox>
                  <Typography variant="subtitle1" color="textSecondary">
                    Accessori:
                  </Typography>
                  <Typography variant="body1" style={{ marginLeft: "8px" }}>
                    {order.accessories}
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
                  value={activitiesProgress(order)}
                  color={
                    activitiesProgress(order) === 100 ? "success" : "primary"
                  }
                  sx={{ height: 12, borderRadius: 6, mb: 2 }}
                />
                <Typography variant="body1" color="textSecondary">
                  {`${activitiesProgress(order)}% Completato`}
                </Typography>
              </Grid>
            </Grid>

            <div
              style={{ pageBreakBefore: "always", breakBefore: "page" }}
            ></div>
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

            <Grid container spacing={2}>
              {order.activities.map((activity, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <ActivityPaper elevation={3}>
                    <Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography
                          sx={{ display: "flex", gap: 2, alignItems: "center" }}
                          variant="h6"
                          noWrap
                        >
                          <Avatar
                            sx={{
                              bgcolor: activity.color,
                              width: 24,
                              height: 24,
                            }}
                          >
                            {" "}
                          </Avatar>
                          {activity.name}
                        </Typography>
                        {activity.status === "Completato" ? (
                          <CheckCircle fontSize="large" color="success" />
                        ) : (
                          <Cancel fontSize="large" color="error" />
                        )}
                      </Box>
                      <Typography variant="body2" color="textSecondary" noWrap>
                        Responsabile: <b>{activity.responsible}</b>
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 2,
                      }}
                      mt={1}
                    >
                      <Typography variant="body2">
                        <strong>Inizio:</strong>{" "}
                        {new Date(activity.startDate).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Fine:</strong>{" "}
                        {new Date(activity.endDate).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {handleTargetLabel(
                          activity.endDate,
                          activity.completed
                        )}
                      </Typography>
                    </Box>
                    <Box
                      mt={1}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    ></Box>
                  </ActivityPaper>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            textAlign: "center",
            gap: 8,
            marginBottom: 8,
            marginRight: 16,
          }}
        >
          <Button
            onClick={() => reactToPrintFn()}
            variant="contained"
            color="primary"
            style={{
              display: "block", // Mostra normalmente
              marginTop: "20px",
              "@media print": { display: "none" }, // Nascondi durante la stampa
            }}
          >
            Stampa
          </Button>
        </div>
      </StyledCard>
    )
  );
}
