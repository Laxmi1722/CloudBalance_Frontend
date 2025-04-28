
import React, { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Box,
  Link,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { loginSuccess } from '../Redux/AuthSlice';
import { toast } from 'react-toastify';
import Cloudlogo from '../assets/cloudlogo.png'; 
const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    
    toast.dismiss();
    try {
      if (!email || !password) {
        toast.error('❌ Please fill in all fields.');
        return;
      }
      
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/login`, {
        email,
        password,
      });
  

      const { token, email: userEmail, role, name } = response.data;

      if (token) {
        dispatch(loginSuccess({ token, email: userEmail, role, name }));
        toast.success('🎉 Login successful! Redirecting...', { autoClose: 2000 });

        if (role === 'ADMIN') {
          navigate('/home/user-management');
        } else if (role === 'USER') {
          navigate('/home/cost-explorer');
        } else if (role === 'READ_ONLY') {
          navigate('/home/user-management');
        } else {
          navigate('/home');
        }
      }
    } catch (error) {
      if (error.response) {
        
        console.error('Login failed:', error.response.data);
        if (error.response.status === 400 || error.response.status === 401) {
          toast.error('❌ Login failed. Invalid email or password.');
        } else {
          toast.error('❌ Login failed. Invalid email or password.');
        }
      } else if (error.request) {
       
        console.error('No response from server:', error.request);
        toast.error('❌ Could not connect to the server. Please try again later.');
      } else {
      
        console.error('Error during login:', error.message);
        toast.error('❌ An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f9f9f9',
      }}
    >
      <Box
        sx={{
          width: '80%',
          maxWidth: 400,
          padding: 2,
          textAlign: 'center',
        }}
      >
        {/* Logo */}
        <Box
          component="img"
          src={Cloudlogo}
          alt="CloudBalance Logo"
          sx={{
            height: 200, 
          }}
        />

        <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: -5 }}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            variant="outlined"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            fullWidth
            label="Password"
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleTogglePasswordVisibility} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2, mb: 2 }}
          >
            LOGIN
          </Button>

          {message && (
            <Typography variant="body2" color="error" sx={{ mb: 1 }}>
              {message}
            </Typography>
          )}
        </Box>

        <Typography variant="body2" color="textSecondary">
          Have Questions?{' '}
          <Link href="#" underline="hover">
            Talk to our team
          </Link>
        </Typography>
      </Box>

      <footer>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 30 }}>
          CloudBalance © 2025 | All Rights Reserved
        </Typography>
      </footer>
    </Box>
  );
};

export default LoginForm;
