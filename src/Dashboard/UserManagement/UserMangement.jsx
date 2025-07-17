
// import {
//   Button,
//   Typography,

//   Box,
//   Card,
//   CardContent,
// } from "@mui/material";
// import AddIcon from "@mui/icons-material/Add";
// import React from 'react';
// import { useSelector } from 'react-redux';
// import UserTable from "../../Component/UserTable";
// import { useNavigate } from "react-router-dom";

// const UserManagement = () => {
 
//   const navigate=useNavigate();
//   const role = useSelector((state) => state.auth.role); 


//   const handleAddUser = () => {
//     console.log("Add New User");
//     navigate("/home/user-management/createuser");
    
//   };

//   return (
//     <Box p={3} sx={{ backgroundColor: "#F9F9F9", minHeight: "100vh" }}>
//       <Card sx={{ minHeight: "85vh" }}>
//         <CardContent>
//           <Typography
//             variant="h5"
//             gutterBottom
//             sx={{ color: "#000000", fontWeight: "bold" }}
//           >
//             Users
//           </Typography>

//           <Box
//             display="flex"
//             justifyContent="space-between"
//             alignItems="center"
//             mb={2}
//           >
//             {/* <Button
//               variant="contained"
//               color="primary"
//               startIcon={<AddIcon />}
//               onClick={handleAddUser}
//               sx={{ textTransform: "none", fontWeight: "bold" }}
//             >
//               Add New User
//             </Button> */}
//                   {role !== "READ_ONLY" && (
//         <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAddUser} sx={{ textTransform: "none", fontWeight: "bold" }}>
//           Add User
//         </Button>
//       )}
           
//           </Box>

//         </CardContent>
//       <Box mt={4}>
//   <UserTable />
// </Box>
//       </Card>


//       {/* Footer */}
//       <Box
//         sx={{
//           marginTop: 2,
//           textAlign: "left",
//         }}
//       >
//         <Typography variant="body2" color="textSecondary">
//           CloudBalance 2025 | All Rights Reserved
//         </Typography>
//       </Box>
//     </Box>
//   );
// };

// export default UserManagement;
// import React, { useState, useEffect } from "react";
// import {
//   Button,
//   Typography,
//   Box,
//   Card,
//   CardContent,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
// } from "@mui/material";
// import AddIcon from "@mui/icons-material/Add";
// import SwitchAccountIcon from "@mui/icons-material/SwitchAccount";
// import { useSelector, useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import UserTable from "../../Component/UserTable";
// import axiosInstance from "../../utils/axiosInterceptor";

// const UserManagement = () => {
//   const navigate = useNavigate();
//   const role = useSelector((state) => state.auth.role);

//   // State for user list and dialog
//   const [openDialog, setOpenDialog] = useState(false);
//   const [userList, setUserList] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Handle Add User Navigation
//   const handleAddUser = () => {
//     console.log("Add New User");
//     navigate("/home/user-management/createuser");
//   };

//   // Handle Dialog Open/Close
//   const handleDialogOpen = async () => {
//     setOpenDialog(true);
//     setLoading(true);
//     try {
//       const response = await axiosInstance.get("/user/list");
//       setUserList(response.data); // Assuming the API returns a list of users
//     } catch (error) {
//       console.error("Error fetching user list:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDialogClose = () => {
//     setOpenDialog(false);
//   };

//   // Handle Switch to User
//   const handleSwitchToUser = (userId) => {
//     // Dispatch an action or call an API here to switch roles
//     console.log(`Switching to user with ID: ${userId}`);
//     // Redirect to the dashboard of the switched user
//     navigate(`/home/dashboard/${userId}`);
//   };

//   return (
//     <Box p={3} sx={{ backgroundColor: "#F9F9F9", minHeight: "100vh" }}>
//       <Card sx={{ minHeight: "85vh" }}>
//         <CardContent>
//           <Typography
//             variant="h5"
//             gutterBottom
//             sx={{ color: "#000000", fontWeight: "bold" }}
//           >
//             Users
//           </Typography>

//           <Box
//             display="flex"
//             justifyContent="space-between"
//             alignItems="center"
//             mb={2}
//           >
//             {role !== "READ_ONLY" && (
//               <Button
//                 variant="contained"
//                 color="primary"
//                 startIcon={<AddIcon />}
//                 onClick={handleAddUser}
//                 sx={{ textTransform: "none", fontWeight: "bold" }}
//               >
//                 Add User
//               </Button>
//             )}
//             {role === "ADMIN" && (
//               <Button
//                 variant="contained"
//                 color="secondary"
//                 startIcon={<SwitchAccountIcon />}
//                 onClick={handleDialogOpen}
//                 sx={{ textTransform: "none", fontWeight: "bold" }}
//               >
//                 Switch Role
//               </Button>
//             )}
//           </Box>
//         </CardContent>

//         <Box mt={4}>
//           <UserTable />
//         </Box>
//       </Card>

//       {/* Dialog for Switch Role */}
//       <Dialog open={openDialog} onClose={handleDialogClose} fullWidth maxWidth="md">
//         <DialogTitle>Switch Role</DialogTitle>
//         <DialogContent>
//           {loading ? (
//             <Typography variant="body1" color="textSecondary">
//               Loading user list...
//             </Typography>
//           ) : (
//             <TableContainer component={Paper}>
//               <Table>
//                 <TableHead>
//                   <TableRow>
//                     <TableCell><strong>ID</strong></TableCell>
//                     <TableCell><strong>Name</strong></TableCell>
//                     <TableCell><strong>Email</strong></TableCell>
//                     <TableCell align="center"><strong>Action</strong></TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {userList.map((user) => (
//                     <TableRow key={user.id}>
//                       <TableCell>{user.id}</TableCell>
//                       <TableCell>{user.name}</TableCell>
//                       <TableCell>{user.email}</TableCell>
//                       <TableCell align="center">
//                         <Button
//                           variant="outlined"
//                           color="primary"
//                           onClick={() => handleSwitchToUser(user.id)}
//                         >
//                           Switch to User
//                         </Button>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleDialogClose} color="secondary">
//             Close
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Footer */}
//       <Box
//         sx={{
//           marginTop: 2,
//           textAlign: "left",
//         }}
//       >
//         <Typography variant="body2" color="textSecondary">
//           CloudBalance 2025 | All Rights Reserved
//         </Typography>
//       </Box>
//     </Box>
//   );
// };

// export default UserManagement;
import React, { useState, useEffect } from "react";
import {
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SwitchAccountIcon from "@mui/icons-material/SwitchAccount";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import UserTable from "../../Component/UserTable";
import axiosInstance from "../../utils/axiosInterceptor";
import { switchUser } from "../../Redux/AuthSlice";

const UserManagement = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const role = useSelector((state) => state.auth.role);


  const [openDialog, setOpenDialog] = useState(false);
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAddUser = () => {
    console.log("Add New User");
    navigate("/home/user-management/createuser");
  };

  
  const handleDialogOpen = async () => {
    setOpenDialog(true);
    setLoading(true);
    try {
      const response = await axiosInstance.get("/user/all?minimal=true"); // Updated endpoint
      setUserList(response.data); // Response contains only name and email
    } catch (error) {
      console.error("Error fetching user list:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };


  const handleSwitchToUser = async (email) => {
    try {
      console.log(`Switching to user with Email: ${email}`);
      
      // Call the API to switch roles
      const response = await axiosInstance.post(`/user/switch-to-user`, { email });
      
      // Extract the name from the API response
      const { name } = response.data;
  
      // Dispatch Redux action to update role and name
      dispatch(switchUser({ role: 'USER', name }));
  
      // Redirect to the user dashboard's cost explorer route
      navigate("/home/cost-explorer");
    } catch (error) {
      console.error("Error switching to user:", error);
    }
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
            {role !== "READ_ONLY" && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleAddUser}
                sx={{ textTransform: "none", fontWeight: "bold" }}
              >
                Add User
              </Button>
            )}
            {role === "ADMIN" && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<SwitchAccountIcon />}
                onClick={handleDialogOpen}
                sx={{ textTransform: "none", fontWeight: "bold" }}
              >
                Switch Role
              </Button>
            )}
          </Box>
        </CardContent>

        <Box mt={4}>
          <UserTable />
        </Box>
      </Card>

      {/* Dialog for Switch Role */}
      <Dialog open={openDialog} onClose={handleDialogClose} fullWidth maxWidth="md">
        <DialogTitle>Switch Role</DialogTitle>
        <DialogContent>
          {loading ? (
            <Typography variant="body1" color="textSecondary">
              Loading user list...
            </Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Name</strong></TableCell>
                    <TableCell><strong>Email</strong></TableCell>
                    <TableCell align="center"><strong>Action</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {userList.map((user, index) => (
                    <TableRow key={index}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell align="center">
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() => handleSwitchToUser(user.email)}
                        >
                          Switch to User
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

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