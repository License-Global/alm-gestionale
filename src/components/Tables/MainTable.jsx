import React, { useState, useEffect, useRef } from "react";
import theme from "../../theme";
import {
  subscribeToOrderUpdates,
  unsubscribeFromOrderUpdates,
} from "../../services/supabaseRealtimeService";
import {
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  Box,
  Table,
  TableBody,
  TableRow,
  Paper,
  Select,
  MenuItem,
  IconButton,
  Chip,
  Grid,
  useMediaQuery,
  Divider,
  Modal,
  LinearProgress,
} from "@mui/material";

import {
  Assignment,
  Inventory2,
  PriorityHigh,
  Person,
  DateRange,
  Email,
} from "@mui/icons-material";

import Timer from "../misc/Timer";

import {
  StyledTableContainer,
  StyledTableCell,
  StyledTableHead,
  StyledModal,
  titleStyle,
  OrderInfoCard,
  OrderInfoItem,
} from "./Styles";

import {
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
} from "date-fns";
import dayjs from "dayjs";

import { updateActivityStatusInOrder } from "../../services/activitiesService";
import { addNote } from "../../services/notesServices";
import NoOrders from "../Orders/NoOrders";

const MainTable = ({ order }) => {
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const messagesContainerRef = useRef(null);

  const [newMessage, setNewMessage] = useState("");

  const authorizedUser = "Admin";

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  };

  const handleOpenModal = (item, orderId) => {
    setSelectedItem({ ...item, orderId });
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setSelectedItem(null);
    setNewMessage("");
  };
  const getStatusColor = (status) => {
    switch (status) {
      case undefined:
        return "error";
      case "Completato":
        return "success";
      case "In corso":
        return "primary";
      case "In attesa":
        return "warning";
      case "Standby":
        return "error";
      default:
        return "default";
    }
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
  function getDifferenceInDaysHoursAndMinutesString(date1, date2) {
    // Calcola la differenza totale in minuti
    const totalMinutesDifference = Math.abs(differenceInMinutes(date2, date1));

    // Calcola la differenza in giorni interi
    const daysDifference = Math.abs(differenceInDays(date2, date1));

    // Calcola la differenza in ore intere rimanenti dopo aver sottratto i giorni
    const remainingHours =
      Math.abs(differenceInHours(date2, date1)) - daysDifference * 24;

    // Calcola i minuti rimanenti dopo aver sottratto i giorni e le ore
    const remainingMinutes =
      totalMinutesDifference - daysDifference * 24 * 60 - remainingHours * 60;

    // Costruisci la stringa del risultato
    let result = "";
    if (daysDifference > 0) {
      result += `${daysDifference}G `;
    }
    if (remainingHours > 0) {
      result += `${remainingHours}H `;
    }
    result += `${remainingMinutes}min `;

    return result.trim();
  }

  const handleTargetLabel = (expire, completed) => {
    if (completed) {
      if (Math.abs(differenceInMinutes(expire, completed)) < 5) {
        return <Chip color="info" label={`In orario`} />;
      } else if (expire > completed) {
        return (
          <Chip
            color="success"
            label={`Anticipo di
            ${getDifferenceInDaysHoursAndMinutesString(expire, completed)}`}
          />
        );
      } else if (expire < completed) {
        return (
          <Chip
            color="error"
            label={`Ritardo di
            ${getDifferenceInDaysHoursAndMinutesString(expire, completed)}`}
          />
        );
      }
      // else if (expire < completed) {
      //     return (<button className=' w-full cursor-default btn rounded-xl btn-error'>Ritardo di {Math.abs(differenceInMinutes(expire, completed)) >= 60 ? Math.abs(differenceInHours(expire, completed)) + " H" : Math.abs(differenceInMinutes(expire, completed)) + " m"}</button>)
      // }
    } else {
      return <Timer targetDate={expire} />;
    }
  };

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

  const sendMessage = async (
    orderId,
    activityName,
    noteContent,
    sender = "Admin"
  ) => {
    try {
      await addNote(orderId, activityName, noteContent, sender);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedItem?.note]);

  useEffect(() => {
    if (open) {
      scrollToBottom(); // Scorri in fondo all'apertura della modale
    }
  }, [open]);

  if (order === false) return <NoOrders />;
  else
    return (
      <>
        <div key={order?.id}>
          <Paper
            sx={{
              backgroundColor: theme.palette.grey[100],
              padding: 4,
              m: 3,
              boxShadow: 4,
              border: "2px solid ",
              borderRadius: "16px",
              borderColor: handleOrderPriorityHighlight(order?.urgency),
            }}
          >
            <Box
              sx={{
                mx: "16px",
              }}
            >
              <OrderInfoCard>
                <Grid
                  container
                  spacing={2}
                  sx={{
                    textAlign: "center",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {/* Griglia per i dettagli dell'ordine */}
                  <Grid item xs={12} sm={6} md={1.5}>
                    <OrderInfoItem
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Assignment fontSize="large" />
                      <Typography variant="subtitle1">
                        <b>Ordine:</b> <br /> {order?.orderName}
                      </Typography>
                    </OrderInfoItem>
                  </Grid>
                  {/* Altri campi dell'ordine */}
                  <Grid item xs={12} sm={6} md={1.5}>
                    <OrderInfoItem>
                      <Inventory2 fontSize="large" />
                      <Typography variant="body1">
                        <b>Scaffale: </b> <br /> {order?.materialShelf}
                      </Typography>
                    </OrderInfoItem>
                  </Grid>
                  <Grid item xs={12} sm={6} md={1.5}>
                    <OrderInfoItem>
                      <PriorityHigh fontSize="large" />
                      <Typography variant="body1">
                        <b>Priorità:</b> <br /> {order?.urgency}
                      </Typography>
                    </OrderInfoItem>
                  </Grid>
                  <Grid item xs={12} sm={6} md={1.5}>
                    <OrderInfoItem>
                      <Person fontSize="large" />
                      <Typography variant="body1">
                        <b>Responsabile:</b> <br /> {order?.orderManager}
                      </Typography>
                    </OrderInfoItem>
                  </Grid>
                  <Grid item xs={12} sm={6} md={1.5}>
                    <OrderInfoItem>
                      <DateRange fontSize="large" />
                      <Typography variant="body1">
                        <b>Accessori:</b> <br /> {order?.accessories}
                      </Typography>
                    </OrderInfoItem>
                  </Grid>
                  <Grid item xs={12} sm={6} md={1.5}>
                    <OrderInfoItem>
                      <DateRange fontSize="large" />
                      <Typography variant="body1">
                        <b>Data inizio:</b> <br />{" "}
                        {new Date(order?.startDate).toLocaleDateString("it-IT")}
                      </Typography>
                    </OrderInfoItem>
                  </Grid>
                </Grid>
              </OrderInfoCard>

              <StyledTableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="tabella attività">
                  {/* Header tabella dell'ordine */}
                  <StyledTableHead>
                    <TableRow>
                      <StyledTableCell>Attività</StyledTableCell>
                      {!isSmallScreen && (
                        <StyledTableCell align="right">
                          Scadenza
                        </StyledTableCell>
                      )}
                      <StyledTableCell align="right">Stato</StyledTableCell>
                      {!isSmallScreen && (
                        <StyledTableCell align="right">
                          Completato
                        </StyledTableCell>
                      )}
                      <StyledTableCell align="right">
                        Assegnato a
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        Situazione
                      </StyledTableCell>
                      <StyledTableCell align="right">Azione</StyledTableCell>
                      <StyledTableCell align="right">Note</StyledTableCell>
                    </TableRow>
                  </StyledTableHead>

                  {/* Body tabella dell'ordine */}

                  <TableBody>
                    {order?.activities.map((activity, index) => (
                      <TableRow key={index}>
                        <StyledTableCell component="th" scope="row">
                          <Typography variant="subtitle1" fontWeight="medium">
                            {activity.name}
                          </Typography>
                        </StyledTableCell>
                        {!isSmallScreen && (
                          <StyledTableCell align="right">
                            {new Date(activity.endDate).toLocaleString("it-IT")}
                          </StyledTableCell>
                        )}
                        <StyledTableCell align="right">
                          <Chip
                            label={activity.status}
                            color={getStatusColor(activity.status)}
                            size="small"
                          />
                        </StyledTableCell>
                        {!isSmallScreen && (
                          <StyledTableCell align="right">
                            <Typography variant="body2" fontWeight="medium">
                              {activity.completed
                                ? dayjs(activity.completed).format(
                                    "DD/MM/YYYY HH:mm"
                                  )
                                : "//"}
                            </Typography>
                          </StyledTableCell>
                        )}
                        <StyledTableCell align="right">
                          {activity.responsible}
                        </StyledTableCell>
                        {!isSmallScreen && (
                          <StyledTableCell align="right">
                            <Box
                              sx={{
                                minWidth: 35,
                                color: "text.primary",
                                fontSize: "1.2rem",
                                fontFamily: "Montserrat, sans-serif",
                              }}
                            >
                              {handleTargetLabel(
                                activity.endDate,
                                activity.completed
                              )}
                            </Box>
                          </StyledTableCell>
                        )}
                        <StyledTableCell align="right">
                          <Select
                            disabled={activity.completed ? true : false}
                            defaultValue={activity.status}
                            displayEmpty
                            size="small"
                            onChange={(e) =>
                              updateActivityStatusInOrder(
                                order.id,
                                index,
                                e.target.value
                              )
                            }
                            sx={{ minWidth: 120 }}
                          >
                            <MenuItem disabled value="Standby">
                              Standby
                            </MenuItem>
                            <MenuItem value="In corso">In corso</MenuItem>
                            <MenuItem value="In attesa">In attesa</MenuItem>
                            <MenuItem value="Completato">
                              <b>Completato</b>
                            </MenuItem>
                          </Select>
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          <IconButton
                            onClick={() => handleOpenModal(activity, order.id)}
                            size="small"
                          >
                            <Email />
                          </IconButton>
                        </StyledTableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </StyledTableContainer>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box sx={{ mt: "15px", width: "50%" }}>
                <LinearProgress
                  variant="determinate"
                  value={handleProgressPercentage(order?.activities)}
                />
              </Box>
              <Button
                variant="contained"
                color="secondary"
                sx={{ mt: "15px", fontWeight: "bold" }}
              >
                Archivia
              </Button>
            </Box>
          </Paper>
          <Divider sx={{ my: "15px", borderBottomWidth: 5 }} />

          {/* Modal */}
        </div>
        {selectedItem && (
          <Modal
            ref={messagesContainerRef}
            id={"modal" + selectedItem.name}
            open={open}
            onClose={handleCloseModal}
          >
            <Box sx={StyledModal}>
              <Typography id={"modal-title"} sx={titleStyle}>
                {selectedItem?.name}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "400px",
                  width: "100%",
                  maxWidth: "400px",
                  p: 1,
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  mx: "auto",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                }}
              >
                {/* Area Messaggi */}
                <Box
                  ref={messagesContainerRef}
                  sx={{ flexGrow: 1, overflowY: "auto", mb: 1 }}
                >
                  <List dense>
                    {selectedItem.note.map((message, index) => (
                      <ListItem
                        key={index}
                        sx={{
                          justifyContent:
                            message.sender === authorizedUser
                              ? "flex-end"
                              : "flex-start",
                          display: "flex",
                          flexDirection: "column", // Per mettere la label sopra il messaggio
                          alignItems:
                            message.sender === authorizedUser
                              ? "flex-end"
                              : "flex-start",
                        }}
                      >
                        {/* Label del mittente */}
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#888",
                            mb: 0.5, // Spazio sotto la label
                          }}
                        >
                          {message.sender === authorizedUser
                            ? `Tu ${dayjs(message.created_at).format(
                                "DD/MM/YYYY HH:mm"
                              )}`
                            : message.sender}
                        </Typography>

                        <Paper
                          sx={{
                            p: 1,
                            maxWidth: "75%",
                            bgcolor:
                              message.sender === authorizedUser
                                ? "#e0f7fa"
                                : "#f1f1f1",
                            borderRadius:
                              message.sender === authorizedUser
                                ? "16px 16px 0 16px"
                                : "16px 16px 16px 0",
                          }}
                        >
                          <Typography variant="body2">
                            {message.content}
                          </Typography>
                        </Paper>
                      </ListItem>
                    ))}
                  </List>
                </Box>

                {/* Input Messaggio */}
                <Box sx={{ display: "flex" }}>
                  <TextField
                    fullWidth
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Scrivi..."
                    variant="outlined"
                    size="small"
                  />
                  <Button
                    onClick={() =>
                      sendMessage(
                        selectedItem.orderId,
                        selectedItem.name,
                        newMessage,
                        authorizedUser
                      )
                    }
                    // onClick={() => console.log(selectedItem)}
                    variant="contained"
                    size="small"
                    sx={{ ml: 1, mb: 4 }}
                  >
                    Invia
                  </Button>
                </Box>
              </Box>
              <Box sx={{ m: 2 }}>
                <Button
                  onClick={handleCloseModal}
                  color="secondary"
                  variant="contained"
                  size="medium"
                  sx={{ ml: 1 }}
                >
                  Esci
                </Button>
              </Box>
            </Box>
          </Modal>
        )}
      </>
    );
};

export default MainTable;
