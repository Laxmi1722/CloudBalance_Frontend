import React from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';

const SummaryStep = ({ onBack }) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Step 3: Review and Submit
      </Typography>
      <Typography variant="body1">
        (Placeholder for reviewing IAM Role and policy data before submitting.)
      </Typography>

      <Stack direction="row" spacing={2} mt={4}>
        <Button variant="outlined" onClick={onBack}>
          Back
        </Button>
        <Button variant="contained" color="success">
          Submit
        </Button>
      </Stack>
    </Box>
  );
};

export default SummaryStep;
