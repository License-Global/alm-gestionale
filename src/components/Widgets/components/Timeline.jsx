import React from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";

import { useArchivedOrders } from "../../../hooks/useArchivedOrder";

const months = [
  "Gennaio",
  "Febbraio",
  "Marzo",
  "Aprile",
  "Maggio",
  "Giugno",
  "Luglio",
  "Agosto",
  "Settembre",
  "Ottobre",
  "Novembre",
  "Dicembre",
];

function getYear(dateString) {
  if (!dateString) return null;
  return new Date(dateString).getFullYear();
}

function getAvailableYears(orders) {
  const years = new Set();
  orders?.forEach((order) => {
    const year = getYear(order.created_at);
    if (year) years.add(year);
    // Considera anche le attività completate in altri anni
    if (order.activities && order.activities.length > 0) {
      order.activities.forEach((a) => {
        if (a.endDate) {
          const endYear = getYear(a.endDate);
          if (endYear) years.add(endYear);
        }
      });
    }
  });
  return Array.from(years).sort((a, b) => b - a);
}

function getTimelineData(inseriteOrders, completateOrders, year) {
  const inserite = Array(12).fill(0);
  const completate = Array(12).fill(0);

  inseriteOrders?.forEach((order) => {
    const created = new Date(order.created_at);
    if (created.getFullYear() === year) {
      inserite[created.getMonth()]++;
    }
  });

  completateOrders?.forEach((order) => {
    // Usa la data di archiviazione come data di completamento
    const archivedAt = order.archived_at || order.updated_at || order.created_at;
    const completed = new Date(archivedAt);
    if (completed.getFullYear() === year) {
      completate[completed.getMonth()]++;
    }
  });

  return {
    inserite,
    completate,
  };
}

export default function Timeline({ orders = [] }) {
  const { orders: archivedOrders, loading } = useArchivedOrders();

  // Calcola gli anni disponibili sia da inserite che da completate
  const years = React.useMemo(() => {
    const inseriteYears = getAvailableYears(orders);
    const completateYears = getAvailableYears(archivedOrders);
    return Array.from(new Set([...inseriteYears, ...completateYears])).sort((a, b) => b - a);
  }, [orders, archivedOrders]);

  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = React.useState(
    years.includes(currentYear) ? currentYear : years[0] || currentYear
  );

  React.useEffect(() => {
    if (!years.includes(selectedYear) && years.length > 0) {
      setSelectedYear(years[0]);
    }
    // eslint-disable-next-line
  }, [orders, archivedOrders]);

  const timelineData = getTimelineData(orders, archivedOrders, selectedYear);

  // Calcola se ci sono dati per l'anno selezionato
  const hasData =
    timelineData.inserite.some((v) => v > 0) ||
    timelineData.completate.some((v) => v > 0);

  const now = new Date();
  const isCurrentYear = selectedYear === now.getFullYear();
  const currentMonth = now.getMonth();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" sx={{ p: 4 }}>
        <Typography variant="body2" color="text.secondary">
          Caricamento commesse archiviate...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          mb: 2,
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <FormControl size="small" sx={{ minWidth: 120, mr: 2 }}>
          <InputLabel id="anno-label">Anno</InputLabel>
          <Select
            labelId="anno-label"
            value={selectedYear}
            label="Anno"
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            inputProps={{ "aria-label": "Seleziona anno" }}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 300,
                },
              },
            }}
          >
            {years.map((y) => (
              <MenuItem key={y} value={y}>
                {y}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {!hasData && (
          <Typography sx={{ color: "text.secondary" }}>
            Nessun dato disponibile per l'anno selezionato.
          </Typography>
        )}
      </Box>
      <Box sx={{ maxWidth: "100%", overflowX: "auto" }}>
        <TableContainer component={Paper} sx={{ boxShadow: 0 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: "green" }}>
                  {selectedYear}
                </TableCell>
                {months.map((month, idx) => (
                  <TableCell
                    key={month}
                    align="center"
                    sx={{
                      fontWeight: 700,
                      fontSize: 13,
                      backgroundColor:
                        isCurrentYear && idx === currentMonth
                          ? "rgba(56, 142, 60, 0.08)"
                          : "inherit",
                    }}
                  >
                    {month}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell sx={{ fontWeight: 500, color: "#b59c3e" }}>
                  INSERITE
                </TableCell>
                {timelineData.inserite.map((val, idx) => (
                  <TableCell
                    key={idx}
                    align="center"
                    sx={{
                      color: "#e6b800",
                      fontWeight: 500,
                      fontSize: 18,
                      backgroundColor:
                        isCurrentYear && idx === currentMonth
                          ? "rgba(245, 206, 66, 0.13)"
                          : "inherit",
                    }}
                  >
                    {val || ""}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 500, color: "green" }}>
                  COMPLETATE
                </TableCell>
                {timelineData.completate.map((val, idx) => (
                  <TableCell
                    key={idx}
                    align="center"
                    sx={{
                      color: "green",
                      fontWeight: 500,
                      fontSize: 18,
                      backgroundColor:
                        isCurrentYear && idx === currentMonth
                          ? "rgba(56, 142, 60, 0.13)"
                          : "inherit",
                    }}
                  >
                    {val || ""}
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}
