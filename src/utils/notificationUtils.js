// src/utils/notificationUtils.js
// Utility per la gestione avanzata delle notifiche
import {
  updateNotification,
  getNotifications,
} from "../services/notificationService";

/**
 * Segna tutte le notifiche di un utente come lette
 * @param {string} userId
 * @returns {Promise<number>} Numero di notifiche aggiornate
 */
export async function markAllAsRead(userId) {
  const notifications = await getNotifications(userId);
  const unread = notifications.filter((n) => !n.read_at);
  let count = 0;
  for (const notif of unread) {
    await updateNotification(notif.id, { read_at: new Date().toISOString() });
    count++;
  }
  return count;
}

/**
 * Restituisce il numero di notifiche non lette per un utente
 * @param {string} userId
 * @returns {Promise<number>}
 */
export async function getUnreadCount(userId) {
  const notifications = await getNotifications(userId);
  return notifications.filter((n) => !n.read_at).length;
}

/**
 * Restituisce solo le notifiche non scadute
 * @param {Array} notifications
 * @returns {Array}
 */
export function filterValidNotifications(notifications) {
  const now = new Date();
  return notifications.filter(
    (n) => !n.expires_at || new Date(n.expires_at) > now
  );
}

/**
 * Raggruppa le notifiche per tipo
 * @param {Array} notifications
 * @returns {Object}
 */
export function groupNotificationsByType(notifications) {
  return notifications.reduce((acc, n) => {
    acc[n.type] = acc[n.type] || [];
    acc[n.type].push(n);
    return acc;
  }, {});
}

/**
 * Ordina le notifiche per priorità e data
 * @param {Array} notifications
 * @returns {Array}
 */
export function sortNotifications(notifications) {
  const priorityOrder = { high: 0, normal: 1, low: 2 };
  return [...notifications].sort((a, b) => {
    const pa = priorityOrder[a.priority] ?? 1;
    const pb = priorityOrder[b.priority] ?? 1;
    if (pa !== pb) return pa - pb;
    return new Date(b.created_at) - new Date(a.created_at);
  });
}
