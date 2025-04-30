
import {
  Box,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Button,
  Grid,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  InputAdornment,
  IconButton,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { FormControl, InputLabel, Select } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";


const roles = ["ADMIN", "USER", "READ_ONLY"];

const User = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const [availableAccounts, setAvailableAccounts] = useState([]);
  const [associatedAccounts, setAssociatedAccounts] = useState([]);
  const [selectedAvailable, setSelectedAvailable] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedAssociated, setSelectedAssociated] = useState([]);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  const accessToken = useSelector((state) => state.auth.token);
  useEffect(() => {
    setForm({
      name: "",
      email: "",
      password: "",
      role: "",
    });
    setAvailableAccounts([]);
    setAssociatedAccounts([]);
    setSelectedAvailable([]);
    setSelectedAssociated([]);
  }, []);


  useEffect(() => {
    const fetchAccounts = async () => {
      try {
     
        const res = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/user/available-cloudaccounts`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const formatted = res.data.map((name, index) => ({
          id: index + 1,
          accountName: name,
        }));

        setAvailableAccounts(formatted);
      } catch (err) {
        console.error("Error fetching cloud accounts:", err);
      }
    };

    fetchAccounts();
  }, [accessToken]);

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setForm((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };
  const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "role" && value !== "USER") {
          setAssociatedAccounts([]);
          setSelectedAvailable([]);
          setSelectedAssociated([]);
        }
    
        setForm((prev) => ({
          ...prev,
          [name]: value,
        }));
      };
  const handleSubmit = async (e) => {
    e.preventDefault();

    // const userPayload = {
    //   ...form,
    //   cloudAccountIds: associatedAccounts.map((acc) => acc.id),
    // };
    const userPayload = {
            ...form,
            cloudAccountIds: form.role === "USER" ? associatedAccounts.map((acc) => acc.id) : [], // Only include accounts for "USER" role
          };

    try {
    
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/user/create-user`,
        userPayload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
     
      toast.success("User created successfully!");
      

      // navigate("/home/user-management"); 
      setTimeout(() => {
        navigate("/home/user-management");
      }, 2000);
        
    
      
    } catch (err) {
      console.error("Error creating user:", err);

      
      if (err.response && err.response.status === 409) {
        toast.error("User already exists!");
      } else {
        toast.error("Failed to create user.User already exists");
      }
    }
  };

  const handleAddAccounts = () => {
    const toAdd = availableAccounts.filter((acc) =>
      selectedAvailable.includes(acc.id)
    );
    setAssociatedAccounts((prev) => [...prev, ...toAdd]);
    setAvailableAccounts((prev) =>
      prev.filter((acc) => !selectedAvailable.includes(acc.id))
    );
    setSelectedAvailable([]);
  };

  const handleRemoveAccounts = () => {
    const toRemove = associatedAccounts.filter((acc) =>
      selectedAssociated.includes(acc.id)
    );
    setAvailableAccounts((prev) => [...prev, ...toRemove]);
    setAssociatedAccounts((prev) =>
      prev.filter((acc) => !selectedAssociated.includes(acc.id))
    );
    setSelectedAssociated([]);
  };

  const handleCheckboxChange = (id, listType) => {
    const updater =
      listType === "available" ? setSelectedAvailable : setSelectedAssociated;
    const current =
      listType === "available" ? selectedAvailable : selectedAssociated;

    if (current.includes(id)) {
      updater(current.filter((i) => i !== id));
    } else {
      updater([...current, id]);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        backgroundColor: "#F9F9F9",
        minHeight: "100vh",
        py: 5,
        // px: 2,
        px: { xs: 2, sm: 3, md: 4 },
        display: "flex",
        flexDirection: "column",
        // alignItems: "center",
        alignItems: "flex-start", // Align closer to the left
        ml: { xs: 2, sm: 4, md: 6 },
      }}
    >
       <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: 800,
          padding: 4,
         
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" fontWeight="bold" mb={3}>
          Add New User
        </Typography>

        <Grid container spacing={3}>
          <Grid item size={{ xs: 12, sm: 6, md: 6 }}>
            <TextField
              label="Name"
              name="name"
              required
              fullWidth
              value={form.name}
              onChange={handleChange}
            />
          </Grid>

          <Grid item size={{ xs: 12, sm: 6, md: 6 }}>
            <TextField
              label="Email ID"
              name="email"
              type="email"
              required
              fullWidth
              value={form.email}
              onChange={handleChange}
            />
          </Grid>

          <Grid item size={{ xs: 12, sm: 6, md: 6 }}>
            <TextField
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"} 
              required
              fullWidth
              value={form.password}
              onChange={handleChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item size={{ xs: 12, sm: 6, md: 6 }}>
            <FormControl fullWidth>
              <InputLabel id="role-label">Select Role</InputLabel>
              <Select
                labelId="role-label"
                name="role"
                value={form.role}
                onChange={handleChange}
                required
                label="Select Role"
              >
                {roles.map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {form.role === "USER" && (
          <Box mt={4} display="flex" gap={3} justifyContent="space-between">
           
            <Box flex={1}>
              <Typography fontWeight="bold" mb={1}>
                Available Cloud Accounts
              </Typography>
              <List
                dense
                sx={{
                  border: "1px solid #ccc",
                  maxHeight: 250,
                  overflow: "auto",
                }}
              >
                {availableAccounts.map((acc) => (
                  <ListItem
                    key={acc.id}
                    button
                    onClick={() => handleCheckboxChange(acc.id, "available")}
                  >
                    <ListItemIcon>
                      <Checkbox checked={selectedAvailable.includes(acc.id)} />
                    </ListItemIcon>
                    <ListItemText primary={`${acc.accountName} (${acc.id})`} />
                  </ListItem>
                ))}
              </List>
            </Box>

            
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              gap={2}
            >
              <Button variant="outlined" onClick={handleAddAccounts}>
                {">"}
              </Button>
              <Button variant="outlined" onClick={handleRemoveAccounts}>
                {"<"}
              </Button>
            </Box>

            
            <Box flex={1}>
              <Typography fontWeight="bold" mb={1}>
                Associated Cloud Accounts
              </Typography>
              {associatedAccounts.length === 0 ? (
                <Paper
                  elevation={0}
                  sx={{
                    height: 250,
                    border: "1px dashed gray",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    color: "gray",
                  }}
                >
                  <Typography>No Account IDs Added</Typography>
                </Paper>
              ) : (
                <List
                  dense
                  sx={{
                    border: "1px solid #ccc",
                    maxHeight: 250,
                    overflow: "auto",
                  }}
                >
                  {associatedAccounts.map((acc) => (
                    <ListItem
                      key={acc.id}
                      button
                      onClick={() => handleCheckboxChange(acc.id, "associated")}
                    >
                      <ListItemIcon>
                        <Checkbox
                          checked={selectedAssociated.includes(acc.id)}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={`${acc.accountName} (${acc.id})`}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
          </Box>
        )}
      </Paper>

      <Box mt={3} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Button
          type="submit"
          
          variant="contained"
          color="primary"
          sx={{ textTransform: "none", fontWeight: "bold", px: 5 }}
        >
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default User;
