import React, { useState } from "react";
import theme from "../../theme";
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
} from "@mui/material";

import {
  Assignment,
  Inventory2,
  PriorityHigh,
  Person,
  DateRange,
  Email,
} from "@mui/icons-material";

import { orders } from "../../ordersExample";

import {
  StyledTableContainer,
  StyledTableCell,
  StyledTableHead,
  StyledModal,
  titleStyle,
  OrderInfoCard,
  OrderInfoItem,
} from "./Styles";

const orderInfo = {
  name: "Ordine #12345",
  shelf: "A-123",
  priority: "Alta",
  manager: "Giuseppe Bianchi",
  accessori: "Giuseppe Bianchi",
  startDate: "2023-05-01",
};

const MainTable = () => {
  const [open, setOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const authorizedUser = "Operator";

  const handleOpenModal = (item) => {
    setSelectedItem(item);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setSelectedItem(null);
  };
  const getStatusColor = (status) => {
    switch (status) {
      case "Completata":
        return "success";
      case "In corso":
        return "primary";
      case "In attesa":
        return "warning";
      case "Non iniziata":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <>
      <Paper
        sx={{
          backgroundColor: theme.palette.grey[100],
          padding: 4,
          m: 3,
          boxShadow: 4,
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
                    <b>Ordine:</b> <br /> {orderInfo.name}
                  </Typography>
                </OrderInfoItem>
              </Grid>
              {/* Altri campi dell'ordine */}
              <Grid item xs={12} sm={6} md={1.5}>
                <OrderInfoItem>
                  <Inventory2 fontSize="large" />
                  <Typography variant="body1">
                    <b>Scaffale: </b> <br /> {orderInfo.shelf}
                  </Typography>
                </OrderInfoItem>
              </Grid>
              <Grid item xs={12} sm={6} md={1.5}>
                <OrderInfoItem>
                  <PriorityHigh fontSize="large" />
                  <Typography variant="body1">
                    <b>Priorità:</b> <br /> {orderInfo.priority}
                  </Typography>
                </OrderInfoItem>
              </Grid>
              <Grid item xs={12} sm={6} md={1.5}>
                <OrderInfoItem>
                  <Person fontSize="large" />
                  <Typography variant="body1">
                    <b>Manager:</b> <br /> {orderInfo.manager}
                  </Typography>
                </OrderInfoItem>
              </Grid>
              <Grid item xs={12} sm={6} md={1.5}>
                <OrderInfoItem>
                  <DateRange fontSize="large" />
                  <Typography variant="body1">
                    <b>Accessori:</b> <br /> {orderInfo.accessori}
                  </Typography>
                </OrderInfoItem>
              </Grid>
              <Grid item xs={12} sm={6} md={1.5}>
                <OrderInfoItem>
                  <DateRange fontSize="large" />
                  <Typography variant="body1">
                    <b>Data inizio:</b> <br /> {orderInfo.startDate}
                  </Typography>
                </OrderInfoItem>
              </Grid>
              <Grid item xs={12} sm={6} md={1.5}>
                <OrderInfoItem>
                  <DateRange fontSize="large" />
                  <Typography variant="body1">
                    <b>Data inizio:</b> <br /> {orderInfo.startDate}
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
                  <StyledTableCell>Nome Attività</StyledTableCell>
                  {!isSmallScreen && (
                    <StyledTableCell align="right">Data</StyledTableCell>
                  )}
                  <StyledTableCell align="right">Stato</StyledTableCell>
                  {!isSmallScreen && (
                    <StyledTableCell align="right">Completato</StyledTableCell>
                  )}
                  <StyledTableCell align="right">Assegnato a</StyledTableCell>
                  <StyledTableCell align="right">Azione</StyledTableCell>
                  <StyledTableCell align="right">Note</StyledTableCell>
                </TableRow>
              </StyledTableHead>

              {/* Body tabella dell'ordine */}

              <TableBody>
                {orders[0].activity.map((activity, index) => (
                  <TableRow key={index}>
                    <StyledTableCell component="th" scope="row">
                      <Typography variant="subtitle1" fontWeight="medium">
                        {activity.activityName}
                      </Typography>
                    </StyledTableCell>
                    {!isSmallScreen && (
                      <StyledTableCell align="right">
                        {new Date(activity.expire).toLocaleDateString()}
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
                          {activity.completed}
                        </Typography>
                      </StyledTableCell>
                    )}
                    <StyledTableCell align="right">
                      {activity.activityManager}
                    </StyledTableCell>
                    {/* {!isSmallScreen && (
                      <StyledTableCell align="right">
                        <Box sx={{ minWidth: 35 }}>
                          <Typography variant="body2" color="text.secondary">
                            {`${activity.completed}`}
                          </Typography>
                        </Box>
                      </StyledTableCell>
                    )} */}
                    <StyledTableCell align="right">
                      <Select
                        defaultValue=""
                        displayEmpty
                        size="small"
                        sx={{ minWidth: 120 }}
                      >
                        <MenuItem value="" disabled>
                          Azioni
                        </MenuItem>
                        <MenuItem value="edit">Modifica</MenuItem>
                        <MenuItem value="delete">Elimina</MenuItem>
                        <MenuItem value="archive">Archivia</MenuItem>
                      </Select>
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      <IconButton
                        onClick={() => handleOpenModal(activity)}
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
      </Paper>
      <Divider sx={{ my: "15px", borderBottomWidth: 5 }} />

      {/* Modal */}
      {selectedItem && (
        <Modal
          open={open}
          onClose={handleCloseModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={StyledModal}>
            <Typography id="modal-title" sx={titleStyle}>
              {selectedItem?.activityName}
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
              <Box sx={{ flexGrow: 1, overflowY: "auto", mb: 1 }}>
                <List dense>
                  {selectedItem.note.map((message) => (
                    <ListItem
                      key={message.id}
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
                          ? "Tu"
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
                  placeholder="Scrivi..."
                  variant="outlined"
                  size="small"
                />
                <Button variant="contained" size="small" sx={{ ml: 1, mb: 4 }}>
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
