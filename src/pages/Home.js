import { useState, useEffect, useMemo } from "react";
import GridViewIcon from "@mui/icons-material/GridView";
import ViewHeadlineIcon from "@mui/icons-material/ViewHeadline";
import ViewComfyIcon from "@mui/icons-material/ViewComfy";
import { motion, AnimatePresence } from "framer-motion";
import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import CommesseList from "../components/Orders/CommesseList";
import CommesseCards from "../components/Orders/CommesseCards";
import Commesse from "../components/Orders/Commesse";
import useRealtimeOrderWithActivities from "../hooks/useRealTime";
import { fetchCustomers } from "../services/customerService";
import SortIcon from "@mui/icons-material/Sort";
import CheckIcon from "@mui/icons-material/Check";

const views = [
  { key: "list", icon: <ViewHeadlineIcon />, label: "List" },
  { key: "default", icon: <GridViewIcon />, label: "Default" },
  { key: "comfy", icon: <ViewComfyIcon />, label: "Comfy" },
];

const variants = {
  initial: { opacity: 0, x: 40 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
  },
  exit: {
    opacity: 0,
    x: -40,
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
  },
};

const Home = () => {
  let ordersData = useRealtimeOrderWithActivities("orders", "activities");
  const [customers, setCustomers] = useState([]);
  const [sort, setSort] = useState("name_asc"); // Cambiato il valore predefinito a nome ascendente

  // Funzione che applica l'ordinamento agli ordini
  const orders = useMemo(() => {
    if (!ordersData || !ordersData.length) return [];

    return [...ordersData].sort((a, b) => {
      switch (sort) {
        // Ordinamento per nome
        case "name_asc":
          return a.orderName.localeCompare(b.orderName);
        case "name_desc":
          return b.orderName.localeCompare(a.orderName);

        // Ordinamento per cliente
        case "client_asc": {
          const clientA =
            customers.find((c) => c.id === a.clientId)?.customer_name || "";
          const clientB =
            customers.find((c) => c.id === b.clientId)?.customer_name || "";
          return clientA.localeCompare(clientB);
        }
        case "client_desc": {
          const clientA =
            customers.find((c) => c.id === a.clientId)?.customer_name || "";
          const clientB =
            customers.find((c) => c.id === b.clientId)?.customer_name || "";
          return clientB.localeCompare(clientA);
        }

        // Ordinamento per urgenza
        case "urgency_asc": {
          const urgencyOrder = { Bassa: 1, Media: 2, Alta: 3, Urgente: 4 };
          return (
            (urgencyOrder[a.urgency] || 0) - (urgencyOrder[b.urgency] || 0)
          );
        }
        case "urgency_desc": {
          const urgencyOrder = { Bassa: 1, Media: 2, Alta: 3, Urgente: 4 };
          return (
            (urgencyOrder[b.urgency] || 0) - (urgencyOrder[a.urgency] || 0)
          );
        }

        // Ordinamento per data di scadenza
        case "date_asc":
          return new Date(a.endDate) - new Date(b.endDate);
        case "date_desc":
          return new Date(b.endDate) - new Date(a.endDate);

        // Ordinamento per data di creazione
        case "created_asc":
          return new Date(a.created_at) - new Date(b.created_at);
        case "created_desc":
          return new Date(b.created_at) - new Date(a.created_at);

        default:
          return 0;
      }
    });
  }, [ordersData, sort, customers]);

  const commesseViews = {
    list: <CommesseList orders={orders} customers={customers} />,
    default: (
      <CommesseCards orders={orders} customers={customers} sort={sort} />
    ),
    comfy: <Commesse orders={orders} sort={sort} />,
  };
  // Leggi la vista dalla sessionStorage se presente
  const initialView = sessionStorage.getItem("commesseView") || "default";
  const [view, setView] = useState(initialView);

  const handleView = (_, nextView) => {
    if (nextView !== null) {
      setView(nextView);
      sessionStorage.setItem("commesseView", nextView);
    }
  };

  const handleSort = (e) => setSort(e.target.value);

  useEffect(() => {
    const fetchCustomersData = async () => {
      const data = await fetchCustomers();
      setCustomers(data);
    };

    fetchCustomersData();
  }, []);

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        {/* Ordinamento a sinistra - linguetta che esce da sinistra */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.6, type: "spring" }}
          key="sort-bar"
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              position: "relative",
              left: "-32px",
              bgcolor: "background.paper",
              px: 2.5,
              py: 1.2,
              borderTopRightRadius: 24,
              borderBottomRightRadius: 24,
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
              boxShadow: "2px 4px 16px 0 rgba(80,120,200,0.08)",
              minWidth: 240,
              border: "1px solid #e0e4ea",
              borderLeft: "none",
              gap: 1.5,
              zIndex: 2,
            }}
          >
            <SortIcon sx={{ color: "#1565c0", mr: 1, fontSize: 22 }} />
            <FormControl
              variant="standard"
              sx={{
                minWidth: 140,
                "& .MuiInputBase-root": {
                  fontWeight: 500,
                  color: "#1565c0",
                  fontSize: 16,
                  letterSpacing: 0.2,
                  bgcolor: "transparent",
                },
                "& .MuiSelect-icon": { color: "#1565c0" },
              }}
            >
              <Select
                id="sort-select"
                value={sort}
                onChange={handleSort}
                disableUnderline
                sx={{
                  "&:hover": { bgcolor: "transparent" },
                  "& .Mui-selected": { bgcolor: "transparent" },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      borderRadius: 2,
                      boxShadow: "0 4px 16px 0 rgba(80,120,200,0.10)",
                    },
                  },
                }}
              >
                <MenuItem
                  value="name_asc"
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  Nome (A-Z)
                  {sort === "name_asc" && (
                    <CheckIcon
                      sx={{
                        ml: 1,
                        fontSize: 18,
                        color: "#1565c0",
                        verticalAlign: "middle",
                      }}
                    />
                  )}
                </MenuItem>
                <MenuItem
                  value="name_desc"
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  Nome (Z-A)
                  {sort === "name_desc" && (
                    <CheckIcon
                      sx={{
                        ml: 1,
                        fontSize: 18,
                        color: "#1565c0",
                        verticalAlign: "middle",
                      }}
                    />
                  )}
                </MenuItem>
                <MenuItem
                  value="client_asc"
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  Cliente (A-Z)
                  {sort === "client_asc" && (
                    <CheckIcon
                      sx={{
                        ml: 1,
                        fontSize: 18,
                        color: "#1565c0",
                        verticalAlign: "middle",
                      }}
                    />
                  )}
                </MenuItem>
                <MenuItem
                  value="client_desc"
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  Cliente (Z-A)
                  {sort === "client_desc" && (
                    <CheckIcon
                      sx={{
                        ml: 1,
                        fontSize: 18,
                        color: "#1565c0",
                        verticalAlign: "middle",
                      }}
                    />
                  )}
                </MenuItem>
                <MenuItem
                  value="urgency_asc"
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  Urgenza (Bassa-Alta)
                  {sort === "urgency_asc" && (
                    <CheckIcon
                      sx={{
                        ml: 1,
                        fontSize: 18,
                        color: "#1565c0",
                        verticalAlign: "middle",
                      }}
                    />
                  )}
                </MenuItem>
                <MenuItem
                  value="urgency_desc"
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  Urgenza (Alta-Bassa)
                  {sort === "urgency_desc" && (
                    <CheckIcon
                      sx={{
                        ml: 1,
                        fontSize: 18,
                        color: "#1565c0",
                        verticalAlign: "middle",
                      }}
                    />
                  )}
                </MenuItem>
                <MenuItem
                  value="date_asc"
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  Scadenza (Prima-Dopo)
                  {sort === "date_asc" && (
                    <CheckIcon
                      sx={{
                        ml: 1,
                        fontSize: 18,
                        color: "#1565c0",
                        verticalAlign: "middle",
                      }}
                    />
                  )}
                </MenuItem>
                <MenuItem
                  value="date_desc"
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  Scadenza (Dopo-Prima)
                  {sort === "date_desc" && (
                    <CheckIcon
                      sx={{
                        ml: 1,
                        fontSize: 18,
                        color: "#1565c0",
                        verticalAlign: "middle",
                      }}
                    />
                  )}
                </MenuItem>
                <MenuItem
                  value="created_asc"
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  Data inserimento (Passate-Recenti)
                  {sort === "created_asc" && (
                    <CheckIcon
                      sx={{
                        ml: 1,
                        fontSize: 18,
                        color: "#1565c0",
                        verticalAlign: "middle",
                      }}
                    />
                  )}
                </MenuItem>
                <MenuItem
                  value="created_desc"
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  Data inserimento (Recenti-Passate)
                  {sort === "created_desc" && (
                    <CheckIcon
                      sx={{
                        ml: 1,
                        fontSize: 18,
                        color: "#1565c0",
                        verticalAlign: "middle",
                      }}
                    />
                  )}
                </MenuItem>
              </Select>
            </FormControl>
          </Box>
        </motion.div>
        {/* Scelta vista a destra */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 40 }}
          transition={{ duration: 0.6, type: "spring" }}
          key="view-toggle"
        >
          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={handleView}
            aria-label="view selection"
          >
            {views.map((v) => (
              <ToggleButton
                key={v.key}
                value={v.key}
                aria-label={v.label}
                sx={{
                  "& svg": {
                    color: "#1565c0",
                    fontSize: 24,
                    transition: "color 0.2s",
                  },
                  "&.Mui-selected, &.Mui-selected:hover": {
                    backgroundColor: "#e3f2fd",
                    "& svg": {
                      color: "#0d47a1",
                    },
                  },
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                }}
              >
                {v.icon}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </motion.div>
      </Box>
      <Box minHeight={120}>
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={undefined} // Usa la transizione definita nei variants
          >
            {commesseViews[view]}
          </motion.div>
        </AnimatePresence>
      </Box>
    </Box>
  );
};

export default Home;
