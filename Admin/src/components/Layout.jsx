import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  LocalHospital as ClinicIcon,
  Notifications as ReminderIcon,
  VideoLibrary as VideoIcon,
  ExitToApp as LogoutIcon,
  Person as FrontDeskIcon
} from '@mui/icons-material';

const drawerWidth = 240;

const Layout = () => {
  const navigate = useNavigate();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Front Desk', icon: <FrontDeskIcon />, path: '/front-desk' },
    { text: 'Patients', icon: <PeopleIcon />, path: '/patients' },
    { text: 'Clinics', icon: <ClinicIcon />, path: '/clinics' },
    { text: 'Reminders', icon: <ReminderIcon />, path: '/reminders' },
    { text: 'Video Links', icon: <VideoIcon />, path: '/video-links' }
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh',
      bgcolor: '#f5f5f5'  // Light grey background
    }}>
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: '#1976d2'  // Primary blue color
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Click Appointment System
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            borderRight: '1px solid rgba(0, 0, 0, 0.12)',
          },
        }}
      >
        <Toolbar /> {/* Spacer for AppBar */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          height: 'calc(100% - 64px)' // Full height minus toolbar
        }}>
          <List sx={{ flexGrow: 1 }}>
            {menuItems.map((item) => (
              <ListItem 
                button 
                key={item.text} 
                onClick={() => navigate(item.path)}
                sx={{
                  py: 1.5,  // More vertical padding
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.08)',
                  },
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(25, 118, 210, 0.12)',
                  }
                }}
              >
                <ListItemIcon sx={{ color: 'primary.main' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
          <List> {/* Logout at bottom */}
            <ListItem 
              button 
              onClick={handleLogout}
              sx={{
                py: 1.5,
                borderTop: '1px solid rgba(0, 0, 0, 0.12)',
                '&:hover': {
                  backgroundColor: 'rgba(211, 47, 47, 0.08)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'error.main' }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" sx={{ color: 'error.main' }} />
            </ListItem>
          </List>
        </Box>
      </Drawer>
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1,
          p: 3,
          width: `calc(100% - ${drawerWidth}px)`,
          minHeight: '100vh',
          bgcolor: '#f5f5f5'
        }}
      >
        <Toolbar /> {/* Spacer for AppBar */}
        <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;