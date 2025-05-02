

import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Link,
  Chip,
  Stack,
  IconButton,
  Snackbar,
  Tooltip,
  InputAdornment,
  Alert,
} from '@mui/material';

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import img1 from '../../assets/img1.png';
import { useSelector, useDispatch } from 'react-redux';
import { updateField } from '../../Redux/OnboardingSlice';
const policy = `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::141263678912:root"
      },
      "Action": "sts:AssumeRole",
      "Condition": {}
    }
  ]
}`;

const roleName = 'CK-Tuner-Role-dev2';

const IAMRoleStep = ({onNext}) => {
    const formData = useSelector((state) => state.onboarding);
    const dispatch = useDispatch();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    
    const [errors, setErrors] = useState({});
    const handleChange = (field, value) => {
      dispatch(updateField({ field, value }));
    };
    
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setSnackbarOpen(true);
  };
  const handleSnackbarClose = () => {
    setSnackbarOpen(false); 
  };
  const validateFields = () => {
    const newErrors = {};
    if (!formData.arn || formData.arn.trim() === '') newErrors.arn = 'Role ARN is required.';
    if (!formData.accountId || formData.accountId.trim() === '') newErrors.accountId = 'Account ID is required.';
    if (!formData.accountName || formData.accountName.trim() === '') newErrors.accountName = 'Account Name is required.';
    if (!formData.accountProvider || formData.accountProvider.trim() === '')
      newErrors.accountProvider = 'Account Provider is required.';
    if (!formData.region || formData.region.trim() === '') newErrors.region = 'Account Region is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; 
  };
  const handleNext = () => {
    if (validateFields()) {
      onNext(); 
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Create an IAM Role
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Create an IAM Role by following these steps
      </Typography>

      <Card variant="outlined">
        <CardContent>
          <Stack spacing={4}>
            {/* Step 1 */}
            <Stack direction="row" spacing={2} alignItems="flex-start">
              <Chip label="1" color="primary" />
              <Typography>
                Log into AWS account &nbsp;
                <Link
                  href="https://console.aws.amazon.com/iam/home#/roles"
                  target="_blank"
                  rel="noopener"
                >
                  Create an IAM Role.
                </Link>
              </Typography>
            </Stack>

            {/* Step 2 */}
            <Stack direction="row" spacing={2} alignItems="flex-start">
              <Chip label="2" color="primary" />
              <Box width="100%">
                <Typography gutterBottom>
                  In the <strong>Trusted entity</strong> type section, select{' '}
                  <strong>Custom trust policy</strong>. Replace the prefilled policy with the policy provided below:
                </Typography>
                <Box
                  sx={{
                    position: 'relative',
                    border: '1px solid #ccc',
                    borderRadius: 2,
                    p: 1,
                    maxHeight: 300,
                    overflow: 'auto',
                    fontFamily: 'monospace',
                    backgroundColor: '#f9f9f9',
                  }}
                >
                  <pre>{policy}</pre>
                  <Tooltip title="Copy Policy" placement="top">
                    <IconButton
                      size="small"
                      sx={{ position: 'absolute', top: 8, right: 8 }}
                      onClick={() => handleCopy(policy)}
                    >
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </Stack>

            {/* Step 3 */}
            <Stack direction="row" spacing={2} alignItems="flex-start">
              <Chip label="3" color="primary" />
              <Typography>
                Click on <strong>Next</strong> to go to the <strong>Add permissions page</strong>. We would not be adding any permissions for now.
              </Typography>
            </Stack>

            {/* Step 4 */}
            <Stack direction="row" spacing={2} alignItems="flex-start">
              <Chip label="4" color="primary" />
              <Box width="100%">
                <Typography gutterBottom>
                  In the <strong>Role name</strong> field, enter the below-mentioned role name, and click on{' '}
                  <strong>Create Role</strong>:
                </Typography>
                <TextField
                  fullWidth
                  value={roleName}
                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <InputAdornment position="end">
                        <Tooltip title="Copy Role Name">
                          <IconButton onClick={() => handleCopy(roleName)}>
                            <ContentCopyIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </Stack>

            {/* Step 5: Screenshot */}
            <Stack direction="row" spacing={2} alignItems="flex-start">
              <Chip label="5" color="primary" />
              <Box width="100%">
                <Typography gutterBottom>
                  Go to the newly created IAM Role and copy the Role ARN:
                </Typography>
                <Box
                  component="img"
                  src={img1}
                  alt="IAM Role Screenshot"
                  width="100%"
                  borderRadius={2}
                  border={1}
                  borderColor="divider"
                />
              </Box>
            </Stack>

             <Stack direction="row" spacing={2} alignItems="flex-start">
              <Chip label="6" color="primary" />
              <Box width="100%">
                <Typography gutterBottom>Paste the copied Role ARN below:</Typography>
                <TextField
                  fullWidth
                  placeholder="Enter the IAM Role ARN"
                  value={formData.arn}
                  onChange={(e) => handleChange('arn', e.target.value)}
                  error={!!errors.arn}
                  helperText={errors.arn}
                
                  variant="outlined"
                />
              </Box>
            </Stack>

            <Stack direction="row" spacing={2} alignItems="flex-start">
              <Chip label="7" color="primary" />
              <Box width="100%">
                <Typography gutterBottom>Enter the Account ID:</Typography>
                <TextField
                  fullWidth
                  placeholder="Enter the Account ID"
                  value={formData.accountId}
                  onChange={(e) => handleChange('accountId', e.target.value)}
                  error={!!errors.accountId}
                  helperText={errors.accountId}
                 
                  variant="outlined"
                />
              </Box>
            </Stack>

            <Stack direction="row" spacing={2} alignItems="flex-start">
              <Chip label="8" color="primary" />
              <Box width="100%">
                <Typography gutterBottom>Enter the Account Name:</Typography>
                <TextField
                  fullWidth
                  placeholder="Enter the Account Name"
                  value={formData.accountName}
                  onChange={(e) => handleChange('accountName', e.target.value)}
                  error={!!errors.accountName}
                  helperText={errors.accountName}
                
                  variant="outlined"
                />
              </Box>
            </Stack>

            <Stack direction="row" spacing={2} alignItems="flex-start">
              <Chip label="9" color="primary" />
              <Box width="100%">
                <Typography gutterBottom>Enter the Account Provider:</Typography>
                <TextField
                  fullWidth
                  placeholder="Enter the Account Provider"
                  value={formData.accountProvider}
                  onChange={(e) => handleChange('accountProvider', e.target.value)}
                  error={!!errors.accountProvider}
                  helperText={errors.accountProvider}
                  
                  variant="outlined"
                />
              </Box>
            </Stack>

            <Stack direction="row" spacing={2} alignItems="flex-start">
              <Chip label="10" color="primary" />
              <Box width="100%">
                <Typography gutterBottom>Enter the Account Region:</Typography>
                <TextField
                  fullWidth
                  placeholder="Enter the Account Region"
                  value={formData.region}
                  onChange={(e) => handleChange('region', e.target.value)}
                  error={!!errors.region}
                  helperText={errors.region}
                  
                  variant="outlined"
                />
              </Box>
            </Stack>

         

            {/* Footer Buttons */}
            <Stack direction="row" justifyContent="space-between" pt={2}>
              <Button variant="outlined">Cancel</Button>
              <Button
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                onClick={handleNext}
              >
                Next - Add Customer Managed Policies
              </Button>
            </Stack>
          </Stack>

        </CardContent>
      </Card>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000} // Automatically hide after 3 seconds
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          Text copied to clipboard!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default IAMRoleStep;