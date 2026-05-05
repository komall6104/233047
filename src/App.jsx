import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Container, Box, Button, Typography } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AllNotifications from './pages/AllNotifications';
import PriorityNotifications from './pages/PriorityNotifications';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
            <Toolbar sx={{ display: 'flex', gap: 2 }}>
              <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
                📬 Notification System
              </Typography>
              <Button
                color="inherit"
                component={Link}
                to="/priority"
                sx={{
                  textTransform: 'none',
                  fontSize: '16px',
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
                }}
              >
                Priority Inbox
              </Button>
              <Button
                color="inherit"
                component={Link}
                to="/all"
                sx={{
                  textTransform: 'none',
                  fontSize: '16px',
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
                }}
              >
                All Notifications
              </Button>
            </Toolbar>
          </AppBar>

          <Container maxWidth="lg" sx={{ flex: 1, py: 2 }}>
            <Routes>
              <Route path="/priority" element={<PriorityNotifications />} />
              <Route path="/all" element={<AllNotifications />} />
              <Route path="/" element={<PriorityNotifications />} />
            </Routes>
          </Container>

          <Box
            sx={{
              backgroundColor: '#f5f5f5',
              textAlign: 'center',
              py: 2,
              mt: 4,
              borderTop: '1px solid #ddd',
            }}
          >
            <Typography variant="caption" sx={{ color: '#999' }}>
              Campus Notification System • Last updated: {new Date().toLocaleString()}
            </Typography>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
