import React, { useState } from "react";
import {
  Container,
  Grid,
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  Paper,
  Switch,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  FormLabel,
  Button,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PanToolIcon from "@mui/icons-material/PanTool";
import useSession from "../hooks/useSession";
import EmployeeCards from "../components/Impostazioni/EmployeeCards";
import { motion } from "framer-motion";
import CustomersCards from "../components/Impostazioni/CustomersCards";
import Searchbar from "../components/Appbar/Searchbar";
import OperatorsTable from "../components/Impostazioni/Operators/OperatorsTable";
import { useNavigate } from "react-router-dom";

const sections = [
  "Account",
  "Operatori",
  "Clienti",
  // "Privacy",
  // "Aspetto",
  // "Avanzate",
];

const Impostazioni = () => {
  const navigate = useNavigate();
  const [selectedSection, setSelectedSection] = useState("Account");
  const [userPhone, setUserPhone] = useState("");
  const { session } = useSession();

  const handleListItemClick = (section) => {
    setSelectedSection(section);
  };
  const renderSectionContent = () => {
    switch (selectedSection) {
      case "Account":
        return (
          <Box component="form" sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Dettagli Account
            </Typography>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <FormLabel component="legend" sx={{ mt: 2 }}>
                Email:
              </FormLabel>
              <TextField
                name="email"
                fullWidth
                variant="standard"
                value={session?.user.email}
                disabled
              />
              <FormLabel component="legend" sx={{ mt: 2 }}>
                Iscritto dal:
              </FormLabel>
              <TextField
                name="phone"
                fullWidth
                type="tel"
                variant="standard"
                value={new Date(session?.user.created_at).toLocaleDateString()}
                onChange={(e) => setUserPhone(e.target.value)}
                disabled
              />
              <FormLabel component="legend" sx={{ mt: 2 }}>
                Telefono:
              </FormLabel>
              <TextField
                name="phone"
                fullWidth
                type="tel"
                variant="standard"
                value={userPhone}
                onChange={(e) => setUserPhone(e.target.value)}
                disabled
              />
            </motion.div>
          </Box>
        );
      case "Operatori":
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Operatori
            </Typography>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Box sx={{ display: "flex", my: 4 }}>
                <Searchbar minisearch={true} type={"operators"} />
                <Button
                  onClick={() => navigate("/aggiungi-operatore")}
                  variant="contained"
                >
                  <PersonAddIcon />
                </Button>
              </Box>
              <OperatorsTable />
            </motion.div>
          </Box>
        );
      case "Clienti":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Clienti
              </Typography>
              <Box sx={{ display: "flex", my: 4 }}>
                <Searchbar minisearch={true} type={"customers"} />
                <Button
                  onClick={() => navigate("/aggiungi-cliente")}
                  variant="contained"
                >
                  <PersonAddIcon />
                </Button>
              </Box>
              <CustomersCards />
            </Box>
          </motion.div>
        );
      // case "Privacy":
      //   return (
      //     <Box sx={{ mt: 2 }}>
      //       <Typography variant="h6" gutterBottom>
      //         Opzioni di Privacy
      //       </Typography>
      //       <Box sx={{ mt: 2 }}>
      //         <FormControlLabel
      //           control={<Switch defaultChecked />}
      //           label="Rendi il profilo visibile pubblicamente"
      //         />
      //       </Box>
      //       <Box sx={{ mt: 2 }}>
      //         <FormControlLabel
      //           control={<Switch />}
      //           label="Condividi dati con terze parti"
      //         />
      //       </Box>
      //     </Box>
      //   );
      // case "Aspetto":
      //   return (
      //     <Box sx={{ mt: 2 }}>
      //       <Typography variant="h6" gutterBottom>
      //         Personalizzazione Aspetto
      //       </Typography>
      //       <FormControl fullWidth sx={{ mt: 2 }}>
      //         <InputLabel id="theme-select-label">Tema</InputLabel>
      //         <Select
      //           labelId="theme-select-label"
      //           defaultValue="bianco"
      //           label="Tema"
      //         >
      //           <MenuItem value="bianco">Bianco</MenuItem>
      //           <MenuItem value="nero">Nero</MenuItem>
      //         </Select>
      //       </FormControl>
      //     </Box>
      //   );
      // case "Avanzate":
      //   return (
      //     <Box sx={{ mt: 2 }}>
      //       <Typography variant="h6" gutterBottom>
      //         Impostazioni Avanzate
      //       </Typography>
      //       <Box sx={{ mt: 2 }}>
      //         <FormControlLabel
      //           control={<Switch />}
      //           label="Modalità sviluppatore"
      //         />
      //       </Box>
      //       <TextField
      //         fullWidth
      //         label="Parametri personalizzati"
      //         margin="normal"
      //         variant="outlined"
      //       />
      //     </Box>
      //   );
      default:
        return null;
    }
  };

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              backgroundColor: "#fff",
              height: "100%",
            }}
          >
            <List>
              {sections.map((section) => (
                <ListItemButton
                  key={section}
                  selected={selectedSection === section}
                  onClick={() => handleListItemClick(section)}
                  sx={{
                    my: 1,
                    borderRadius: 1,
                    "&.Mui-selected": {
                      backgroundColor: "primary.dark",
                    },
                  }}
                >
                  <ListItemText primary={section} />
                </ListItemButton>
              ))}
            </List>
          </Paper>
        </Grid>
        {/* Contenuto della sezione selezionata */}
        <Grid item xs={12} md={9}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              backgroundColor: "#fff",
              minHeight: "60vh",
            }}
          >
            {renderSectionContent()}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Impostazioni;
