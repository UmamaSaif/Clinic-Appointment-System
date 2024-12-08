import React from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import { useQuery } from 'react-query';
import {
  People as PeopleIcon,
  Today as TodayIcon,
  LocalHospital as DoctorIcon
} from '@mui/icons-material';

const StatCard = ({ title, value, icon }) => (
  <Paper
    elevation={3}
    sx={{
      p: 3,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      height: '100%',
      minHeight: 160
    }}
  >
    {icon}
    <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
      {title}
    </Typography>
    <Typography variant="h3">
      {value}
    </Typography>
  </Paper>
);

const Dashboard = () => {
  // These would normally come from API calls
  const stats = [
    { 
      title: 'Total Patients',
      value: '150',
      icon: <PeopleIcon sx={{ fontSize: 40, color: 'primary.main' }} />
    },
    {
      title: "Today's Appointments",
      value: '25',
      icon: <TodayIcon sx={{ fontSize: 40, color: 'secondary.main' }} />
    },
    {
      title: 'Active Doctors',
      value: '8',
      icon: <DoctorIcon sx={{ fontSize: 40, color: 'success.main' }} />
    }
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;