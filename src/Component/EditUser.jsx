
import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  CircularProgress,
  Typography,
  MenuItem,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Paper,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";

const roles = ["ADMIN", "USER", "READ_ONLY"]; 

function EditUser() {
  const { id } = useParams(); 
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
    associatedCloudAccounts: [],
  });
  const [availableCloudAccounts, setAvailableCloudAccounts] = useState([]);
  const [showPassword, setShowPassword] = useState(false); 
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    const fetchUserAndCloudAccounts = async () => {
      setLoading(true);
      try {
        const userResponse = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/user/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const cloudAccountsResponse = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/user/available-cloudaccounts`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const userData = userResponse.data;
        const availableAccounts = cloudAccountsResponse.data.map((name, index) => ({
          id: index + 1, 
          name,
        }));

        const associatedAccounts = userData.cloudAccountIds.map((id) => {
          const name = cloudAccountsResponse.data[id - 1] || "Unknown Account";
          return { id, name };
        });

        setForm({
          name: userData.name || "",
          email: userData.email || "",
          role: userData.role || "",
          password: "",
          associatedCloudAccounts: associatedAccounts,
        });

        setAvailableCloudAccounts(availableAccounts.filter(
          (account) => !userData.cloudAccountIds.includes(account.id)
        ));
      } catch (error) {
        console.error("Error fetching user or cloud accounts:", error);
        toast.error("Failed to fetch user or cloud accounts.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndCloudAccounts();
  }, [id, token]);

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const moveAccountToAssociated = (account) => {
    setForm((prev) => ({
      ...prev,
      associatedCloudAccounts: [...prev.associatedCloudAccounts, account],
    }));
    setAvailableCloudAccounts((prev) =>
      prev.filter((acc) => acc.id !== account.id)
    );
  };

  const moveAccountToAvailable = (account) => {
    setAvailableCloudAccounts((prev) => [...prev, account]);
    setForm((prev) => ({
      ...prev,
      associatedCloudAccounts: prev.associatedCloudAccounts.filter(
        (acc) => acc.id !== account.id
      ),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    const updatePayload = {
      name: form.name,
      email: form.email,
      role: form.role,
      cloudAccountIds: form.associatedCloudAccounts.map((acc) => acc.id), 
    };
    if (form.password?.trim()) {
      updatePayload.password = form.password;
    }

    try {
      await axios.put(
        `${process.env.REACT_APP_REACT_APP_API_BASE_URL}/user/${id}`,
        updatePayload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("User updated successfully.");
      setTimeout(() => {
        navigate("/home/user-management"); 
      }, 2000);
    } catch (error) {
      console.error("Error updating user details:", error);
      toast.error("Failed to update user.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5", 
        // padding: 3,
        padding: { xs: 2, sm: 3, md: 4 },
        
      }}
    >
      <Paper
        elevation={4}
        sx={{
          // padding: 4,
          padding: { xs: 2, sm: 3, md: 4 },
          maxWidth: "600px",
          width: "100%",
          backgroundColor: "#ffffff", 
          borderRadius: 2,
          // position:"relative",
          // right:"10rem",
          // bottom:"10rem",
          // mr:"20rem"
          marginLeft: { xs: 2, sm: 4, md: 6 }, // Adjust margin from the left for all screen sizes
          marginTop: { xs: 2, sm: 3 ,md:-19}, 
          

        }}
      >
        <Typography variant="h4" gutterBottom  sx={{
        textAlign: "center", // Center the heading
        fontSize: { xs: "1.5rem", sm: "2rem" }, // Responsive font size
      }}>
          Edit User
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
          <TextField
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
            required
            disabled={updating}
          />

          <TextField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            fullWidth
            required
            disabled={updating}
          />

          <TextField
            select
            label="Role"
            name="role"
            value={form.role}
            onChange={handleChange}
            fullWidth
            required
            disabled={updating}
          >
            {roles.map((role) => (
              <MenuItem key={role} value={role}>
                {role}
              </MenuItem>
            ))}
          </TextField>

          {form.role === "USER" && (
            <Box sx={{ display: "flex", gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1">Available Cloud Accounts</Typography>
                <List sx={{ border: "1px solid #ccc", height: 200, overflow: "auto" }}>
                  {availableCloudAccounts.map((account) => (
                    <ListItem
                      key={account.id}
                      secondaryAction={
                        <ListItemButton onClick={() => moveAccountToAssociated(account)}>
                          {">"}
                        </ListItemButton>
                      }
                    >
                      <ListItemText primary={`${account.name} (${account.id})`} />
                    </ListItem>
                  ))}
                </List>
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1">Associated Cloud Accounts</Typography>
                <List sx={{ border: "1px solid #ccc", height: 200, overflow: "auto" }}>
                  {form.associatedCloudAccounts.map((account) => (
                    <ListItem
                      key={account.id}
                      secondaryAction={
                        <ListItemButton onClick={() => moveAccountToAvailable(account)}>
                          {"<"}
                        </ListItemButton>
                      }
                    >
                      <ListItemText primary={`${account.name} (${account.id})`} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Box>
          )}

          <TextField
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"} 
            value={form.password}
            onChange={handleChange}
            fullWidth
            placeholder="Enter new password (optional)"
            disabled={updating}
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
            type="submit"
            variant="contained"
            color="primary"
            disabled={updating}
          >
            {updating ? "Saving Changes..." : "Save Changes"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default EditUser;