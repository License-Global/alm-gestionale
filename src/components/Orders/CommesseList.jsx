import React from "react";
import {
  Box,
  List,
  ListItem,
  Avatar,
  Chip,
  Typography,
  LinearProgress,
  useMediaQuery,
} from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { Link } from "react-router-dom";
import autoAnimate from "@formkit/auto-animate";
import { useRole } from "../../context/RoleContext";
import NoOrders from "./NoOrders";

const getProgress = (activities) => {
  if (!Array.isArray(activities) || activities.length === 0) return 0;
  const completed = activities.filter((a) => a.status === "Completato").length;
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
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const listRef = React.useRef(null);

  const { role } = useRole();
  const decodedRole = role ? atob(role) : null;
  React.useEffect(() => {
    if (listRef.current) autoAnimate(listRef.current);
  }, [listRef]);

  if (!orders || orders.length === 0) {
    return <NoOrders />;
  }

  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "background.paper",
        borderRadius: 2,
        boxShadow: 1,
        p: 1,
      }}
    >
      <List disablePadding ref={listRef}>
        {orders &&
          orders.map((order) => {
            const customer = customers?.find((c) => c.id === order.clientId);
            const progress = getProgress(order.activities);
            return (
              <ListItem
                key={order.id}
                sx={{
                  display: "flex",
                  minHeight: 48,
                  py: 0.5,
                  px: 1,
                  mb: 0.2,
                  borderRadius: 1,
                  background:
                    "linear-gradient(90deg, #f8fafc 0%, #e3e6ee 100%)",
                  "&:hover": { background: "#e0e7ff" },
                  flexDirection: isMobile ? "column" : "row",
                  alignItems: "stretch",
                }}
                disableGutters
              >
                {!isMobile ? (
                  // Layout Desktop - Griglia con larghezze fisse
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns:
                        "40px 2fr 1.5fr 100px 120px 150px 80px",
                      gap: 2,
                      alignItems: "center",
                      width: "100%",
                      py: 0.5,
                    }}
                  >
                    {/* Avatar */}
                    <Avatar
                      sx={{
                        bgcolor: "#4f8cff",
                        width: 24,
                        height: 24,
                        gridColumn: 1,
                      }}
                    >
                      <AssignmentIcon fontSize="small" />
                    </Avatar>

                    {/* Nome Ordine */}
                    <Box sx={{ gridColumn: 2, minWidth: 0 }}>
                      <Link
                        to={`/${order.id}`}
                        style={{
                          textDecoration: "none",
                          color: "#1e293b",
                          fontWeight: 600,
                          fontSize: 16,
                          display: "block",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {order.orderName}
                      </Link>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontSize: 12 }}
                      >
                        #{order.internal_id}
                      </Typography>
                    </Box>

                    {/* Cliente */}
                    <Box sx={{ gridColumn: 3, minWidth: 0 }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontSize: 12, display: "block", mb: 0.2 }}
                      >
                        Cliente:
                      </Typography>
                      {decodedRole === "admin" ? (
                        <Link
                          to={`/clienti/${order.clientId}`}
                          style={{
                            color: "#4f8cff",
                            textDecoration: "none",
                            fontSize: 13,
                            display: "block",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {customer?.customer_name || "—"}
                        </Link>
                      ) : (
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#4f8cff",
                            fontSize: 13,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            opacity: 0.7,
                          }}
                        >
                          {customer?.customer_name || "—"}
                        </Typography>
                      )}
                    </Box>

                    {/* Data Fine */}
                    <Box sx={{ gridColumn: 4, minWidth: 0 }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontSize: 12, display: "block", mb: 0.2 }}
                      >
                        Fine:
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontSize: 13, whiteSpace: "nowrap" }}
                      >
                        {order.endDate
                          ? new Date(order.endDate).toLocaleDateString("it-IT")
                          : "—"}
                      </Typography>
                    </Box>

                    {/* Zona */}
                    <Box sx={{ gridColumn: 5, minWidth: 0 }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontSize: 12, display: "block", mb: 0.2 }}
                      >
                        Zona:
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: 13,
                          fontWeight: 500,
                          color: "#1976d2",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {order.zone_consegna || "—"}
                      </Typography>
                    </Box>

                    {/* Progress */}
                    <Box
                      sx={{
                        gridColumn: 6,
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                      }}
                    >
                      <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{
                          flex: 1,
                          height: 5,
                          borderRadius: 2,
                          backgroundColor: "#e0e0e0",
                          "& .MuiLinearProgress-bar": {
                            borderRadius: 2,
                            background:
                              "linear-gradient(90deg, #4f8cff 0%, #6dd5ed 100%)",
                          },
                        }}
                      />
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ minWidth: 30, textAlign: "right", fontSize: 12 }}
                      >
                        {progress}%
                      </Typography>
                    </Box>

                    {/* Priorità */}
                    <Box sx={{ gridColumn: 7, justifySelf: "center" }}>
                      <Chip
                        label={order.urgency}
                        size="small"
                        sx={{
                          fontWeight: "bold",
                          backgroundColor: getPriorityColor(order.urgency),
                          color: "#fff",
                          borderRadius: 1,
                          fontSize: 11,
                          height: 22,
                        }}
                      />
                    </Box>
                  </Box>
                ) : (
                  // Layout Mobile
                  <Box sx={{ width: "100%", p: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Avatar
                        sx={{
                          bgcolor: "#4f8cff",
                          width: 24,
                          height: 24,
                          mr: 1,
                        }}
                      >
                        <AssignmentIcon fontSize="small" />
                      </Avatar>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Link
                          to={`/${order.id}`}
                          style={{
                            textDecoration: "none",
                            color: "#1e293b",
                            fontWeight: 600,
                            fontSize: 16,
                            display: "block",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {order.orderName}
                        </Link>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ fontSize: 12 }}
                        >
                          #{order.internal_id}
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
                          height: 22,
                        }}
                      />
                    </Box>

                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "60px 1fr",
                        gap: 0.5,
                        rowGap: 0.3,
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        Cliente:
                      </Typography>
                      <Box>
                        {decodedRole === "admin" ? (
                          <Link
                            to={`/clienti/${order.clientId}`}
                            style={{
                              color: "#4f8cff",
                              textDecoration: "none",
                              fontSize: 13,
                            }}
                          >
                            {customer?.customer_name || "—"}
                          </Link>
                        ) : (
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#4f8cff",
                              fontSize: 13,
                              opacity: 0.7,
                            }}
                          >
                            {customer?.customer_name || "—"}
                          </Typography>
                        )}
                      </Box>

                      <Typography variant="caption" color="text.secondary">
                        Fine:
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: 13 }}>
                        {order.endDate
                          ? new Date(order.endDate).toLocaleDateString("it-IT")
                          : "—"}
                      </Typography>

                      <Typography variant="caption" color="text.secondary">
                        Zona:
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontSize: 13, fontWeight: 500, color: "#1976d2" }}
                      >
                        {order.zone_consegna || "—"}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        mt: 1,
                      }}
                    >
                      <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{
                          flex: 1,
                          height: 5,
                          borderRadius: 2,
                          backgroundColor: "#e0e0e0",
                          "& .MuiLinearProgress-bar": {
                            borderRadius: 2,
                            background:
                              "linear-gradient(90deg, #4f8cff 0%, #6dd5ed 100%)",
                          },
                        }}
                      />
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ minWidth: 30, textAlign: "right", fontSize: 12 }}
                      >
                        {progress}%
                      </Typography>
                    </Box>
                  </Box>
                )}
              </ListItem>
            );
          })}
      </List>
    </Box>
  );
};

export default CommesseList;
