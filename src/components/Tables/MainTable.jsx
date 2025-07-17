import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import theme from "../../theme";
import {
  Typography,
  Button,
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
  Badge,
} from "@mui/material";

import {
  Assignment,
  Inventory2,
  PriorityHigh,
  Person,
  DateRange,
  Email,
  FindInPage,
  Check,
  Clear,
  Construction,
  LocationOn,
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
  HeaderContainer,
  HeaderLeftSection,
  HeaderRightSection,
  ClientInfo,
} from "./Styles";

import {
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
} from "date-fns";
import dayjs from "dayjs";

import { updateActivityStatusInOrder } from "../../services/activitiesService";
import { deleteFolder, getFileCount } from "../../services/bucketServices";
import { archiveOrder } from "../../services/orderService";
import {
  subscribeToOrderUpdates,
  unsubscribeFromOrderUpdates,
} from "../../services/supabaseRealtimeService";
import Chatbox from "../Chat/Chatbox";
import AdminDocsModal from "../misc/AdminDocsModal";
import useActiveUser from "../../hooks/useActiveUser";
import { usePersonale } from "../../hooks/usePersonale";
import useSession from "../../hooks/useSession";
import { fetchCustomers } from "../../services/customerService";
import { sendNotification } from "../../utils/sendNotification";
import useUser from "../../hooks/useUser";

const MainTable = ({ order }) => {
  const session = useSession();
  const { userId } = useUser();
  const authorizedUser = useActiveUser();
  const { personale, loading } = usePersonale();
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItemDocs, setSelectedItemDocs] = useState(null);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("lg"));
  const isVerySmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const messagesContainerRef = useRef(null);
  const [customers, setCustomers] = useState([]);

  // Stato per gestire l'ordine con protezione dai cambiamenti live
  const [currentOrder, setCurrentOrder] = useState(null);
  const [isOrderLoading, setIsOrderLoading] = useState(false);

  // Ref per evitare race conditions
  const updateTimeoutRef = useRef(null);
  const realtimeChannelRef = useRef(null);

  const getWorkerName = useCallback(
    (id) => {
      if (!personale || !Array.isArray(personale)) return "Sconosciuto";
      return personale.find((p) => p.id === id)?.workerName || "Sconosciuto";
    },
    [personale]
  );

  // Memoizza il cliente per evitare ricalcoli non necessari
  const currentCustomer = useMemo(() => {
    if (!customers || !Array.isArray(customers) || !currentOrder?.clientId) {
      return null;
    }
    return customers.find((c) => c.id === currentOrder.clientId);
  }, [customers, currentOrder?.clientId]);

  // Gestione sicura dell'aggiornamento dell'ordine
  const updateCurrentOrder = useCallback((newOrder) => {
    if (!newOrder) {
      setCurrentOrder(null);
      return;
    }

    // Validazione dei dati dell'ordine
    const validatedOrder = {
      ...newOrder,
      activities: Array.isArray(newOrder.activities) ? newOrder.activities : [],
      orderName: newOrder.orderName || "",
      clientId: newOrder.clientId || null,
      urgency: newOrder.urgency || "Bassa",
      isConfirmed: Boolean(newOrder.isConfirmed),
      internal_id: newOrder.internal_id || "",
      materialShelf: newOrder.materialShelf || "",
      accessories: newOrder.accessories || "",
      startDate: newOrder.startDate || new Date().toISOString(),
      endDate: newOrder.endDate || new Date().toISOString(),
    };

    // Evita aggiornamenti inutili confrontando gli oggetti
    setCurrentOrder((prevOrder) => {
      if (
        !prevOrder ||
        JSON.stringify(prevOrder) !== JSON.stringify(validatedOrder)
      ) {
        return validatedOrder;
      }
      return prevOrder;
    });
  }, []);

  // Gestione dei cambiamenti dell'ordine prop
  useEffect(() => {
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }

    // Debounce per evitare aggiornamenti troppo frequenti
    updateTimeoutRef.current = setTimeout(() => {
      updateCurrentOrder(order);
    }, 100);

    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, [order, updateCurrentOrder]);

  // Gestione realtime per l'ordine specifico
  useEffect(() => {
    if (!currentOrder?.id || !session?.session?.user?.id) return;

    const handleOrderUpdate = (updatedOrder) => {
      if (updatedOrder && updatedOrder.id === currentOrder.id) {
        console.log("Aggiornamento realtime ricevuto:", updatedOrder);
        updateCurrentOrder(updatedOrder);
      }
    };

    // Sottoscrizione agli aggiornamenti realtime (orders + activities)
    realtimeChannelRef.current = subscribeToOrderUpdates(
      currentOrder.id,
      handleOrderUpdate
    );

    return () => {
      if (realtimeChannelRef.current) {
        unsubscribeFromOrderUpdates(realtimeChannelRef.current);
        realtimeChannelRef.current = null;
      }
    };
  }, [currentOrder?.id, session?.session?.user?.id, updateCurrentOrder]);

  useEffect(() => {
    const fetchCustomersData = async () => {
      try {
        const data = await fetchCustomers();
        setCustomers(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Errore nel caricamento clienti:", error);
        setCustomers([]);
      }
    };

    fetchCustomersData();
  }, []);

  //Archivio
  const [loadingArchivio, setLoadingArchivio] = useState(false);
  const [successArchivio, setSuccessArchivio] = useState(false);
  const [errorArchivio, setErrorArchivio] = useState(null);
  const [fileCounts, setFileCounts] = useState({}); // Stato per memorizzare i conteggi dei file per ogni attività

  const handleArchive = async () => {
    if (!currentOrder?.id) return;

    setLoadingArchivio(true);
    setSuccessArchivio(false);
    setErrorArchivio(null);

    try {
      const result = await archiveOrder(currentOrder.id);

      if (result.success) {
        if (
          session?.session?.user?.id &&
          currentOrder.orderName &&
          currentOrder.clientId
        ) {
          deleteFolder(
            session.session.user.id,
            currentOrder.orderName + currentOrder.clientId
          );
        }
        setSuccessArchivio(true);
      } else {
        setErrorArchivio(result.error);
      }
    } catch (error) {
      console.error("Errore durante l'archiviazione:", error);
      setErrorArchivio("Errore durante l'archiviazione");
    } finally {
      setLoadingArchivio(false);
    }
  };

  const handleOpenModal = (item, orderId) => {
    setSelectedItem({ ...item, orderId });
    setOpen(true);
  };
  const handleOpenModalDocs = (item, orderId) => {
    setSelectedItemDocs({ ...item, orderId });
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setSelectedItem(null);
  };
  const handleCloseModalDoc = () => {
    setOpen(false);
    setSelectedItemDocs(null);
  };
  const getStatusColor = (status) => {
    switch (status) {
      case undefined:
        return "error";
      case "Completato":
        return "success";
      case "In corso":
        return "primary";
      case "Bloccato":
        return "error";
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

  const handleProgressPercentage = useCallback((activities) => {
    if (!Array.isArray(activities) || activities.length === 0) {
      return 0;
    }

    const completedCount = activities.filter(
      (activity) => activity?.status === "Completato"
    ).length;
    const percentage = (completedCount / activities.length) * 100;

    return Math.round(percentage);
  }, []);

  const handleInviaNotifica = useCallback(
    async (activity, newStatus) => {
      if (!activity || !currentOrder || !userId) return;

      try {
        await sendNotification({
          tenant_id: userId,
          type: "change",
          payload: {
            icon: "change",
            tags: [],
            type: "change",
            title: `${activity.name} in ${currentOrder.orderName} adesso è ${newStatus}`,
            message: "",
            priority: "normal",
            action_url: `/${currentOrder.id}`,
            expires_at: null,
            action_label: "MOSTRA",
            reference_id: currentOrder.id,
            action_object: currentOrder,
            reference_type: "mainTable",
          },
          read: false,
          created_at: new Date().toISOString(),
          read_at: null,
        });
      } catch (e) {
        console.log("Errore nell'invio della notifica.", e);
      }
    },
    [userId, currentOrder]
  );

  // Funzione per aggiornare i conteggi dei file
  const updateFileCounts = useCallback(async () => {
    if (
      !currentOrder?.activities ||
      !Array.isArray(currentOrder.activities) ||
      !session?.session?.user?.id
    ) {
      return;
    }

    try {
      const counts = {};
      await Promise.all(
        currentOrder.activities.map(async (activity) => {
          if (!activity?.name) return;

          try {
            const count = await getFileCount(
              session.session.user.id,
              `${currentOrder.orderName}${currentOrder.clientId}/${activity.name}`
            );
            counts[activity.name] = count || 0;
          } catch (error) {
            console.error(
              `Errore nel recupero dei file per ${activity.name}:`,
              error
            );
            counts[activity.name] = 0;
          }
        })
      );

      setFileCounts((prevCounts) => {
        const isEqual = Object.keys(counts).every(
          (key) => counts[key] === prevCounts[key]
        );
        return isEqual ? prevCounts : counts;
      });
    } catch (error) {
      console.error("Errore generale nel caricamento file counts:", error);
    }
  }, [
    currentOrder?.activities,
    currentOrder?.orderName,
    currentOrder?.clientId,
    session?.session?.user?.id,
  ]);

  useEffect(() => {
    updateFileCounts();
  }, [updateFileCounts]);

  // Cleanup effect per la pulizia delle sottoscrizioni e timeout
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
      if (realtimeChannelRef.current) {
        unsubscribeFromOrderUpdates(realtimeChannelRef.current);
      }
    };
  }, []);

  // Early return con gestione sicura degli stati di caricamento
  if (order === false || !currentOrder) return null;
  if (isOrderLoading) return <div>Caricamento ordine...</div>;

  // Validazione sicura delle activities
  const safeActivities = Array.isArray(currentOrder.activities)
    ? currentOrder.activities
    : [];

  return (
    <>
      {" "}
      <Paper
        sx={{
          backgroundColor: theme.palette.grey[100],
          padding: { xs: 1, sm: 2 },
          m: { xs: 1, sm: 2, md: 3 },
          boxShadow: 4,
          border: "2px solid ",
          borderRadius: "16px",
          borderColor: handleOrderPriorityHighlight(currentOrder?.urgency),
        }}
      >
        <Box
          sx={{
            mx: "16px",
          }}
        >
          {" "}
          <HeaderContainer>
            <HeaderLeftSection>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  textDecoration: "underline",
                  gap: "8px",
                }}
              >
                <Typography
                  variant="h6"
                  component="span"
                  sx={{
                    fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
                  }}
                >
                  <i>Confermato: </i>
                </Typography>
                {currentOrder.isConfirmed ? (
                  <Check
                    fontSize={isVerySmallScreen ? "medium" : "large"}
                    color="success"
                  />
                ) : (
                  <Clear
                    fontSize={isVerySmallScreen ? "medium" : "large"}
                    color="error"
                  />
                )}
              </div>
            </HeaderLeftSection>

            <HeaderRightSection>
              <ClientInfo>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{
                    fontSize: { xs: "0.9rem", sm: "1.1rem", md: "1.25rem" },
                  }}
                >
                  <b>Cliente:</b>{" "}
                  <i>
                    {currentCustomer?.customer_name || "Cliente non trovato"}
                  </i>
                </Typography>
              </ClientInfo>
              <ClientInfo>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{
                    fontSize: { xs: "0.9rem", sm: "1.1rem", md: "1.25rem" },
                  }}
                >
                  <b>ID: </b>
                  <i>{currentOrder?.internal_id || "/"}</i>
                </Typography>
              </ClientInfo>
            </HeaderRightSection>
          </HeaderContainer>
          <OrderInfoCard>
            <Grid
              container
              spacing={{ xs: 1, sm: 2, md: 3 }}
              sx={{
                textAlign: "center",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {/* Griglia per i dettagli dell'ordine */}
              <Grid item xs={12} sm={6} md={4} lg={1.4}>
                <OrderInfoItem>
                  <Assignment fontSize="large" />
                  <Typography variant="subtitle1">
                    <b>Ordine:</b> <br /> {currentOrder?.orderName || "/"}
                  </Typography>
                </OrderInfoItem>
              </Grid>
              {/* Altri campi dell'ordine */}
              <Grid item xs={12} sm={6} md={4} lg={1.4}>
                <OrderInfoItem>
                  <Inventory2 fontSize="large" />
                  <Typography variant="body1">
                    <b>Scaffale: </b> <br />{" "}
                    {currentOrder?.materialShelf || "/"}
                  </Typography>
                </OrderInfoItem>
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={1.4}>
                <OrderInfoItem>
                  <PriorityHigh fontSize="large" />
                  <Typography variant="body1">
                    <b>Priorità:</b> <br />{" "}
                    <Chip
                      sx={{
                        backgroundColor: handleOrderPriorityHighlight(
                          currentOrder?.urgency
                        ),
                        fontSize: { xs: "0.75rem", sm: "0.875rem" },
                        height: { xs: 24, sm: 32 },
                      }}
                      label={currentOrder?.urgency || "/"}
                    />
                  </Typography>
                </OrderInfoItem>
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={1.4}>
                <OrderInfoItem>
                  <Person fontSize="large" />
                  <Typography variant="body1">
                    <b>Responsabile:</b> <br />{" "}
                    {currentOrder?.orderManager.workerName}
                  </Typography>
                </OrderInfoItem>
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={1.4}>
                <OrderInfoItem>
                  <Construction fontSize="large" />
                  <Typography variant="body1">
                    <b>Accessori:</b> <br /> {currentOrder?.accessories || "/"}
                  </Typography>
                </OrderInfoItem>
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={1.4}>
                <OrderInfoItem>
                  <DateRange fontSize="large" />
                  <Typography variant="body1">
                    <b>Data inizio:</b> <br />{" "}
                    {currentOrder?.startDate
                      ? new Date(currentOrder.startDate).toLocaleDateString(
                          "it-IT"
                        )
                      : "/"}
                  </Typography>
                </OrderInfoItem>
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={1.4}>
                <OrderInfoItem>
                  <DateRange fontSize="large" />
                  <Typography variant="body1">
                    <b>Data fine:</b> <br />{" "}
                    {currentOrder?.endDate
                      ? new Date(currentOrder.endDate).toLocaleDateString(
                          "it-IT"
                        )
                      : "/"}
                  </Typography>
                </OrderInfoItem>
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={1.4}>
                <OrderInfoItem>
                  <LocationOn fontSize="large" />
                  <Typography variant="body1">
                    <b>Zona consegna:</b> <br />{" "}
                    <span style={{ fontWeight: 500, color: "#1976d2" }}>
                      {currentOrder?.zone_consegna || "—"}
                    </span>
                  </Typography>
                </OrderInfoItem>
              </Grid>
            </Grid>
          </OrderInfoCard>{" "}
          <StyledTableContainer component={Paper}>
            <Table
              sx={{ minWidth: { xs: 300, sm: 650 } }}
              aria-label="tabella attività"
            >
              {/* Header tabella dell'ordine */}
              <StyledTableHead>
                <TableRow>
                  <StyledTableCell>Attività</StyledTableCell>
                  <StyledTableCell align="right">Scadenza</StyledTableCell>
                  {!isSmallScreen && (
                    <StyledTableCell align="right">Stato</StyledTableCell>
                  )}
                  {!isSmallScreen && (
                    <StyledTableCell align="right">Completato</StyledTableCell>
                  )}
                  <StyledTableCell align="right">Assegnato</StyledTableCell>
                  {!isSmallScreen && (
                    <StyledTableCell align="right">Situazione</StyledTableCell>
                  )}
                  <StyledTableCell align="right">Documenti</StyledTableCell>
                  <StyledTableCell align="right">Azione</StyledTableCell>
                  <StyledTableCell align="right">Note</StyledTableCell>
                </TableRow>
              </StyledTableHead>

              {/* Body tabella dell'ordine */}

              <TableBody>
                {safeActivities.map((activity, index) => {
                  // Controllo di sicurezza per ogni attività
                  if (!activity) return null;

                  const activityName = activity.name || `Attività ${index + 1}`;
                  const activityStatus = activity.status || "Standby";
                  const activityEndDate = activity.endDate;
                  const activityCompleted = activity.completed;
                  const activityResponsible = activity.responsible;
                  const activityNote = Array.isArray(activity.note)
                    ? activity.note
                    : [];

                  return (
                    <TableRow
                      sx={
                        activityStatus === "Bloccato"
                          ? {
                              bgcolor: theme.palette.error.light,
                              ":hover": { bgcolor: theme.palette.error.main },
                            }
                          : {}
                      }
                      key={activity.id || index}
                    >
                      {" "}
                      <StyledTableCell component="th" scope="row">
                        <Typography
                          variant={isSmallScreen ? "body2" : "subtitle1"}
                          fontWeight="medium"
                          sx={{
                            wordBreak: "break-word",
                            fontSize: {
                              xs: "0.75rem",
                              sm: "0.875rem",
                              md: "1rem",
                            },
                          }}
                        >
                          {activityName}
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: {
                              xs: "0.7rem",
                              sm: "0.8rem",
                              md: "0.875rem",
                            },
                          }}
                        >
                          {activityEndDate
                            ? new Date(activityEndDate).toLocaleString(
                                "it-IT",
                                {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: isSmallScreen ? "2-digit" : "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )
                            : "/"}
                        </Typography>
                      </StyledTableCell>
                      {!isSmallScreen && (
                        <StyledTableCell align="right">
                          <Chip
                            label={activityStatus}
                            color={getStatusColor(activityStatus)}
                            size="small"
                          />
                        </StyledTableCell>
                      )}
                      {!isSmallScreen && (
                        <StyledTableCell align="right">
                          <Typography variant="body2" fontWeight="medium">
                            {activityCompleted
                              ? dayjs(activityCompleted).format(
                                  "DD/MM/YYYY HH:mm"
                                )
                              : "//"}
                          </Typography>
                        </StyledTableCell>
                      )}{" "}
                      <StyledTableCell align="right">
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: {
                              xs: "0.7rem",
                              sm: "0.8rem",
                              md: "0.875rem",
                            },
                            wordBreak: "break-word",
                          }}
                        >
                          {activityResponsible.workerName}
                        </Typography>
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
                              activityEndDate,
                              activityCompleted
                            )}
                          </Box>
                        </StyledTableCell>
                      )}{" "}
                      <StyledTableCell align="right">
                        <Badge
                          key={activityName}
                          badgeContent={fileCounts[activityName] || 0}
                          color="primary"
                        >
                          <FindInPage
                            sx={{
                              color: theme.palette.secondary.main,
                              cursor: "pointer",
                              fontSize: { xs: "1.5rem", sm: "2rem" },
                            }}
                            onClick={() =>
                              handleOpenModalDocs(activity, currentOrder.id)
                            }
                          />
                        </Badge>
                      </StyledTableCell>{" "}
                      <StyledTableCell align="right">
                        <Select
                          disabled={activityCompleted ? true : false}
                          value={activityStatus}
                          displayEmpty
                          size="small"
                          onChange={async (e) => {
                            const newStatus = e.target.value;

                            try {
                              // Aggiorna ottimisticamente l'UI
                              const updatedActivities = safeActivities.map(
                                (act) =>
                                  act.id === activity.id
                                    ? {
                                        ...act,
                                        status: newStatus,
                                        completed:
                                          newStatus === "Completato"
                                            ? new Date().toISOString()
                                            : act.completed,
                                      }
                                    : act
                              );

                              const updatedOrder = {
                                ...currentOrder,
                                activities: updatedActivities,
                              };

                              setCurrentOrder(updatedOrder);

                              // Quindi aggiorna il database
                              await updateActivityStatusInOrder(
                                activity.id,
                                newStatus
                              );

                              // Invia notifica
                              await handleInviaNotifica(activity, newStatus);
                            } catch (error) {
                              console.error(
                                "Errore nell'aggiornamento dello stato dell'attività:",
                                error
                              );

                              // Ripristina lo stato precedente in caso di errore
                              const revertedActivities = safeActivities.map(
                                (act) =>
                                  act.id === activity.id
                                    ? { ...act, status: activityStatus }
                                    : act
                              );

                              const revertedOrder = {
                                ...currentOrder,
                                activities: revertedActivities,
                              };

                              setCurrentOrder(revertedOrder);
                            }
                          }}
                          sx={{
                            minWidth: { xs: 100, sm: 120 },
                            fontSize: { xs: "0.75rem", sm: "0.875rem" },
                          }}
                        >
                          <MenuItem disabled value="Standby">
                            Standby
                          </MenuItem>
                          <MenuItem value="In corso">In corso</MenuItem>
                          <MenuItem value="Bloccato">Bloccato</MenuItem>
                          <MenuItem value="Completato">
                            <b>Completato</b>
                          </MenuItem>
                        </Select>
                      </StyledTableCell>{" "}
                      <StyledTableCell align="right">
                        <Badge
                          key={activityName + "note"}
                          badgeContent={activityNote.length}
                          color="secondary"
                        >
                          <IconButton
                            onClick={() =>
                              handleOpenModal(activity, currentOrder.id)
                            }
                            size="small"
                          >
                            <Email
                              color="primary"
                              sx={{
                                fontSize: { xs: "1.25rem", sm: "1.5rem" },
                              }}
                            />
                          </IconButton>
                        </Badge>
                      </StyledTableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </StyledTableContainer>
        </Box>{" "}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "stretch", sm: "center" },
            gap: { xs: 2, sm: 0 },
          }}
        >
          <Box sx={{ mt: "15px", width: { xs: "100%", sm: "50%" } }}>
            <LinearProgress
              variant="determinate"
              value={handleProgressPercentage(safeActivities)}
              color={
                safeActivities.every((act) => act?.status === "Completato")
                  ? "secondary"
                  : "primary"
              }
            />
          </Box>
          <Button
            variant="contained"
            color="secondary"
            sx={
              authorizedUser !== btoa("admin")
                ? { display: "none" }
                : {
                    mt: "15px",
                    fontWeight: "bold",
                    minWidth: { xs: "100%", sm: "auto" },
                  }
            }
            onClick={handleArchive}
            disabled={loadingArchivio}
          >
            Archivia
          </Button>
        </Box>
      </Paper>
      <Divider sx={{ my: "15px", borderBottomWidth: 5 }} />
      {/* Modal note */}
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
            <Chatbox
              authorizedUser={atob(authorizedUser)}
              selectedItem={selectedItem}
              order={currentOrder}
              closeModal={handleCloseModal}
            />
            <Box sx={{ m: 2 }}>
              <Button
                onClick={handleCloseModal}
                color="error"
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
      {/* Modal docs */}
      {selectedItemDocs && (
        <Modal
          ref={messagesContainerRef}
          id={"modal" + selectedItemDocs.name}
          open={open}
          onClose={handleCloseModalDoc}
        >
          <Box sx={StyledModal}>
            <Typography id={"modal-title"} sx={titleStyle}>
              {selectedItemDocs?.name}
            </Typography>
            <AdminDocsModal
              bucketName={session?.session?.user?.id}
              folderName={
                currentOrder?.orderName &&
                currentOrder?.clientId &&
                selectedItemDocs?.name
                  ? `${currentOrder.orderName}${currentOrder.clientId}/${selectedItemDocs.name}`
                  : ""
              }
            />
            <Box sx={{ m: 4 }}>
              <Button
                onClick={handleCloseModalDoc}
                color="error"
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
