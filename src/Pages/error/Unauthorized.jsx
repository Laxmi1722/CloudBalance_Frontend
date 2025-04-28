import React from "react";
import { Box, Typography, Button } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useNavigate } from "react-router-dom";

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/login"); 
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="#F9FAFB"
      padding={3}
    >
      {/* Icon */}
      <Box
        sx={{
          bgcolor: "#FFCDD2",
          borderRadius: "50%",
          width: 100,
          height: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 3,
        }}
      >
        <ErrorOutlineIcon sx={{ color: "#D32F2F", fontSize: 50 }} />
      </Box>

      {/* Error Heading */}
      <Typography variant="h4" fontWeight="bold" color="#D32F2F" gutterBottom>
        Unauthorized Access
      </Typography>

      {/* Error Message */}
      <Typography
        variant="body1"
        color="text.secondary"
        textAlign="center"
        mb={4}
        maxWidth={400}
      >
        Oops! You don't have permission to view this page. Please log in with
        the appropriate credentials or contact the administrator if you believe
        this is a mistake.
      </Typography>

      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={handleGoBack}
        sx={{
          textTransform: "none",
          bgcolor: "#007BFF",
          "&:hover": {
            bgcolor: "#0056b3",
          },
        }}
      >
        Go to User Management Page
      </Button>
    </Box>
  );
};

export default UnauthorizedPage;