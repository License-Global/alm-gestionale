import React, { useState, useEffect, useRef } from "react";
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
import NoOrders from "../Orders/NoOrders";
import Chatbox from "../Chat/Chatbox";
import AdminDocsModal from "../misc/AdminDocsModal";
import useActiveUser from "../../hooks/useActiveUser";
import { usePersonale } from "../../hooks/usePersonale";
import useSession from "../../hooks/useSession";
import { fetchCustomers } from "../../services/customerService";

const MainTable = ({ order }) => {
  const session = useSession();
  const authorizedUser = useActiveUser();
  const { personale, loading } = usePersonale();
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItemDocs, setSelectedItemDocs] = useState(null);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("lg"));
  const isVerySmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const messagesContainerRef = useRef(null);
  const [customers, setCustomers] = useState([]);
  const getWorkerName = (id) =>
    personale.find((p) => p.id === id)?.workerName || "Sconosciuto";

  useEffect(() => {
    const fetchCustomersData = async () => {
      const data = await fetchCustomers();
      setCustomers(data);
    };

    fetchCustomersData();
  }, []);

  //Archivio
  const [loadingArchivio, setLoadingArchivio] = useState(false);
  const [successArchivio, setSuccessArchivio] = useState(false);
  const [errorArchivio, setErrorArchivio] = useState(null);
  const [fileCounts, setFileCounts] = useState({}); // Stato per memorizzare i conteggi dei file per ogni attività

  const handleArchive = async () => {
    setLoadingArchivio(true);
    setSuccessArchivio(false);
    setErrorArchivio(null);

    const result = await archiveOrder(order.id);

    if (result.success) {
      deleteFolder(session.session.user.id, order.orderName + order.clientId);
      setSuccessArchivio(true);
    } else {
      setErrorArchivio(result.error);
    }

    setLoadingArchivio(false);
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
  useEffect(() => {
    const fetchFileCounts = async () => {
      if (!order || !order.activities || !session?.session?.user?.id) return;

      const counts = {}; // Oggetto per memorizzare i conteggi
      await Promise.all(
        order.activities.map(async (activity) => {
          try {
            const count = await getFileCount(
              session.session.user.id,
              order.orderName + order.clientId + "/" + activity.name
            );
            counts[activity.name] = count;
          } catch (error) {
            console.error(
              `Errore nel recupero dei file per ${activity.name}:`,
              error
            );
          }
        })
      );

      // Solo se i conteggi sono cambiati, aggiorna lo stato
      setFileCounts((prevCounts) => {
        const isEqual = Object.keys(counts).every(
          (key) => counts[key] === prevCounts[key]
        );

        return isEqual ? prevCounts : counts;
      });
    };

    fetchFileCounts();
  }, [order, session]);

  if (order === false) return <NoOrders />;
  else
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
            borderColor: handleOrderPriorityHighlight(order?.urgency),
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
                  {order.isConfirmed ? (
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
                      {
                        customers.find((c) => c.id === order.clientId)
                          ?.customer_name
                      }
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
                    <i>{order?.internal_id}</i>
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
                <Grid item xs={12} sm={6} md={4} lg={1.5}>
                  <OrderInfoItem>
                    <Assignment fontSize="large" />
                    <Typography variant="subtitle1">
                      <b>Ordine:</b> <br /> {order?.orderName}
                    </Typography>
                  </OrderInfoItem>
                </Grid>
                {/* Altri campi dell'ordine */}
                <Grid item xs={12} sm={6} md={4} lg={1.5}>
                  <OrderInfoItem>
                    <Inventory2 fontSize="large" />
                    <Typography variant="body1">
                      <b>Scaffale: </b> <br /> {order?.materialShelf}
                    </Typography>
                  </OrderInfoItem>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={1.5}>
                  <OrderInfoItem>
                    <PriorityHigh fontSize="large" />
                    <Typography variant="body1">
                      <b>Priorità:</b> <br />{" "}
                      <Chip
                        sx={{
                          backgroundColor: handleOrderPriorityHighlight(
                            order?.urgency
                          ),
                          fontSize: { xs: "0.75rem", sm: "0.875rem" },
                          height: { xs: 24, sm: 32 },
                        }}
                        label={order?.urgency}
                      />
                    </Typography>
                  </OrderInfoItem>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={1.5}>
                  <OrderInfoItem>
                    <Person fontSize="large" />
                    <Typography variant="body1">
                      <b>Responsabile:</b> <br />{" "}
                      {getWorkerName(order?.orderManager)}
                    </Typography>
                  </OrderInfoItem>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={1.5}>
                  <OrderInfoItem>
                    <Construction fontSize="large" />
                    <Typography variant="body1">
                      <b>Accessori:</b> <br /> {order?.accessories}
                    </Typography>
                  </OrderInfoItem>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={1.5}>
                  <OrderInfoItem>
                    <DateRange fontSize="large" />
                    <Typography variant="body1">
                      <b>Data inizio:</b> <br />{" "}
                      {new Date(order?.startDate).toLocaleDateString("it-IT")}
                    </Typography>
                  </OrderInfoItem>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={1.5}>
                  <OrderInfoItem>
                    <DateRange fontSize="large" />
                    <Typography variant="body1">
                      <b>Data fine:</b> <br />{" "}
                      {new Date(order?.endDate).toLocaleDateString("it-IT")}
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
                      <StyledTableCell align="right">
                        Completato
                      </StyledTableCell>
                    )}
                    <StyledTableCell align="right">Assegnato</StyledTableCell>
                    {!isSmallScreen && (
                      <StyledTableCell align="right">
                        Situazione
                      </StyledTableCell>
                    )}
                    <StyledTableCell align="right">Documenti</StyledTableCell>
                    <StyledTableCell align="right">Azione</StyledTableCell>
                    <StyledTableCell align="right">Note</StyledTableCell>
                  </TableRow>
                </StyledTableHead>

                {/* Body tabella dell'ordine */}

                <TableBody>
                  {order?.activities.map((activity, index) => (
                    <TableRow
                      sx={
                        activity.status === "Bloccato"
                          ? {
                              bgcolor: theme.palette.error.light,
                              ":hover": { bgcolor: theme.palette.error.main },
                            }
                          : {} // Oggetto vuoto se la condizione non è soddisfatta
                      }
                      key={index}
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
                          {activity.name}
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
                          {new Date(activity.endDate).toLocaleString("it-IT", {
                            day: "2-digit",
                            month: "2-digit",
                            year: isSmallScreen ? "2-digit" : "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </Typography>
                      </StyledTableCell>
                      {!isSmallScreen && (
                        <StyledTableCell align="right">
                          <Chip
                            label={activity.status}
                            color={getStatusColor(activity.status)}
                            size="small"
                          />
                        </StyledTableCell>
                      )}
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
                          {getWorkerName(activity.responsible)}
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
                              activity.endDate,
                              activity.completed
                            )}
                          </Box>
                        </StyledTableCell>
                      )}{" "}
                      <StyledTableCell align="right">
                        <Badge
                          key={activity.name}
                          badgeContent={fileCounts[activity.name] || 0} // Usa il conteggio dei file per l'attività
                          color="primary"
                        >
                          <FindInPage
                            sx={{
                              color: theme.palette.secondary.main,
                              cursor: "pointer",
                              fontSize: { xs: "1.5rem", sm: "2rem" },
                            }}
                            onClick={() =>
                              handleOpenModalDocs(activity, order.id)
                            }
                          />
                        </Badge>
                      </StyledTableCell>{" "}
                      <StyledTableCell align="right">
                        <Select
                          disabled={activity.completed ? true : false}
                          defaultValue={activity.status}
                          displayEmpty
                          size="small"
                          onChange={(e) =>
                            updateActivityStatusInOrder(
                              activity.id,
                              e.target.value
                            )
                          }
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
                          key={activity.name + "note"}
                          badgeContent={activity.note.length} // Usa il conteggio dei file per l'attività
                          color="secondary"
                        >
                          <IconButton
                            onClick={() => handleOpenModal(activity, order.id)}
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
                  ))}
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
                value={handleProgressPercentage(order?.activities)}
                color={
                  order?.activities.every((act) => act.status === "Completato")
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
                order={order}
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
                bucketName={session.session.user.id}
                folderName={
                  order?.orderName +
                  order?.clientId +
                  "/" +
                  selectedItemDocs?.name
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
