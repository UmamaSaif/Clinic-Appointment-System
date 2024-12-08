import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
} from '@mui/material';
import { login, googleLogin } from '../services/authService';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      console.log('Google response:', credentialResponse);
      await googleLogin(credentialResponse.credential);
      navigate('/dashboard');
    } catch (err) {
      console.error('Google login error:', err);
      setError(err.response?.data?.message || 'Google login failed');
    }
  };

  const handleGoogleError = () => {
    console.error('Google Sign In was unsuccessful');
    setError('Google login failed. Please try again.');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#1f1f1f',
        position: 'fixed',
        top: 0,
        left: 0,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: '400px',
          p: 4,
          bgcolor: 'white',
          borderRadius: 1,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            mb: 3,
            color: '#333',
            fontWeight: 400,
          }}
        >
          Admin Login
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{
              bgcolor: '#f5f5f5',
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'transparent',
                },
                '&:hover fieldset': {
                  borderColor: 'transparent',
                },
              },
            }}
            placeholder="example@example.com"
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={{
              bgcolor: '#f5f5f5',
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'transparent',
                },
                '&:hover fieldset': {
                  borderColor: 'transparent',
                },
              },
            }}
            placeholder="••••••••"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 1,
              mb: 2,
              py: 1.5,
              bgcolor: '#1976d2',
              '&:hover': {
                bgcolor: '#1565c0',
              },
            }}
          >
            LOGIN
          </Button>
        </Box>

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center',
          mt: 1 
        }}>
          <GoogleLogin
            clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            size="large"
            text="signin_with"
            shape="rectangular"
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;