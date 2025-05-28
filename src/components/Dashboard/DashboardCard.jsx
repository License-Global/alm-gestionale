import React from "react";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Stack,
  Divider,
} from "@mui/material";
import MoreIcon from "@mui/icons-material/MoreVert";
import { motion } from "framer-motion";

const MotionCard = motion(Card);

const DashboardCard = ({
  title,
  icon,
  children,
  showMoreButton = true,
  onMoreClick,
  ...props
}) => {
  return (
    <MotionCard
      elevation={3}
      sx={{ borderRadius: 4, height: "100%" }}
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      {...props}
    >
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={1}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            {icon}
            <Typography variant="subtitle1" fontWeight={600}>
              {title}
            </Typography>
          </Stack>
          {showMoreButton && (
            <IconButton size="small" onClick={onMoreClick}>
              <MoreIcon fontSize="small" />
            </IconButton>
          )}
        </Stack>
        <Divider sx={{ mb: 1.5 }} />
        {children}
      </CardContent>
    </MotionCard>
  );
};

export default DashboardCard;
