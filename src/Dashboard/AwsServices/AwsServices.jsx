
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Grid,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import { useSelector } from "react-redux";
import axiosInstance from "../../utils/axiosInterceptor";

const AwsServices = () => {
  const [tab, setTab] = useState(0); 
  const [cloudAccounts, setCloudAccounts] = useState([]); 
  const [selectedAccount, setSelectedAccount] = useState(""); 
  const [data, setData] = useState([]); 
  const [search, setSearch] = useState(""); 
  const [filteredData, setFilteredData] = useState([]); 
  const [loading, setLoading] = useState(false); 
  const token = useSelector((state) => state.auth.token); 
  const userRole = useSelector((state) => state.auth.role); 

  useEffect(() => {
    const fetchCloudAccounts = async () => {
      try {
        // const response = await axios.get(
        //   `${process.env.REACT_APP_API_BASE_URL}/user/available-cloudaccounts/names-and-ids`,
        //   {
        //     headers: {
        //       Authorization: `Bearer ${token}`,
        //     },
        //   }
        // );
         const response=await axiosInstance.get('/user/available-cloudaccounts/names-and-ids')
        
        const availableAccounts = response.data.filter((account) => {
          if (userRole === "ADMIN" || userRole === "READ_ONLY") {
            return true; 
          }
          return true; 
        });

        setCloudAccounts(availableAccounts);
      } catch (error) {
        console.error("Error fetching cloud accounts:", error);
      }
    };

    fetchCloudAccounts();
  }, [token, userRole]);

  useEffect(() => {
    if (selectedAccount) {
      const fetchData = async () => {
        try {
          setLoading(true); 
          setData([]); 
          setFilteredData([]); 

          let endpoint = "";
          if (tab === 0) {
            endpoint = `http://localhost:8082/api/aws/ec2?accountId=${encodeURIComponent(selectedAccount)}`;
          } else if (tab === 1) {
            endpoint = `http://localhost:8082/api/aws/rds?accountId=${encodeURIComponent(selectedAccount)}`;
          } else if (tab === 2) {
            endpoint = `http://localhost:8082/api/aws/asg?accountId=${encodeURIComponent(selectedAccount)}`;
          }

          const response = await axios.get(endpoint, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          setData(response.data);
          setFilteredData(response.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false); 
        }
      };

      fetchData();
    }
  }, [selectedAccount, token, tab]);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
    setSearch(""); 
  };

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearch(value);
    const filtered = data.filter((row) =>
      Object.values(row).some((val) =>
        String(val).toLowerCase().includes(value)
      )
    );
    setFilteredData(filtered);
  };

  return (

    <Box sx={{ p: 3 }}>
      <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ color: "#007BFF" }}>
          AWS Services Dashboard
        </Typography>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Select Cloud Account</InputLabel>
          <Select
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
            label="Select Cloud Account"
          >
            {cloudAccounts.map((account) => (
              <MenuItem key={account.accountId} value={account.accountId}>
                {account.accountName} ({account.accountId})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      {/* Tabs Section */}
      <Tabs
        value={tab}
        onChange={handleTabChange}
        textColor="primary"
        indicatorColor="primary"
        sx={{ mb: 3 }}
      >
        <Tab label="EC2" />
        <Tab label="RDS" />
        <Tab label="ASG" />
      </Tabs>

      {/* Search Section */}
      <Box mb={3} sx={{ display: "flex", justifyContent: "flex-start" }}>
        <TextField
          sx={{ width: "50%" }} 
          placeholder={
            tab === 0
              ? "Search by Instance ID, Name, Region, or State"
              : tab === 1
              ? "Search by Resource ID, Name, Engine, Region, or Status"
              : "Search by Group Name, Resource ID, Region, Desired Capacity, etc."
          }
          value={search}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Data Table or Message */}
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" py={5}>
          <CircularProgress /> 
        </Box>
      ) : selectedAccount ? (
        filteredData.length > 0 ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  {tab === 0 ? (
                    <>
                      <TableCell>Instance ID</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>State</TableCell>
                      <TableCell>Region</TableCell>
                    </>
                  ) : tab === 1 ? (
                    <>
                      <TableCell>Resource ID</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Engine</TableCell>
                      <TableCell>Region</TableCell>
                      <TableCell>Status</TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell>Resource ID</TableCell>
                      <TableCell>Resource Name</TableCell>
                      <TableCell>Region</TableCell>
                      <TableCell>Desired Capacity</TableCell>
                      <TableCell>Min Size</TableCell>
                      <TableCell>Max Size</TableCell>
                      <TableCell>Status</TableCell>
                    </>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.map((row, index) => (
                  <TableRow key={index}>
                    {tab === 0 ? (
                      <>
                        <TableCell>{row.instanceId}</TableCell>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.state}</TableCell>
                        <TableCell>{row.region}</TableCell>
                      </>
                    ) : tab === 1 ? (
                      <>
                        <TableCell>{row.instanceId}</TableCell>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.engine}</TableCell>
                        <TableCell>{row.region}</TableCell>
                        <TableCell>{row.status}</TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell>{row.resourceId}</TableCell>
                        <TableCell>{row.groupName}</TableCell>
                        <TableCell>{row.region}</TableCell>
                        <TableCell>{row.desiredCapacity}</TableCell>
                        <TableCell>{row.minSize}</TableCell>
                        <TableCell>{row.maxSize}</TableCell>
                        <TableCell>{row.status}</TableCell>
                      </>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 5 }}>
            No data available for the selected tab and cloud account.
          </Typography>
        )
      ) : (
        <Typography variant="body1" color="text.secondary" align="center">
          Please select a cloud account to view data.
        </Typography>
      )}
       <Box
        sx={{
          marginTop:"26em",
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

export default AwsServices;