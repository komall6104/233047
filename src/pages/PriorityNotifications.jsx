import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Stack,
} from '@mui/material';
import NotificationCard from '../components/NotificationCard';
import { getPriorityNotifications, markNotificationAsRead, markNotificationAsUnread } from '../services/notificationService';

const PriorityNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    loadNotifications();
  }, [limit]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data = await getPriorityNotifications(limit);
      setNotifications(data);
    } catch (error) {
      console.error('Error loading priority notifications:', error);
    }
    setLoading(false);
  };

  const handleMarkRead = (id) => {
    markNotificationAsRead(id);
    setNotifications(
      notifications.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const handleMarkUnread = (id) => {
    markNotificationAsUnread(id);
    setNotifications(
      notifications.map((notif) => (notif.id === id ? { ...notif, read: false } : notif))
    );
  };

  const handleRefresh = () => {
    loadNotifications();
  };

  return (
    <Container maxWidth="md" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 3,
            fontSize: { xs: '24px', sm: '32px' },
          }}
        >
          Priority Inbox
        </Typography>

        <Stack
          spacing={2}
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr auto' },
            gap: 2,
          }}
        >
          <FormControl size="small">
            <InputLabel>Top N Notifications</InputLabel>
            <Select
              value={limit}
              label="Top N Notifications"
              onChange={(e) => setLimit(e.target.value)}
            >
              <MenuItem value={5}>Top 5</MenuItem>
              <MenuItem value={10}>Top 10</MenuItem>
              <MenuItem value={15}>Top 15</MenuItem>
              <MenuItem value={20}>Top 20</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="outlined"
            onClick={handleRefresh}
            sx={{ height: '40px' }}
          >
            Refresh
          </Button>
        </Stack>

        <Box sx={{ mt: 2, p: 2, backgroundColor: '#e3f2fd', borderRadius: 1 }}>
          <Typography variant="caption" sx={{ color: '#1565c0' }}>
            💡 Priority is calculated based on notification type (Placement &gt; Result &gt; Event) and
            recency. Only unread notifications are shown.
          </Typography>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : notifications.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="textSecondary">
            No priority notifications
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, color: '#999' }}>
            All caught up! ✓
          </Typography>
        </Box>
      ) : (
        <Box sx={{ mb: 3 }}>
          {notifications.map((notification, index) => (
            <Box key={notification.id}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 700,
                    color: '#666',
                    minWidth: '30px',
                    textAlign: 'center',
                  }}
                >
                  #{index + 1}
                </Typography>
              </Box>
              <NotificationCard
                notification={notification}
                onMarkRead={handleMarkRead}
                onMarkUnread={handleMarkUnread}
              />
            </Box>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default PriorityNotifications;
