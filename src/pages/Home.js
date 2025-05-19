import { useState, useEffect } from "react";
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
  InputLabel,
} from "@mui/material";
import CommesseList from "../components/Orders/CommesseList";
import CommesseCards from "../components/Orders/CommesseCards";
import Commesse from "../components/Orders/Commesse";
import NoOrders from "../components/Orders/NoOrders";
import useRealtimeOrderWithActivities from "../hooks/useRealTime";
import { fetchCustomers } from "../services/customerService";
import SortIcon from "@mui/icons-material/Sort";

const views = [
  { key: "list", icon: <ViewHeadlineIcon />, label: "List" },
  { key: "default", icon: <GridViewIcon />, label: "Default" },
  { key: "comfy", icon: <ViewComfyIcon />, label: "Comfy" },
];

const variants = {
  initial: { opacity: 0, x: 40, filter: "blur(4px)" },
  animate: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
  },
  exit: {
    opacity: 0,
    x: -40,
    filter: "blur(4px)",
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
  },
};

const Home = () => {
  let orders = useRealtimeOrderWithActivities("orders", "activities");
  const [customers, setCustomers] = useState([]);
  const [sort, setSort] = useState("date_desc"); // stato ordinamento
  const commesseViews = {
    list: <CommesseList />,
    default: (
      <CommesseCards orders={orders} customers={customers} sort={sort} />
    ),
    comfy: <Commesse orders={orders} sort={sort} />,
  };
  const [view, setView] = useState("default");

  const handleView = (_, nextView) => {
    if (nextView !== null) setView(nextView);
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
                <MenuItem value="date_desc">Data più recente</MenuItem>
                <MenuItem value="date_asc">Data meno recente</MenuItem>
                <MenuItem value="name_asc">Nome commessa A-Z</MenuItem>
                <MenuItem value="name_desc">Nome commessa Z-A</MenuItem>
                <MenuItem value="progress_desc">
                  Avanzamento decrescente
                </MenuItem>
                <MenuItem value="progress_asc">Avanzamento crescente</MenuItem>
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
