import { useState, useEffect } from "react";
import GridViewIcon from "@mui/icons-material/GridView";
import ViewHeadlineIcon from "@mui/icons-material/ViewHeadline";
import ViewComfyIcon from "@mui/icons-material/ViewComfy";
import { motion, AnimatePresence } from "framer-motion";
import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import CommesseList from "../components/Orders/CommesseList";
import CommesseCards from "../components/Orders/CommesseCards";
import Commesse from "../components/Orders/Commesse";
import NoOrders from "../components/Orders/NoOrders";
import useRealtimeOrderWithActivities from "../hooks/useRealTime";
import { fetchCustomers } from "../services/customerService";

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
  const commesseViews = {
    list: <CommesseList />,
    default: <CommesseCards orders={orders} customers={customers} />,
    comfy: <Commesse orders={orders} />,
  };
  const [view, setView] = useState("default");

  const handleView = (_, nextView) => {
    if (nextView !== null) setView(nextView);
  };

  useEffect(() => {
    const fetchCustomersData = async () => {
      const data = await fetchCustomers();
      setCustomers(data);
    };

    fetchCustomersData();
  }, []);

  return (
    <Box>
      <Box display="flex" justifyContent="flex-end" mb={3}>
        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={handleView}
          aria-label="view selection"
        >
          {views.map((v) => (
            <ToggleButton key={v.key} value={v.key} aria-label={v.label}>
              {v.icon}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
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
