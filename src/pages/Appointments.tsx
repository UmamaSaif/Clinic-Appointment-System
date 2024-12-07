import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Typography,
  MenuItem,
  Paper,
  Autocomplete,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Doctor, Appointment, SearchCriteria, AppointmentFormData } from '../types/appointment';
import { searchDoctors, getAllDoctors } from '../services/doctorService';
import { fetchAppointments, createAppointment } from '../services/appointmentService';

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [loading, setLoading] = useState(false);
  
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>({
    name: '',
    specialty: '',
    availableDate: '',
    availableTime: ''
  });

  const [formData, setFormData] = useState<AppointmentFormData>({
    doctorId: '',
    date: '',
    symptoms: '',
    consultationType: 'in-person',
    additionalDetails: ''
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [appointmentsData, doctorsData] = await Promise.all([
        fetchAppointments(),
        getAllDoctors()
      ]);
      setAppointments(appointmentsData);
      setDoctors(doctorsData);
    } catch (error) {
      console.error('Error loading initial data:', error);
      showSnackbar('Error loading data. Please refresh the page.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDoctorSearch = async () => {
    setLoading(true);
    try {
      const searchParams: Record<string, string> = {};
      if (searchCriteria.name) searchParams.name = searchCriteria.name;
      if (searchCriteria.specialty) searchParams.specialty = searchCriteria.specialty;
      if (searchCriteria.availableDate) searchParams.date = searchCriteria.availableDate;

      const doctorsData = await searchDoctors(searchParams);
      setDoctors(doctorsData);
      
      if (doctorsData.length === 0) {
        showSnackbar('No doctors found. Please try different search criteria.', 'error');
      }
    } catch (error) {
      console.error('Error searching doctors:', error);
      showSnackbar('Error searching doctors. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.doctorId || !formData.date || !formData.symptoms) {
      showSnackbar('Please fill in all required fields', 'error');
      return;
    }

    setLoading(true);
    try {
      await createAppointment(formData);
      showSnackbar('Appointment booked successfully', 'success');
      
      setOpenDialog(false);
      const updatedAppointments = await fetchAppointments();
      setAppointments(updatedAppointments);
      
      setFormData({
        doctorId: '',
        date: '',
        symptoms: '',
        consultationType: 'in-person',
        additionalDetails: ''
      });
    } catch (error: any) {
      console.error('Error creating appointment:', error);
      showSnackbar(
        error.response?.data?.message || 'Failed to book appointment. Please try again.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const columns: GridColDef[] = [
    {
      field: 'doctor',
      headerName: 'Doctor',
      flex: 1,
      valueGetter: (params) => params.row.doctor?.name || 'N/A'
    },
    {
      field: 'date',
      headerName: 'Date & Time',
      flex: 1,
      valueGetter: (params) => new Date(params.row.date).toLocaleString()
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      valueGetter: (params) => params.row.status.charAt(0).toUpperCase() + params.row.status.slice(1)
    },
    {
      field: 'queueNumber',
      headerName: 'Queue Number',
      flex: 1
    },
    {
      field: 'consultationType',
      headerName: 'Consultation Type',
      flex: 1,
      valueGetter: (params) => 
        params.row.consultationType?.charAt(0).toUpperCase() + 
        params.row.consultationType?.slice(1).replace('-', ' ') || 'N/A'
    }
  ];

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4">Appointments</Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenDialog(true)}
            >
              Book New Appointment
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Find a Doctor
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Doctor Name"
                  value={searchCriteria.name}
                  onChange={(e) => setSearchCriteria({
                    ...searchCriteria,
                    name: e.target.value
                  })}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Specialty"
                  value={searchCriteria.specialty}
                  onChange={(e) => setSearchCriteria({
                    ...searchCriteria,
                    specialty: e.target.value
                  })}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  type="date"
                  label="Available Date"
                  InputLabelProps={{ shrink: true }}
                  value={searchCriteria.availableDate}
                  onChange={(e) => setSearchCriteria({
                    ...searchCriteria,
                    availableDate: e.target.value
                  })}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={handleDoctorSearch}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Search Doctors'}
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ height: 400 }}>
            {loading ? (
              <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <CircularProgress />
              </Box>
            ) : (
              <DataGrid
                rows={appointments}
                columns={columns}
                getRowId={(row) => row._id}
                pageSizeOptions={[5, 10, 25]}
                initialState={{
                  pagination: { paginationModel: { pageSize: 5 } },
                }}
              />
            )}
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Book New Appointment</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Autocomplete
                  options={doctors}
                  getOptionLabel={(doctor) => `Dr. ${doctor.name} - ${doctor.specialty}`}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Doctor"
                      required
                      fullWidth
                      error={!formData.doctorId}
                      helperText={!formData.doctorId ? "Please select a doctor" : ""}
                    />
                  )}
                  value={doctors.find(d => d._id === formData.doctorId) || null}
                  onChange={(_, newValue) => {
                    setFormData({ 
                      ...formData, 
                      doctorId: newValue?._id || '' 
                    });
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="datetime-local"
                  label="Date & Time"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="Consultation Type"
                  value={formData.consultationType}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    consultationType: e.target.value 
                  })}
                >
                  <MenuItem value="in-person">In-Person</MenuItem>
                  <MenuItem value="video">Video Consultation</MenuItem>
                  <MenuItem value="phone">Phone Consultation</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Symptoms"
                  value={formData.symptoms}
                  onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Additional Details (Optional)"
                  value={formData.additionalDetails}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    additionalDetails: e.target.value 
                  })}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Book Appointment'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setOpenSnackbar(false)} 
          severity={snackbarSeverity} 
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}