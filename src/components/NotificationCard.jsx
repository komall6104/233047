import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Chip,
  Box,
  IconButton,
} from '@mui/material';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';

const NotificationCard = ({ notification, onMarkRead, onMarkUnread }) => {
  const getTypeColor = (type) => {
    const typeColors = {
      placement: '#4CAF50',
      result: '#2196F3',
      event: '#FF9800',
    };
    return typeColors[type] || '#757575';
  };

  const getTypeLabel = (type) => {
    const labels = {
      placement: 'Placement',
      result: 'Result',
      event: 'Event',
    };
    return labels[type] || 'Notification';
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card
      sx={{
        mb: 2,
        borderLeft: `5px solid ${getTypeColor(notification.type)}`,
        opacity: notification.read ? 0.7 : 1,
        backgroundColor: notification.read ? '#f5f5f5' : '#ffffff',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: 4,
          transform: 'translateY(-2px)',
        },
      }}
    >
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: notification.read ? 400 : 600,
                fontSize: { xs: '14px', sm: '16px', md: '18px' },
              }}
            >
              {notification.title}
            </Typography>
            {!notification.read && (
              <Chip
                label="New"
                size="small"
                color="primary"
                variant="filled"
                sx={{ height: '20px', fontSize: '12px' }}
              />
            )}
          </Box>
        }
        subheader={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
            <Chip
              label={getTypeLabel(notification.type)}
              size="small"
              sx={{
                backgroundColor: getTypeColor(notification.type),
                color: 'white',
                fontSize: '12px',
              }}
            />
            <Typography variant="caption" sx={{ color: '#666' }}>
              {formatTime(notification.timestamp)}
            </Typography>
          </Box>
        }
        action={
          <IconButton
            size="small"
            onClick={() =>
              notification.read ? onMarkUnread(notification.id) : onMarkRead(notification.id)
            }
            title={notification.read ? 'Mark as unread' : 'Mark as read'}
          >
            {notification.read ? <MarkEmailUnreadIcon /> : <MarkEmailReadIcon />}
          </IconButton>
        }
        sx={{ pb: 1 }}
      />
      <CardContent sx={{ pt: 0 }}>
        <Typography
          variant="body2"
          sx={{
            color: '#555',
            fontSize: { xs: '13px', sm: '14px' },
            lineHeight: 1.6,
          }}
        >
          {notification.message}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default NotificationCard;
