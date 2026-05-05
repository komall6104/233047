import { useState, useEffect } from 'react';
import { getTopNotifications, markNotificationAsRead, addNotification, getPriorityStats } from '../services/notificationService';
import './PriorityInbox.css';

export function PriorityInbox() {
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState(null);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    refreshNotifications();
  }, [limit]);

  const refreshNotifications = () => {
    const topNotifications = getTopNotifications(limit);
    setNotifications(topNotifications);
    setStats(getPriorityStats());
  };

  const handleMarkAsRead = (id) => {
    markNotificationAsRead(id);
    refreshNotifications();
  };

  const handleAddNotification = () => {
    const types = ['placement', 'result', 'event'];
    const randomType = types[Math.floor(Math.random() * types.length)];
    const messages = {
      placement: { title: 'New Opportunity', message: 'A new placement opportunity is available' },
      result: { title: 'Result Available', message: 'Your exam results are now available' },
      event: { title: 'Upcoming Event', message: 'An important event is coming up' }
    };
    
    const msg = messages[randomType];
    addNotification({
      type: randomType,
      title: msg.title,
      message: msg.message
    });
    refreshNotifications();
  };

  const getTypeColor = (type) => {
    const colors = {
      placement: '#4CAF50',
      result: '#2196F3',
      event: '#FF9800'
    };
    return colors[type] || '#999';
  };

  const getTypeIcon = (type) => {
    const icons = {
      placement: '💼',
      result: '📋',
      event: '📢'
    };
    return icons[type] || '📬';
  };

  const formatTime = (timestamp) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="priority-inbox">
      <header className="inbox-header">
        <h1>📥 Priority Inbox</h1>
        <p>Top unread notifications sorted by importance and recency</p>
      </header>

      {stats && (
        <div className="stats-section">
          <div className="stat-card">
            <span className="stat-label">Total Unread</span>
            <span className="stat-value">{stats.totalUnread}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">💼 Placements</span>
            <span className="stat-value">{stats.byType.placement}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">📋 Results</span>
            <span className="stat-value">{stats.byType.result}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">📢 Events</span>
            <span className="stat-value">{stats.byType.event}</span>
          </div>
        </div>
      )}

      <div className="controls">
        <select value={limit} onChange={(e) => setLimit(Number(e.target.value))} className="limit-select">
          <option value={5}>Show top 5</option>
          <option value={10}>Show top 10</option>
          <option value={15}>Show top 15</option>
          <option value={20}>Show top 20</option>
        </select>
        <button onClick={handleAddNotification} className="btn-add">+ Add Test Notification</button>
        <button onClick={refreshNotifications} className="btn-refresh">🔄 Refresh</button>
      </div>

      <div className="notifications-list">
        {notifications.length === 0 ? (
          <div className="empty-state">
            <p>🎉 All caught up! No unread notifications.</p>
          </div>
        ) : (
          notifications.map((notification, index) => (
            <div key={notification.id} className="notification-card">
              <div className="notification-rank">
                <span className="rank-number">#{index + 1}</span>
              </div>
              <div className="notification-icon" style={{ backgroundColor: getTypeColor(notification.type) }}>
                {getTypeIcon(notification.type)}
              </div>
              <div className="notification-content">
                <h3 className="notification-title">{notification.title}</h3>
                <p className="notification-message">{notification.message}</p>
                <div className="notification-meta">
                  <span className="notification-type" style={{ borderLeftColor: getTypeColor(notification.type) }}>
                    {notification.type.toUpperCase()}
                  </span>
                  <span className="notification-time">{formatTime(notification.timestamp)}</span>
                </div>
              </div>
              <button
                onClick={() => handleMarkAsRead(notification.id)}
                className="btn-mark-read"
                title="Mark as read"
              >
                ✓
              </button>
            </div>
          ))
        )}
      </div>

      <footer className="inbox-footer">
        <p>Showing {Math.min(limit, notifications.length)} of {notifications.length} unread notifications</p>
      </footer>
    </div>
  );
}
