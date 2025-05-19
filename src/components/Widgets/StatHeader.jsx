import React from "react";
import { Box, Stack } from "@mui/material";
import {
  TrendingUp,
  PeopleAlt,
  ShoppingCart,
  MonetizationOn,
} from "@mui/icons-material";
import StatWidget from "./StatWidget";

export default function StatHeader() {
  return (
    <Box sx={{ mb: 4 }}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <StatWidget
          title="Utenti Registrati"
          value="1.245"
          growth={4.5}
          icon={<PeopleAlt />}
          color="primary"
        />
        <StatWidget
          title="Ordini"
          value="856"
          growth={-2.3}
          icon={<ShoppingCart />}
          color="secondary"
        />
        <StatWidget
          title="Fatturato"
          value="€12.430"
          growth={8.9}
          icon={<MonetizationOn />}
          color="success"
        />
        <StatWidget
          title="Traffico"
          value="18.920"
          growth={1.7}
          icon={<TrendingUp />}
          color="info"
        />
      </Stack>
    </Box>
  );
}
