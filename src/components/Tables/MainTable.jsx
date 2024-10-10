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
  TableCell,
  TableContainer,
  TableHead,
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

import { styled } from "@mui/system";
import {
  Assignment,
  Inventory2,
  PriorityHigh,
  Person,
  DateRange,
  Email,
} from "@mui/icons-material";

import { orders } from "../../ordersExample";

const StyledTableContainer = styled(TableContainer)`
  margin-top: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  overflow: hidden;
  @media (max-width: 600px) {
    overflow-x: auto; /* Scroll orizzontale per schermi piccoli */
  }
`;

const StyledTableHead = styled(TableHead)`
  background-color: ${theme.palette.primary.light};
`;

const StyledTableCell = styled(TableCell)`
  padding: 16px;
`;

const OrderInfoCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  backgroundColor: theme.palette.background.default,
  borderRadius: "12px",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
}));

const OrderInfoItem = styled(Box)(({ theme }) => ({
  border: "2px",
  marginBottom: theme.spacing(2),
  "& .MuiSvgIcon-root": {
    marginRight: theme.spacing(1),
    color: theme.palette.primary.main,
  },
}));

const StyledModal = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  borderRadius: "16px",
  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
  padding: "24px",
  textAlign: "center",
  border: "2px solid #4CAF50", // Bordo verde personalizzato
  transition: "all 0.3s ease",
  "&:hover": {
    borderColor: "#388E3C", // Cambia colore al bordo quando si passa sopra la modale
    boxShadow: "0px 6px 25px rgba(0, 0, 0, 0.3)", // Ombra più pronunciata al passaggio del mouse
  },
};

const titleStyle = {
  fontFamily: "Georgia, serif", // Font serif per un aspetto elegante e classico
  fontWeight: 600, // Peso medio per un look raffinato
  fontSize: "1.8rem", // Dimensione non troppo grande per mantenere sobrietà
  textAlign: "center",
  textTransform: "capitalize", // Solo la prima lettera maiuscola
  letterSpacing: "1px", // Leggera spaziatura tra le lettere
  textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)", // Sottile ombra per profondità senza eccessi
  paddingBottom: "8px",
  cursor: "default",
};

// Dati di esempio per le attività (reintegrate)
// const activities = [
//   {
//     id: 1,
//     name: "Attività 1",
//     date: "2023-05-01",
//     status: "In corso",
//     priority: "Alta",
//     assignee: "Mario Rossi",
//     progress: 75,
//     favorite: true,
//   },
//   {
//     id: 2,
//     name: "Attività 2",
//     date: "2023-05-02",
//     status: "Completata",
//     priority: "Media",
//     assignee: "Luigi Verdi",
//     progress: 100,
//     favorite: false,
//   },
//   {
//     id: 3,
//     name: "Attività 3",
//     date: "2023-05-03",
//     status: "In attesa",
//     priority: "Bassa",
//     assignee: "Anna Bianchi",
//     progress: 30,
//     favorite: true,
//   },
//   {
//     id: 4,
//     name: "Attività 4",
//     date: "2023-05-04",
//     status: "In corso",
//     priority: "Alta",
//     assignee: "Giovanni Neri",
//     progress: 50,
//     favorite: false,
//   },
//   {
//     id: 5,
//     name: "Attività 5",
//     date: "2023-05-05",
//     status: "Non iniziata",
//     priority: "Media",
//     assignee: "Francesca Gialli",
//     progress: 0,
//     favorite: false,
//   },
// ];

const messages = [
  { id: 1, text: "Ciao, come stai?", sender: "other" },
  { id: 2, text: "Tutto bene, grazie! E tu?", sender: "me" },
  { id: 3, text: "Anche io tutto bene!", sender: "other" },
];

// Dati di esempio per le informazioni dell'ordine
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
              <Grid item xs={12} sm={6} md={2}>
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
              <Grid item xs={12} sm={6} md={2}>
                <OrderInfoItem>
                  <Inventory2 fontSize="large" />
                  <Typography variant="body1">
                    <b>Scaffale: </b> <br /> {orderInfo.shelf}
                  </Typography>
                </OrderInfoItem>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <OrderInfoItem>
                  <PriorityHigh fontSize="large" />
                  <Typography variant="body1">
                    <b>Priorità:</b> <br /> {orderInfo.priority}
                  </Typography>
                </OrderInfoItem>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <OrderInfoItem>
                  <Person fontSize="large" />
                  <Typography variant="body1">
                    <b>Manager:</b> <br /> {orderInfo.manager}
                  </Typography>
                </OrderInfoItem>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <OrderInfoItem>
                  <DateRange fontSize="large" />
                  <Typography variant="body1">
                    <b>Accessori:</b> <br /> {orderInfo.accessori}
                  </Typography>
                </OrderInfoItem>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
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
                  {messages.map((message) => (
                    <ListItem
                      key={message.id}
                      sx={{
                        justifyContent:
                          message.sender === "me" ? "flex-end" : "flex-start",
                        display: "flex",
                      }}
                    >
                      <Paper
                        sx={{
                          p: 1,
                          maxWidth: "75%",
                          bgcolor:
                            message.sender === "me" ? "#e0f7fa" : "#f1f1f1",
                          borderRadius:
                            message.sender === "me"
                              ? "16px 16px 0 16px"
                              : "16px 16px 16px 0",
                        }}
                      >
                        <Typography variant="body2">{message.text}</Typography>
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
                <Button variant="contained" size="small" sx={{ ml: 1 }}>
                  Invia
                </Button>
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
          </Box>
        </Modal>
      )}
    </>
  );
};

export default MainTable;
