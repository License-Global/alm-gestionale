import { useState, useEffect, useCallback } from 'react';
import dayjs from 'dayjs';

/**
 * Hook per la persistenza dello stato del form nel localStorage
 * Gestisce automaticamente la serializzazione/deserializzazione di oggetti complessi come dayjs
 */
export const useFormPersistence = (storageKey, initialValues = {}) => {

  // Serializza i valori per il localStorage, gestendo i tipi speciali
  const serializeValues = useCallback((values) => {
    const serialized = { ...values };
    
    // Gestisce gli oggetti dayjs
    if (serialized.startDate && dayjs.isDayjs(serialized.startDate)) {
      serialized.startDate = serialized.startDate.toISOString();
    }
    if (serialized.endDate && dayjs.isDayjs(serialized.endDate)) {
      serialized.endDate = serialized.endDate.toISOString();
    }
    
    // Gestisce array di attività con date
    if (serialized.activities && Array.isArray(serialized.activities)) {
      serialized.activities = serialized.activities.map(activity => ({
        ...activity,
        startDate: dayjs.isDayjs(activity.startDate) ? activity.startDate.toISOString() : activity.startDate,
        endDate: dayjs.isDayjs(activity.endDate) ? activity.endDate.toISOString() : activity.endDate,
      }));
    }
    
    return serialized;
  }, []);

  // Deserializza i valori dal localStorage, ripristinando i tipi speciali
  const deserializeValues = useCallback((serializedValues) => {
    const values = { ...serializedValues };
    
    // Ripristina gli oggetti dayjs
    if (values.startDate) {
      values.startDate = dayjs(values.startDate);
    }
    if (values.endDate) {
      values.endDate = dayjs(values.endDate);
    }
    
    // Ripristina le date nelle attività
    if (values.activities && Array.isArray(values.activities)) {
      values.activities = values.activities.map(activity => ({
        ...activity,
        startDate: activity.startDate ? dayjs(activity.startDate) : null,
        endDate: activity.endDate ? dayjs(activity.endDate) : null,
      }));
    }
    
    return values;
  }, []);

  // Salva lo stato nel localStorage
  const saveToStorage = useCallback((data) => {
    try {
      const serialized = serializeValues(data);
      localStorage.setItem(storageKey, JSON.stringify(serialized));
    } catch (error) {
      console.warn('Errore nel salvataggio dello stato:', error);
    }
  }, [storageKey, serializeValues]);

  // Carica lo stato dal localStorage
  const loadFromStorage = useCallback(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (!stored) return null;
      
      const parsed = JSON.parse(stored);
      return deserializeValues(parsed);
    } catch (error) {
      console.warn('Errore nel caricamento dello stato:', error);
      return null;
    }
  }, [storageKey, deserializeValues]);

  // Cancella lo stato dal localStorage
  const clearStorage = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.warn('Errore nella cancellazione dello stato:', error);
    }
  }, [storageKey]);

  // Carica lo stato iniziale
  const getInitialState = useCallback(() => {
    const stored = loadFromStorage();
    
    if (stored) {
      // Merge dei valori salvati con quelli iniziali per gestire nuovi campi
      return { ...initialValues, ...stored };
    }
    
    return initialValues;
  }, [loadFromStorage, initialValues]);

  return {
    saveToStorage,
    loadFromStorage,
    clearStorage,
    getInitialState
  };
};
