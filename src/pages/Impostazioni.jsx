import React from "react";
import {
  Typography,
  Container,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Switch,
  FormControlLabel,
  MenuItem,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EmployeeCards from "../components/Impostazioni/EmployeeCards";

export default function Impostazioni() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Dipendenti</Typography>
          </AccordionSummary>
          <EmployeeCards />
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Notifiche</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <FormControlLabel control={<Switch />} label="Notifiche email" />
              <FormControlLabel control={<Switch />} label="Notifiche push" />
            </Box>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Privacy</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <FormControlLabel control={<Switch />} label="Profilo pubblico" />
              <TextField
                select
                label="Condivisione dati"
                fullWidth
                defaultValue="none"
              >
                <MenuItem value="none">Nessuna condivisione</MenuItem>
                <MenuItem value="friends">Solo con amici</MenuItem>
                <MenuItem value="public">Pubblico</MenuItem>
              </TextField>
            </Box>
          </AccordionDetails>
        </Accordion>
      </Container>
    </Box>
  );
}
