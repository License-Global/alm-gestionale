import React from 'react';
import {
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment,
} from '@mui/material';
import { Inventory2, Construction } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';
import { motion } from 'framer-motion';
import { useNewOrderForm } from '../../context/NewOrderFormContext';
import { useFormValidation } from '../../hooks/useFormValidation';

/**
 * Componente per il primo step del form - dati principali della commessa
 */
const OrderDetailsStep = ({ customersList, personale }) => {
  const { state, actions } = useNewOrderForm();
  const { validationErrors, touched, validateField } = useFormValidation();

  const handleFieldChange = async (field, value) => {
    actions.updateField(field, value);
    await validateField(field, value);
  };

  const handleFieldBlur = async (field) => {
    await validateField(field, state[field]);
  };

  return (
    <motion.div
      key="step1"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      layout
    >
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {/* Nome commessa */}
        <Grid item xs={12} sm={4}>
          <TextField
            id="orderName"
            name="orderName"
            fullWidth
            label="Nome commessa"
            required
            value={state.orderName}
            onChange={(e) => handleFieldChange('orderName', e.target.value)}
            onBlur={() => handleFieldBlur('orderName')}
            error={touched.orderName && Boolean(validationErrors.orderName)}
            helperText={touched.orderName && validationErrors.orderName}
          />
        </Grid>

        {/* Cliente */}
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel id="clientId">Cliente</InputLabel>
            <Select
              fullWidth
              id="clientId"
              name="clientId"
              label="Cliente"
              value={state.clientId}
              onChange={(e) => handleFieldChange('clientId', e.target.value)}
              onBlur={() => handleFieldBlur('clientId')}
              error={touched.clientId && Boolean(validationErrors.clientId)}
            >
              {customersList.map((customer) => (
                <MenuItem key={customer.id} value={customer.id}>
                  {customer.label}
                </MenuItem>
              ))}
            </Select>
            {touched.clientId && validationErrors.clientId && (
              <div style={{ color: 'red', fontSize: '0.75rem', marginTop: '3px', marginLeft: '14px' }}>
                {validationErrors.clientId}
              </div>
            )}
          </FormControl>
        </Grid>

        {/* Data inizio */}
        <Grid item xs={12} sm={4}>
          <DatePicker
            id="startDate"
            name="startDate"
            disablePast
            sx={{ width: '100%' }}
            label="Inizio commessa"
            value={state.startDate}
            onChange={(value) => handleFieldChange('startDate', value)}
            onError={(error) => {
              if (error) {
                handleFieldChange('startDate', null);
              }
            }}
            slotProps={{
              textField: {
                error: touched.startDate && Boolean(validationErrors.startDate),
                helperText: touched.startDate && validationErrors.startDate,
                onBlur: () => handleFieldBlur('startDate'),
              },
            }}
          />
        </Grid>

        {/* Data fine */}
        <Grid item xs={12} sm={4}>
          <DatePicker
            id="endDate"
            name="endDate"
            disablePast
            minDate={state.startDate}
            sx={{ width: '100%' }}
            label="Fine commessa"
            value={state.endDate}
            onChange={(value) => handleFieldChange('endDate', value)}
            onError={(error) => {
              if (error) {
                handleFieldChange('endDate', null);
              }
            }}
            slotProps={{
              textField: {
                error: touched.endDate && Boolean(validationErrors.endDate),
                helperText: touched.endDate && validationErrors.endDate,
                onBlur: () => handleFieldBlur('endDate'),
              },
            }}
          />
        </Grid>

        {/* Scaffale accessori */}
        <Grid item xs={12} sm={4}>
          <TextField
            id="accessories"
            name="accessories"
            fullWidth
            label="Scaffale accessori"
            value={state.accessories}
            onChange={(e) => handleFieldChange('accessories', e.target.value)}
            onBlur={() => handleFieldBlur('accessories')}
            error={touched.accessories && Boolean(validationErrors.accessories)}
            helperText={touched.accessories && validationErrors.accessories}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Construction />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Grid>

        {/* Scaffale materiale */}
        <Grid item xs={12} sm={4}>
          <TextField
            id="materialShelf"
            name="materialShelf"
            fullWidth
            label="Scaffale materiale"
            value={state.materialShelf}
            onChange={(e) => handleFieldChange('materialShelf', e.target.value)}
            onBlur={() => handleFieldBlur('materialShelf')}
            error={touched.materialShelf && Boolean(validationErrors.materialShelf)}
            helperText={touched.materialShelf && validationErrors.materialShelf}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Inventory2 />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        {/* Priorità */}
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="orderPriority-label">Priorità</InputLabel>
            <Select
              id="urgency"
              name="urgency"
              labelId="orderPriority-label"
              required
              label="Priorità"
              value={state.urgency}
              onChange={(e) => handleFieldChange('urgency', e.target.value)}
              onBlur={() => handleFieldBlur('urgency')}
              error={touched.urgency && Boolean(validationErrors.urgency)}
            >
              <MenuItem value="Urgente">Urgente</MenuItem>
              <MenuItem value="Alta">Alta</MenuItem>
              <MenuItem value="Media">Media</MenuItem>
              <MenuItem value="Bassa">Bassa</MenuItem>
            </Select>
            {touched.urgency && validationErrors.urgency && (
              <div style={{ color: 'red', fontSize: '0.75rem', marginTop: '3px', marginLeft: '14px' }}>
                {validationErrors.urgency}
              </div>
            )}
          </FormControl>
        </Grid>

        {/* Responsabile */}
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="orderManager-label">Responsabile</InputLabel>
            <Select
              id="orderManager"
              name="orderManager"
              required
              labelId="orderManager-label"
              label="Responsabile"
              value={state.orderManager}
              onChange={(e) => handleFieldChange('orderManager', e.target.value)}
              onBlur={() => handleFieldBlur('orderManager')}
              error={touched.orderManager && Boolean(validationErrors.orderManager)}
            >
              {personale.map((worker, index) => (
                <MenuItem key={index} value={worker.id}>
                  {worker.workerName}
                </MenuItem>
              ))}
            </Select>
            {touched.orderManager && validationErrors.orderManager && (
              <div style={{ color: 'red', fontSize: '0.75rem', marginTop: '3px', marginLeft: '14px' }}>
                {validationErrors.orderManager}
              </div>
            )}
          </FormControl>
        </Grid>
      </Grid>
    </motion.div>
  );
};

export default OrderDetailsStep;
