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
import SchemaSettings from "../components/Impostazioni/SchemaSettings";

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
            <Typography>Schemi</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <SchemaSettings />
          </AccordionDetails>
        </Accordion>
      </Container>
    </Box>
  );
}
