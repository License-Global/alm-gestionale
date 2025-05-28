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
  Tooltip,
  Typography,
} from "@mui/material";

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

function getTimelineData(orders, year) {
  const inserite = Array(12).fill(0);
  const completate = Array(12).fill(0);

  orders?.forEach((order) => {
    const created = new Date(order.created_at);
    if (created.getFullYear() === year) {
      inserite[created.getMonth()]++;
    }
    // Completate: tutte le attività devono avere status === "Completato"
    if (
      order.activities &&
      order.activities.length > 0 &&
      order.activities.every((a) => a.status === "Completato")
    ) {
      // Usa la data di fine più recente tra le attività
      const lastEnd = order.activities.reduce((max, a) => {
        const d = a.endDate ? new Date(a.endDate) : null;
        return d && (!max || d > max) ? d : max;
      }, null);
      if (lastEnd && lastEnd.getFullYear() === year) {
        completate[lastEnd.getMonth()]++;
      }
    }
  });

  return {
    inserite,
    completate,
  };
}

export default function Timeline({ orders = [] }) {
  const years = getAvailableYears(orders);
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = React.useState(
    years.includes(currentYear) ? currentYear : years[0] || currentYear
  );

  React.useEffect(() => {
    if (!years.includes(selectedYear) && years.length > 0) {
      setSelectedYear(years[0]);
    }
    // eslint-disable-next-line
  }, [orders]);

  const timelineData = getTimelineData(orders, selectedYear);

  // Calcola se ci sono dati per l'anno selezionato
  const hasData =
    timelineData.inserite.some((v) => v > 0) ||
    timelineData.completate.some((v) => v > 0);

  const now = new Date();
  const isCurrentYear = selectedYear === now.getFullYear();
  const currentMonth = now.getMonth();

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
                  <Tooltip
                    key={idx}
                    title={val > 0 ? `${val} commesse inserite` : ""}
                    arrow
                    placement="top"
                    disableHoverListener={val === 0}
                  >
                    <TableCell
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
                  </Tooltip>
                ))}
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 500, color: "green" }}>
                  COMPLETATE
                </TableCell>
                {timelineData.completate.map((val, idx) => (
                  <Tooltip
                    key={idx}
                    title={val > 0 ? `${val} commesse completate` : ""}
                    arrow
                    placement="top"
                    disableHoverListener={val === 0}
                  >
                    <TableCell
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
                  </Tooltip>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}
