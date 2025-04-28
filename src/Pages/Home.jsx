
// import React, { useState } from "react";
// import { Box, Toolbar, AppBar, IconButton, Button, Typography } from "@mui/material";
// import LogoutIcon from "@mui/icons-material/Logout";
// import MenuIcon from "@mui/icons-material/Menu";
// import { useDispatch, useSelector } from "react-redux";
// import { logout } from "../Redux/AuthSlice";
// import { useNavigate, Outlet } from "react-router-dom";
// import Sidebar from "../Component/Sidebar";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import Cloudlogo from "../assets/cloudlogo.png";

// const debounce = (func, delay) => {
//   let timer;
//   return (...args) => {
//     clearTimeout(timer);
//     timer = setTimeout(() => {
//       func(...args);
//     }, delay);
//   };
// };

// const Home = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const userName = useSelector((state) => state.auth.name) || "User";
//   const userRole = useSelector((state) => state.auth.role);
//   const token = useSelector((state) => state.auth.token);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);

//   if (!userRole) {
//     toast.error("Role is missing. Please contact the administrator.");
//     return null; 
//   }

//   const handleLogout = async () => {
//     try {
//       if (!token) {
//         toast.error("Token is missing. Please log in again.");
//         navigate("/login");
//         return;
//       }

      
//       await axios.post(
//         `${process.env.REACT_APP_API_BASE_URL}/auth/logout`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       dispatch(logout());
//       toast.success("Logged out successfully.");
//       navigate("/login");
     
//     } catch (err) {
//       console.error("Error while logging out:", err.response?.data || err.message);
//       toast.error(
//         `Error: ${
//           err.response?.data || "An error occurred while logging out. Please try again."
//         }`
//       );
//     }
//   };

//   const debouncedToggleSidebar = debounce(() => {
//     setIsSidebarOpen((prev) => !prev);
//   }, 300); 

//   return (
//     <Box display="flex" flexDirection="column" minHeight="100vh">
    
//       <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
//       <AppBar
//         position="static"
//         sx={{
//           backgroundColor: "#FFFFFF",
//           boxShadow: "none",
//           borderBottom: "1px solid #E0E0E0",
//         }}
//       >
//         <Toolbar>
        
//           <IconButton edge="start" color="inherit" aria-label="menu" onClick={debouncedToggleSidebar} sx={{ marginRight: 1 }}>
//             <MenuIcon sx={{ color: "#000000" }} />
//           </IconButton>

//           <Box
//             component="img"
//             src={Cloudlogo}
//             alt="CloudBalance Logo"
//             sx={{
//               height: 120, 
//               marginRight: 2,
//               objectFit: "contain",
//             }}
//           />

         
//           <Box sx={{ flexGrow: 1 }}></Box>

          
//           <Box display="flex" alignItems="center">
//             <Box textAlign="left" sx={{ marginRight: 2, lineHeight: 1.2 }}>
//               <Typography variant="body1" sx={{ color: "#000000" }}>
//                 Welcome,
//               </Typography>
//               <Typography variant="h6" sx={{ color: "#000000", fontWeight: "bold", fontSize: "1rem" }}>
//                 {userName}
//               </Typography>
//               <Typography variant="body2" sx={{ color: "#007BFF", fontWeight: "bold" }}>
//                 Role: {userRole} 
//               </Typography>
//             </Box>
//             <Button
//               variant="text"
//               color="inherit"
//               startIcon={<LogoutIcon />}
//               onClick={handleLogout}
//               sx={{ color: "#000000", textTransform: "none" }}
//             >
//               Logout
//             </Button>
//           </Box>
//         </Toolbar>
//       </AppBar>

//       <Box display="flex" flexGrow={1}>
//         <Box
//           sx={{
//             width: isSidebarOpen ? "250px" : "0", 
//             transition: "width 0.5s ease-in-out", 
//             overflow: "hidden", 
//             backgroundColor: isSidebarOpen ? "#FFFFFF" : "transparent", 
//             boxShadow: isSidebarOpen ? "2px 0 5px rgba(0, 0, 0, 0.1)" : "none",
//           }}
//         >
//           <Sidebar />
//         </Box>
//         <Box
//           sx={{
//             flexGrow: 1,
//             transition: "all 0.5s ease-in-out",
//             backgroundColor: isSidebarOpen ? "#F9FAFB" : "#FFFFFF",
//             padding: 3,
//           }}
//         >
//           <Outlet />
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// export default Home;
import React, { useState } from "react";
import {
  Box,
  Toolbar,
  AppBar,
  IconButton,
  Button,
  Typography
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle"; // ✅ Added user icon
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../Redux/AuthSlice";
import { useNavigate, Outlet } from "react-router-dom";
import Sidebar from "../Component/Sidebar";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cloudlogo from "../assets/cloudlogo.png";

const debounce = (func, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userName = useSelector((state) => state.auth.name) || "User";
  const userRole = useSelector((state) => state.auth.role);
  const token = useSelector((state) => state.auth.token);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  if (!userRole) {
    toast.error("Role is missing. Please contact the administrator.");
    return null;
  }

  const handleLogout = async () => {
    try {
      if (!token) {
        toast.error("Token is missing. Please log in again.");
        navigate("/login");
        return;
      }

      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/auth/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch(logout());
      toast.success("Logged out successfully.");
      navigate("/login");

    } catch (err) {
      console.error("Error while logging out:", err.response?.data || err.message);
      toast.error(
        `Error: ${
          err.response?.data || "An error occurred while logging out. Please try again."
        }`
      );
    }
  };

  const debouncedToggleSidebar = debounce(() => {
    setIsSidebarOpen((prev) => !prev);
  }, 300);

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      
      <AppBar
        position="static"
        sx={{
          backgroundColor: "#FFFFFF",
          boxShadow: "none",
          borderBottom: "1px solid #E0E0E0",
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={debouncedToggleSidebar}
            sx={{ marginRight: 1 }}
          >
            <MenuIcon sx={{ color: "#000000" }} />
          </IconButton>

          <Box
            component="img"
            src={Cloudlogo}
            alt="CloudBalance Logo"
            sx={{
              height: 120,
              marginRight: 2,
              objectFit: "contain",
            }}
          />

          <Box sx={{ flexGrow: 1 }}></Box>

          <Box display="flex" alignItems="center">
            {/* ✅ User Icon */}
            <AccountCircleIcon sx={{ color: "#000000", fontSize: 40, marginRight: 1 }} />

            {/* ✅ User Text Info */}
            <Box textAlign="left" sx={{ marginRight: 2, lineHeight: 1.2 }}>
              <Typography variant="body1" sx={{ color: "#000000" }}>
                Welcome,
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: "#000000",
                  fontWeight: "bold",
                  fontSize: "1rem",
                }}
              >
                {userName}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#007BFF", fontWeight: "bold" }}
              >
                Role: {userRole}
              </Typography>
            </Box>

            {/* Logout Button */}
            <Button
              variant="text"
              color="inherit"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{ color: "#000000", textTransform: "none" }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Box display="flex" flexGrow={1}>
        <Box
          sx={{
            width: isSidebarOpen ? "250px" : "0",
            transition: "width 0.5s ease-in-out",
            overflow: "hidden",
            backgroundColor: isSidebarOpen ? "#FFFFFF" : "transparent",
            boxShadow: isSidebarOpen ? "2px 0 5px rgba(0, 0, 0, 0.1)" : "none",
          }}
        >
          <Sidebar />
        </Box>

        <Box
          sx={{
            flexGrow: 1,
            transition: "all 0.5s ease-in-out",
            backgroundColor: isSidebarOpen ? "#F9FAFB" : "#FFFFFF",
            padding: 3,
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
