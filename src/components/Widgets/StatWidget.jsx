import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  useTheme,
  alpha,
} from "@mui/material";
import { motion } from "framer-motion";

const MotionCard = motion(Card);

export default function StatWidget({
  title,
  value,
  icon,
  color = "primary",
  growth,
}) {
  const theme = useTheme();
  const bgColor = theme.palette[color].main;
  const textColor = theme.palette[color].contrastText;
  const shadowColor = alpha(theme.palette[color].dark, 0.35);

  return (
    <MotionCard
      whileHover={{
        scale: 1.045,
        boxShadow: `0 8px 32px 0 ${shadowColor}`,
        y: -2,
      }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
      elevation={0}
      sx={{
        background: `linear-gradient(120deg, ${bgColor} 70%, ${alpha(
          bgColor,
          0.7
        )} 100%)`,
        color: textColor,
        borderRadius: 5,
        minWidth: 260,
        flex: 1,
        boxShadow: `0 6px 32px 0 ${shadowColor}`,
        overflow: "hidden",
        position: "relative",
        border: `1.5px solid ${alpha(textColor, 0.08)}`,
        backdropFilter: "blur(2.5px)",
        transition: "box-shadow 0.3s, border 0.3s",
      }}
    >
      {/* Decorative floating gradient circle */}
      <Box
        sx={{
          position: "absolute",
          right: -36,
          top: -36,
          width: 100,
          height: 100,
          background: `radial-gradient(circle at 60% 40%, ${alpha(
            textColor,
            0.1
          )} 0%, transparent 80%)`,
          borderRadius: "50%",
          zIndex: 0,
        }}
      />
      {/* Subtle bottom bar accent */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: 6,
          background: `linear-gradient(90deg, ${alpha(
            theme.palette[color].dark,
            0.18
          )} 0%, transparent 100%)`,
          zIndex: 1,
        }}
      />
      <CardContent sx={{ position: "relative", zIndex: 2, p: 3 }}>
        <Stack direction="row" spacing={2.5} alignItems="center">
          <Box
            sx={{
              fontSize: 40,
              bgcolor: alpha(textColor, 0.13),
              borderRadius: "18px",
              width: 58,
              height: 58,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 2px 12px ${alpha(bgColor, 0.18)}`,
              border: `1.5px solid ${alpha(textColor, 0.09)}`,
              transition: "background 0.2s",
            }}
          >
            {icon}
          </Box>
          <Box>
            <Typography
              variant="body2"
              sx={{
                opacity: 0.85,
                fontWeight: 600,
                letterSpacing: 0.5,
                textTransform: "uppercase",
                fontSize: 13,
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="h3"
              fontWeight={900}
              sx={{
                letterSpacing: 1.5,
                lineHeight: 1.1,
                mt: 0.5,
                fontSize: 32,
                textShadow: `0 2px 8px ${alpha(bgColor, 0.13)}`,
              }}
            >
              {value}
            </Typography>
            {growth !== undefined && (
              <Typography
                variant="caption"
                sx={{
                  opacity: 0.9,
                  fontWeight: 700,
                  color:
                    growth > 0
                      ? theme.palette.success.light
                      : theme.palette.error.light,
                  display: "flex",
                  alignItems: "center",
                  mt: 0.5,
                  letterSpacing: 0.2,
                  fontSize: 13,
                  textShadow: `0 1px 4px ${alpha(bgColor, 0.1)}`,
                }}
              >
                {growth > 0 ? (
                  <Box
                    component="span"
                    sx={{
                      fontWeight: 900,
                      fontSize: 16,
                      mr: 0.5,
                      color: theme.palette.success.main,
                    }}
                  >
                    ↑
                  </Box>
                ) : (
                  <Box
                    component="span"
                    sx={{
                      fontWeight: 900,
                      fontSize: 16,
                      mr: 0.5,
                      color: theme.palette.error.main,
                    }}
                  >
                    ↓
                  </Box>
                )}
                {Math.abs(growth)}%
              </Typography>
            )}
          </Box>
        </Stack>
      </CardContent>
    </MotionCard>
  );
}
