import React from 'react';
import { Box, Typography, Card, CardContent, alpha } from '@mui/material';
import { motion } from 'framer-motion';
import { useNewOrderForm } from '../../context/NewOrderFormContext';
import theme from '../../theme';

/**
 * Componente per la selezione del modello di attività
 */
const TemplateSelectionStep = ({ activitiesSchemes }) => {
  const { actions } = useNewOrderForm();

  const MotionCard = motion(Card);

  const handleSchemaSelection = (schema) => {
    actions.setSelectedSchema(schema);
    actions.setFormStep(5);
  };

  return (
    <motion.div
      key="step4"
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
            width: '100%',
          }}
        >
          <Typography variant="h4" textAlign="center" sx={{ mb: 4 }}>
            Seleziona un modello
          </Typography>
          
          <Box 
            sx={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 3,
              width: '100%',
              maxWidth: '1200px',
            }}
          >
            {activitiesSchemes.map((schema, index) => (
              <motion.div
                key={schema.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <MotionCard
                  onClick={() => handleSchemaSelection(schema)}
                  whileHover={{
                    y: -5,
                    boxShadow: theme.shadows[4] || '0px 4px 10px rgba(0,0,0,0.2)',
                  }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  sx={{
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    overflow: 'hidden',
                    boxShadow: theme.shadows[1],
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                    cursor: 'pointer',
                    height: '100%',
                    '&:hover': {
                      borderColor: theme.palette.primary.main,
                    },
                  }}
                >
                  <CardContent
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      py: 4,
                      px: 3,
                      height: '100%',
                      '&:last-child': { pb: 4 },
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: 'text.primary',
                        textAlign: 'center',
                        fontStyle: 'italic',
                      }}
                    >
                      {schema.schemaName}
                    </Typography>
                    
                    {schema.description && (
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'text.secondary',
                          textAlign: 'center',
                          mt: 1,
                        }}
                      >
                        {schema.description}
                      </Typography>
                    )}
                  </CardContent>
                </MotionCard>
              </motion.div>
            ))}
          </Box>
          
          {activitiesSchemes.length === 0 && (
            <Typography variant="body1" color="text.secondary" textAlign="center">
              Nessun modello disponibile
            </Typography>
          )}
        </Box>
      </Box>
    </motion.div>
  );
};

export default TemplateSelectionStep;
