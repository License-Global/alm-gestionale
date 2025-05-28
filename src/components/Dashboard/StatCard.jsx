import React, { memo } from "react";
import { Card, CardContent, Typography, Grid } from "@mui/material";
import { motion } from "framer-motion";

const MotionCard = motion(Card);

const StatCard = memo(({ stats }) => {
  return (
    <MotionCard
      elevation={3}
      sx={{ borderRadius: 4, height: "100%" }}
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <CardContent>
        <Typography
          variant="subtitle1"
          fontWeight={600}
          gutterBottom
          sx={{ fontSize: { xs: "1rem", md: "1.1rem" } }}
        >
          Statistiche del giorno
        </Typography>
        <Grid container spacing={2}>
          {[
            { label: "Nuove richieste", value: stats.new },
            { label: "Risolte", value: stats.resolved, color: "success.main" },
            { label: "In attesa", value: stats.pending, color: "warning.main" },
            { label: "Rifiutate", value: stats.rejected, color: "error.main" },
          ].map((stat, i) => (
            <Grid item xs={6} key={i}>
              <Typography variant="caption" color="text.secondary">
                {stat.label}
              </Typography>
              <Typography
                variant="h5"
                color={stat.color || "text.primary"}
                sx={{ fontSize: { xs: "1.25rem", md: "1.5rem" } }}
              >
                {stat.value}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </MotionCard>
  );
});

StatCard.displayName = "StatCard";

export default StatCard;
