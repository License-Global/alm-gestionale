// src/utils/sendNotification.js
// Utility per creare e inviare una notifica custom in base ai parametri forniti
import { createNotification } from "../services/notificationService";

/**
 * Crea e invia una notifica personalizzata compatibile con la struttura della tabella
 * @param {Object} params - Parametri della notifica
 * @param {string} params.tenant_id - ID tenant destinatario
 * @param {string} params.type - Tipo notifica (es: 'message', 'order', ...)
 * @param {Object} params.payload - Oggetto payload (vedi struttura tabella)
 * @param {boolean} [params.read] - Stato lettura (default: false)
 * @param {string} [params.created_at] - Data creazione (default: ora)
 * @param {string|null} [params.read_at] - Data lettura (default: null)
 * @returns {Promise<Object>} La notifica creata
 */
export async function sendNotification({
  tenant_id,
  type,
  payload,
  read = false,
  created_at = new Date().toISOString(),
  read_at = null,
}) {
  if (!tenant_id || !type || !payload) {
    throw new Error("tenant_id, type e payload sono obbligatori");
  }
  return await createNotification({
    tenant_id,
    type,
    payload,
    read,
    created_at,
    read_at,
  });
}
