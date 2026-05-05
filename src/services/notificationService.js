/**
 * Notification Service
 * Fetches notifications from the API and manages local state
 */

const API_BASE_URL = 'http://20.207.122.201/evaluation-service/notifications';

// Local cache for notifications
let localNotificationState = new Map();

/**
 * Fetch notifications from API with optional filters
 * 
 * @param {number} limit - Maximum number of notifications to return (default: 10)
 * @param {number} page - Page number for pagination (default: 0)
 * @param {string} notificationType - Filter by notification type
 * @returns {Promise<Array>} Array of notifications
 */
export async function fetchNotifications(limit = 10, page = 0, notificationType = null) {
  try {
    let url = `${API_BASE_URL}?limit=${limit}&page=${page}`;
    if (notificationType && notificationType !== 'all') {
      url += `&notification_type=${notificationType}`;
    }
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Process notifications - add read status from local cache
    const notifications = Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []);
    
    return notifications.map(notif => ({
      ...notif,
      read: localNotificationState.get(notif.id) || false
    }));
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
}

/**
 * Get priority notifications (unread, sorted by priority)
 * 
 * @param {number} limit - Maximum number of notifications to return (default: 10)
 * @returns {Promise<Array>} Array of priority notifications
 */
export async function getPriorityNotifications(limit = 10) {
  try {
    const notifications = await fetchNotifications(limit * 2, 0);
    
    // Filter unread and sort by priority (based on weight hierarchy and recency)
    return notifications
      .filter(n => !n.read)
      .sort((a, b) => {
        // Weight priority: placement > result > event
        const weightMap = { placement: 3, result: 2, event: 1 };
        const weightDiff = (weightMap[b.type] || 0) - (weightMap[a.type] || 0);
        if (weightDiff !== 0) return weightDiff;
        
        // If same weight, sort by recency (newer first)
        return new Date(b.timestamp || 0) - new Date(a.timestamp || 0);
      })
      .slice(0, limit);
  } catch (error) {
    console.error('Error getting priority notifications:', error);
    return [];
  }
}

/**
 * Mark notification as read
 * 
 * @param {number} id - Notification ID
 */
export function markNotificationAsRead(id) {
  localNotificationState.set(id, true);
}

/**
 * Mark notification as unread
 * 
 * @param {number} id - Notification ID
 */
export function markNotificationAsUnread(id) {
  localNotificationState.set(id, false);
}
