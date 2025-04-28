
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  IconButton,
  TextField,
  MenuItem,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const roles = ["All", "ADMIN", "USER", "READ_ONLY"]; 

function UserTable() {
  const token = useSelector((state) => state.auth.token);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
       
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/user/all`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setData(response?.data || []);
        setFilteredData(response?.data || []); 
      } catch (error) {
        console.error("Error fetching data", error);
        setData([]);
        setFilteredData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

// useEffect(() => {
//   const fetchData = async () => {
//     setLoading(true)
//     try {
//       const response = await axiosInstance.get("/user/all");
//       setData(response?.data || []);
//       setFilteredData(response?.data || []);
//     } catch (error) {
//       console.error("Error fetching data", error);
//       setData([]);
//       setFilteredData([]);
//     }
//   };

//   fetchData();
// }, [token]);

  const handleEdit = (user) => {
    navigate(`/home/user-management/edit-user/${user.id}`);
  };


  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
    applyFilters(value, selectedRole);
  };

 
  const handleRoleChange = (e) => {
    const value = e.target.value;
    setSelectedRole(value);
    applyFilters(searchText, value);
  };

  
  const applyFilters = (search, role) => {
    let filtered = [...data];

    if (search) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase())
      );
    }

   
    if (role !== "All") {
      filtered = filtered.filter((user) => user.role === role);
    }

    setFilteredData(filtered);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!data || data.length === 0) {
    return <Typography>No data available.</Typography>;
  }

  return (
    <Box>
    
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <TextField
          label="Search by Name or Email"
          value={searchText}
          onChange={handleSearchChange}
          variant="outlined"
          size="small"
          sx={{ width: "70%" }}
        />
        <TextField
          select
          label="Filter by Role"
          value={selectedRole}
          onChange={handleRoleChange}
          variant="outlined"
          size="small"
          sx={{ width: "25%" }}
        >
          {roles.map((role) => (
            <MenuItem key={role} value={role}>
              {role}
            </MenuItem>
          ))}
        </TextField>
      </Box>

     
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Role</TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="center">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {Array.isArray(user.role) ? user.role.join(", ") : user.role}
                </TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => handleEdit(user)} color="primary">
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default UserTable;