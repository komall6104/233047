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
  Pagination,
  Button,
  Stack,
} from '@mui/material';
import NotificationCard from '../components/NotificationCard';
import { fetchNotifications, markNotificationAsRead, markNotificationAsUnread } from '../services/notificationService';

const AllNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [typeFilter, setTypeFilter] = useState('all');
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadNotifications();
  }, [typeFilter, limit, currentPage]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data = await fetchNotifications(
        limit,
        currentPage - 1,
        typeFilter === 'all' ? null : typeFilter
      );
      setNotifications(data);
      // Calculate total pages (assuming API returns ~100 items max for now)
      setTotalPages(Math.ceil(100 / limit) || 1);
    } catch (error) {
      console.error('Error loading notifications:', error);
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
    setCurrentPage(1);
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
          All Notifications
        </Typography>

        <Stack
          spacing={2}
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr auto' },
            gap: 2,
          }}
        >
          <FormControl size="small">
            <InputLabel>Type</InputLabel>
            <Select
              value={typeFilter}
              label="Type"
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <MenuItem value="all">All Types</MenuItem>
              <MenuItem value="placement">Placement</MenuItem>
              <MenuItem value="result">Result</MenuItem>
              <MenuItem value="event">Event</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small">
            <InputLabel>Limit</InputLabel>
            <Select
              value={limit}
              label="Limit"
              onChange={(e) => {
                setLimit(e.target.value);
                setCurrentPage(1);
              }}
            >
              <MenuItem value={5}>5 per page</MenuItem>
              <MenuItem value={10}>10 per page</MenuItem>
              <MenuItem value={20}>20 per page</MenuItem>
              <MenuItem value={50}>50 per page</MenuItem>
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
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : notifications.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="textSecondary">
            No notifications found
          </Typography>
        </Box>
      ) : (
        <>
          <Box sx={{ mb: 3 }}>
            {notifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onMarkRead={handleMarkRead}
                onMarkUnread={handleMarkUnread}
              />
            ))}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(e, value) => setCurrentPage(value)}
              color="primary"
              size="small"
              sx={{
                '& .MuiPaginationItem-root': {
                  fontSize: { xs: '12px', sm: '14px' },
                },
              }}
            />
          </Box>
        </>
      )}
    </Container>
  );
};

export default AllNotifications;
