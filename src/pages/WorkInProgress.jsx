import React from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Stack,
  Chip,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Construction as ConstructionIcon,
  Schedule as ScheduleIcon,
  Rocket as RocketIcon,
  AutoFixHigh as SparkleIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";

const MotionPaper = motion(Paper);
const MotionBox = motion(Box);

const WorkInProgress = () => {
  const theme = useTheme();

  // Animazioni per i componenti
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const sparkleVariants = {
    animate: {
      rotate: [0, 360],
      scale: [1, 1.2, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, 
          ${alpha(theme.palette.primary.main, 0.1)} 0%, 
          ${alpha(theme.palette.secondary.main, 0.1)} 50%, 
          ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Elementi decorativi di sfondo */}
      <MotionBox
        variants={floatingVariants}
        animate="animate"
        sx={{
          position: "absolute",
          top: "20%",
          left: "10%",
          opacity: 0.1,
        }}
      >
        <ConstructionIcon
          sx={{ fontSize: 120, color: theme.palette.primary.main }}
        />
      </MotionBox>

      <MotionBox
        variants={sparkleVariants}
        animate="animate"
        sx={{
          position: "absolute",
          top: "10%",
          right: "15%",
          opacity: 0.15,
        }}
      >
        <SparkleIcon
          sx={{ fontSize: 80, color: theme.palette.secondary.main }}
        />
      </MotionBox>

      <MotionBox
        variants={floatingVariants}
        animate="animate"
        sx={{
          position: "absolute",
          bottom: "15%",
          right: "20%",
          opacity: 0.1,
          animationDelay: "1s",
        }}
      >
        <RocketIcon sx={{ fontSize: 100, color: theme.palette.primary.main }} />
      </MotionBox>

      <Container maxWidth="md">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <MotionPaper
            variants={itemVariants}
            elevation={20}
            sx={{
              p: { xs: 4, md: 6 },
              borderRadius: 4,
              textAlign: "center",
              position: "relative",
              background: `linear-gradient(145deg, 
                ${theme.palette.background.paper} 0%, 
                ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
              backdropFilter: "blur(10px)",
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            }}
          >
            <Stack spacing={4} alignItems="center">
              {/* Icona principale con animazione */}
              <MotionBox
                variants={floatingVariants}
                animate="animate"
                sx={{
                  background: `linear-gradient(135deg, 
                    ${theme.palette.primary.main} 0%, 
                    ${theme.palette.secondary.main} 100%)`,
                  borderRadius: "50%",
                  p: 3,
                  boxShadow: `0 8px 32px ${alpha(
                    theme.palette.primary.main,
                    0.3
                  )}`,
                }}
              >
                <ConstructionIcon
                  sx={{
                    fontSize: 80,
                    color: "white",
                  }}
                />
              </MotionBox>

              {/* Titolo principale */}
              <motion.div variants={itemVariants}>
                <Typography
                  variant="h2"
                  component="h1"
                  sx={{
                    fontWeight: 700,
                    background: `linear-gradient(135deg, 
                      ${theme.palette.primary.main} 0%, 
                      ${theme.palette.secondary.main} 100%)`,
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    mb: 2,
                    fontSize: { xs: "2.5rem", md: "3.5rem" },
                  }}
                >
                  Lavori in Corso
                </Typography>
              </motion.div>

              {/* Sottotitolo */}
              <motion.div variants={itemVariants}>
                <Typography
                  variant="h5"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontWeight: 400,
                    mb: 3,
                    fontSize: { xs: "1.2rem", md: "1.5rem" },
                  }}
                >
                  Questa pagina sta prendendo vita...
                </Typography>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Typography
                  variant="body1"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: "1.1rem",
                    lineHeight: 1.8,
                    maxWidth: 600,
                    mb: 4,
                  }}
                >
                  Stiamo lavorando per completare questa sezione. Torna presto
                  per scoprire nuovi contenuti e aggiornamenti.
                </Typography>
              </motion.div>

              {/* Chips informativi */}
              <motion.div variants={itemVariants}>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  alignItems="center"
                >
                  <Chip
                    icon={<ScheduleIcon />}
                    label="In Sviluppo"
                    variant="outlined"
                    sx={{
                      borderColor: theme.palette.primary.main,
                      color: theme.palette.primary.main,
                      fontWeight: 600,
                      px: 2,
                      py: 1,
                      "& .MuiChip-icon": {
                        color: theme.palette.primary.main,
                      },
                    }}
                  />
                  <Chip
                    icon={<RocketIcon />}
                    label="Presto Disponibile"
                    variant="filled"
                    sx={{
                      background: `linear-gradient(135deg, 
                        ${theme.palette.primary.main} 0%, 
                        ${theme.palette.secondary.main} 100%)`,
                      color: "white",
                      fontWeight: 600,
                      px: 2,
                      py: 1,
                      "& .MuiChip-icon": {
                        color: "white",
                      },
                    }}
                  />
                </Stack>
              </motion.div>

              {/* Barra di progresso stilizzata */}
              {/* <motion.div variants={itemVariants} style={{ width: "100%" }}>
                <Box sx={{ mt: 4, mb: 2 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.text.secondary,
                      mb: 2,
                      fontWeight: 500,
                    }}
                  >
                    Progresso sviluppo
                  </Typography>
                  <Box
                    sx={{
                      width: "100%",
                      height: 8,
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      borderRadius: 4,
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "75%" }}
                      transition={{ duration: 2, delay: 1.5, ease: "easeOut" }}
                      style={{
                        height: "100%",
                        background: `linear-gradient(90deg, 
                          ${theme.palette.primary.main} 0%, 
                          ${theme.palette.secondary.main} 100%)`,
                        borderRadius: 4,
                        position: "relative",
                      }}
                    />
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: theme.palette.text.secondary,
                      mt: 1,
                      display: "block",
                    }}
                  >
                    75% completato
                  </Typography>
                </Box>
              </motion.div> */}
            </Stack>
          </MotionPaper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default WorkInProgress;
