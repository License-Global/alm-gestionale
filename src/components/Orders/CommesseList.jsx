import React from "react";
import {
  Box,
  List,
  ListItem,
  Avatar,
  Chip,
  Typography,
  LinearProgress,
  Stack,
  useMediaQuery
} from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { Link } from "react-router-dom";

const getProgress = (activities) => {
  if (!Array.isArray(activities) || activities.length === 0) return 0;
  const completed = activities.filter(a => a.status === "Completato").length;
  return Math.round((completed / activities.length) * 100);
};

const getPriorityColor = (priority) => {
  if (priority === "Urgente") return "#f44336";
  if (priority === "Alta") return "#ff9800";
  if (priority === "Media") return "#ffc107";
  if (priority === "Bassa") return "#8bc34a";
  return "#e0e0e0";
};

const CommesseList = ({ orders, customers }) => {
  const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'));

  return (
    <Box sx={{ width: "100%", bgcolor: "background.paper", borderRadius: 2, boxShadow: 1, p: 1 }}>
      <List disablePadding>
        {orders && orders.map((order) => {
          const customer = customers?.find(c => c.id === order.clientId);
          const progress = getProgress(order.activities);
          return (
            <ListItem
              key={order.id}
              sx={{
                display: "flex",
                alignItems: "flex-start",
                minHeight: 38,
                py: 0.5,
                px: 1,
                mb: 0.2,
                borderRadius: 1,
                background: "linear-gradient(90deg, #f8fafc 0%, #e3e6ee 100%)",
                "&:hover": { background: "#e0e7ff" },
                gap: 1.2,
                flexDirection: isMobile ? "column" : "row",
                alignItems: isMobile ? "stretch" : "center"
              }}
              disableGutters
            >
              <Stack
                direction={isMobile ? "row" : "row"}
                spacing={1}
                alignItems={isMobile ? "flex-start" : "center"}
                sx={{ width: "100%" }}
              >
                <Avatar sx={{ bgcolor: "#4f8cff", width: 24, height: 24, mr: 1, flexShrink: 0 }}>
                  <AssignmentIcon fontSize="small" />
                </Avatar>
                <Box sx={{ flex: 2, minWidth: 0, mr: 1 }}>
                  <Link
                    to={`/commesse/${order.id}`}
                    style={{ textDecoration: "none", color: "#1e293b", fontWeight: 600, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                  >
                    {order.orderName}
                  </Link>
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                    #{order.internal_id}
                  </Typography>
                </Box>
                {!isMobile && (
                  <>
                    <Box sx={{ flex: 2, minWidth: 0, mr: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        Cliente:{" "}
                        <Link
                          to={`/clienti/${order.clientId}`}
                          style={{ color: "#4f8cff", textDecoration: "none", fontSize: 12, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                        >
                          {customer?.customer_name || "—"}
                        </Link>
                      </Typography>
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0, mr: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        Fine: {order.endDate ? new Date(order.endDate).toLocaleDateString("it-IT") : "—"}
                      </Typography>
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 50, mx: 1, display: "flex", alignItems: "center", mr: 12 }}>
                      <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{
                          width: "100%",
                          height: 5,
                          borderRadius: 2,
                          backgroundColor: "#e0e0e0",
                          "& .MuiLinearProgress-bar": {
                            borderRadius: 2,
                            background: "linear-gradient(90deg, #4f8cff 0%, #6dd5ed 100%)",
                          },
                        }}
                      />
                      <Typography variant="caption" color="text.secondary" sx={{ minWidth: 24, textAlign: "right", ml: 0.5 }}>
                        {progress}%
                      </Typography>
                    </Box>
                                    <Chip
                  label={order.urgency}
                  size="small"
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: getPriorityColor(order.urgency),
                    color: "#fff",
                    borderRadius: 1,
                    fontSize: 11,
                    px: 1,
                    height: 22,
                  }}
                />
                  </>
                )}
              </Stack>
              {isMobile && (
                <Stack direction="column" spacing={0.5} sx={{ mt: 1, width: "100%" }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Cliente:{" "}
                      <Link
                        to={`/clienti/${order.clientId}`}
                        style={{ color: "#4f8cff", textDecoration: "none", fontSize: 12, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                      >
                        {customer?.customer_name || "—"}
                      </Link>
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Fine: {order.endDate ? new Date(order.endDate).toLocaleDateString("it-IT") : "—"}
                    </Typography>
                  </Box>
                  <Box sx={{ minWidth: 50, display: "flex", alignItems: "center" }}>
                    <LinearProgress
                      variant="determinate"
                      value={progress}
                      sx={{
                        width: "100%",
                        height: 5,
                        borderRadius: 2,
                        backgroundColor: "#e0e0e0",
                        "& .MuiLinearProgress-bar": {
                          borderRadius: 2,
                          background: "linear-gradient(90deg, #4f8cff 0%, #6dd5ed 100%)",
                        },
                      }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ minWidth: 24, textAlign: "right", ml: 0.5 }}>
                      {progress}%
                    </Typography>
                  </Box>
                </Stack>
              )}
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

export default CommesseList;
