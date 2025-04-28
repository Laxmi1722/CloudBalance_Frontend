
import {
  Button,
  Typography,

  Box,
  Card,
  CardContent,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import React from 'react';
import { useSelector } from 'react-redux';
import UserTable from "../../Component/UserTable";
import { useNavigate } from "react-router-dom";

const UserManagement = () => {
 
  const navigate=useNavigate();
  const role = useSelector((state) => state.auth.role); 


  const handleAddUser = () => {
    console.log("Add New User");
    navigate("/home/user-management/createuser");
    
  };

  return (
    <Box p={3} sx={{ backgroundColor: "#F9F9F9", minHeight: "100vh" }}>
      <Card sx={{ minHeight: "85vh" }}>
        <CardContent>
          <Typography
            variant="h5"
            gutterBottom
            sx={{ color: "#000000", fontWeight: "bold" }}
          >
            Users
          </Typography>

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            {/* <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddUser}
              sx={{ textTransform: "none", fontWeight: "bold" }}
            >
              Add New User
            </Button> */}
                  {role !== "READ_ONLY" && (
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAddUser} sx={{ textTransform: "none", fontWeight: "bold" }}>
          Add User
        </Button>
      )}
           
          </Box>

        </CardContent>
      <Box mt={4}>
  <UserTable />
</Box>
      </Card>


      {/* Footer */}
      <Box
        sx={{
          marginTop: 2,
          textAlign: "left",
        }}
      >
        <Typography variant="body2" color="textSecondary">
          CloudBalance 2025 | All Rights Reserved
        </Typography>
      </Box>
    </Box>
  );
};

export default UserManagement;
