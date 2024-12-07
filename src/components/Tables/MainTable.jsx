import React, { useState, useRef } from "react";
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
} from "@mui/material";

import {
  Assignment,
  Inventory2,
  PriorityHigh,
  Person,
  DateRange,
  Email,
  FindInPage,
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
import NoOrders from "../Orders/NoOrders";
import Chatbox from "../Chat/Chatbox";
import AdminDocsModal from "../misc/AdminDocsModal";
import useActiveUser from "../../hooks/useActiveUser";

const MainTable = ({ order }) => {
  const authorizedUser = useActiveUser();
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItemDocs, setSelectedItemDocs] = useState(null);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const messagesContainerRef = useRef(null);

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

  if (order === false) return <NoOrders />;
  else
    return (
      <>
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
                  justifyContent: "space-between",
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
                <Grid item xs={12} sm={6} md={1.5}>
                  <OrderInfoItem>
                    <DateRange fontSize="large" />
                    <Typography variant="body1">
                      <b>Data fine:</b> <br />{" "}
                      {new Date(order?.endDate).toLocaleDateString("it-IT")}
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
                      <StyledTableCell component="th" scope="row">
                        <Typography variant="subtitle1" fontWeight="medium">
                          {activity.name}
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {new Date(activity.endDate).toLocaleString("it-IT")}
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
                        {}
                        {/* <FindInPage
                          sx={{
                            color: theme.palette.primary.main,
                            cursor: "pointer",
                          }}
                          fontSize="large"
                          onClick={() =>
                            handleOpenModalDocs(activity, order.id)
                          }
                        /> */}
                        <FindInPage
                          sx={{
                            color: theme.palette.secondary.main,
                            cursor: "pointer",
                          }}
                          fontSize="large"
                          onClick={() =>
                            handleOpenModalDocs(activity, order.id)
                          }
                        />
                      </StyledTableCell>
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
                          <MenuItem value="Bloccato">Bloccato</MenuItem>
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
                authorizedUser={authorizedUser}
                selectedItem={selectedItem}
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
                bucketName={order.orderName}
                folderName={selectedItemDocs?.name}
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
