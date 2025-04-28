
import React from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom'; 

const Submit = () => {
  const navigate = useNavigate(); 

  const handleGoToDashboard = () => {
    navigate("/home/user-management"); 
  };

  return (
    <Box textAlign="center" p={4}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Submitted Successfully!
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Your onboarding process has been completed successfully.
      </Typography>

      <Stack direction="row" justifyContent="center" spacing={2} mt={4}>
        <Button variant="contained" onClick={handleGoToDashboard}>
          Go to IAM Role Page
        </Button>
      </Stack>
    </Box>
  );
};

export default Submit;