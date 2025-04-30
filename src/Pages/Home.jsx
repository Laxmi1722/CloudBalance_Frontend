
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
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../Redux/AuthSlice"
import { useNavigate, Outlet } from "react-router-dom";

import Sidebar from "../Component/Sidebar";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cloudlogo from "../assets/cloudlogo.png";
import { useState } from "react";
import { resetForm } from "../Redux/OnboardingSlice";

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
        { headers: { Authorization: `Bearer ${token}` } }
      );

      dispatch(logout());
      dispatch(resetForm())
    
      toast.success("Logged out successfully.");
      navigate("/login");
    } catch (err) {
      console.error("Logout Error:", err.response?.data || err.message);
      toast.error(
        `Error: ${
          err.response?.data || "An error occurred while logging out."
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

      {/* Header */}
      <AppBar
        position="sticky"
        sx={{
          backgroundColor: "#FFFFFF",
          borderBottom: "1px solid #E0E0E0",
          boxShadow: "none",
          height: 70,
          zIndex: 1201,
         
        }}
      >
        <Toolbar sx={{ minHeight: 70, px: 2 }}>
          <IconButton
            onClick={debouncedToggleSidebar}
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon sx={{ color: "#000" }} />
          </IconButton>

          <Box
            component="img"
            src={Cloudlogo}
            alt="CloudBalance Logo"
            sx={{ height: 120, objectFit: "contain", mr: 2 }}
          />

          <Box sx={{ flexGrow: 1 }} />

          {/* User Info + Logout */}
          <Box display="flex" alignItems="center" gap={2}>
            <AccountCircleIcon sx={{ color: "#000", fontSize: 40 }} />
            <Box textAlign="left">
              <Typography variant="body2" sx={{ color: "#000" }}>
                Welcome,
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", color: "#000", fontSize: "1rem" }}
              >
                {userName}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "#007BFF", fontWeight: 600 }}
              >
                Role: {userRole}
              </Typography>
            </Box>

            <Button
              variant="text"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{
                textTransform: "none",
                color: "#000",
                fontWeight: 600,
              }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar + Main Content */}
      <Box display="flex" flexGrow={1}>
        {/* Sidebar */}
        <Box
          sx={{
            width: isSidebarOpen ? 250 : 0,
            transition: "width 0.3s ease",
            overflowX: "hidden",
            backgroundColor: "#fff",
            borderRight: isSidebarOpen ? "1px solid #e0e0e0" : "none",
            position: "fixed", // Fix the sidebar to the left
            height: "100vh", // Full height of the viewport
            zIndex: 1200,
          }}
        >
          <Sidebar />
        </Box>

        {/* Page Content */}
        <Box
          sx={{
            flexGrow: 1,
            p: 3,
            backgroundColor: "#F9FAFB",
            transition: "all 0.3s ease",
            marginLeft: isSidebarOpen ? "250px" : "0",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
