import React from "react";
import {
  Card,
  CardContent,
  Chip,
  Badge,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import MoreIcon from "@mui/icons-material/MoreVert";
import { motion } from "framer-motion";

const MotionCard = motion(Card);

const WidgetCard = ({ title, icon, badgeContent, children }) => {
  return (
    <MotionCard
      elevation={3}
      sx={{ borderRadius: 4, height: "100%", width: "100%" }}
    >
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack direction="row" spacing={1} alignItems="center">
            {icon && (
              <Badge badgeContent={badgeContent} color="primary">
                {icon}
              </Badge>
            )}
            <Typography variant="subtitle1" fontWeight={600}>
              {title}
            </Typography>
          </Stack>
          <IconButton size="small">
            <MoreIcon fontSize="small" />
          </IconButton>
        </Stack>
        <Divider sx={{ my: 1.5 }} />
        {children}
      </CardContent>
    </MotionCard>
  );
};

export default WidgetCard;
