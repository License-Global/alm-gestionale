import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { useNewOrderForm } from '../../context/NewOrderFormContext';

/**
 * Componente per il secondo step - scelta tra nuova attività o modello
 */
const ActivityTypeSelectionStep = () => {
  return (
    <motion.div
      key="step2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      layout
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          my: 3,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
          }}
        >
          <Typography variant="h4" textAlign="center">
            Vuoi scegliere un modello?
          </Typography>
          
          <Typography variant="body1" textAlign="center" color="text.secondary">
            Puoi creare nuove attività da zero oppure utilizzare un modello preimpostato
          </Typography>
        </Box>
      </Box>
    </motion.div>
  );
};

export default ActivityTypeSelectionStep;
