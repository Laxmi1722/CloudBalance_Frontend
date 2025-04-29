
import React, { useState, useEffect } from "react";
import {
  Box, Typography, Grid, Select, MenuItem, FormControl, InputLabel, Button, CircularProgress,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
} from "@mui/material";
import axios from "axios";
import { useSelector } from "react-redux";
import FusionChart from "../../Component/FusionChart";
import FusionLineChart from "../../Component/FusionLineChart";
import * as XLSX from "xlsx";

const CostExplorer = () => {
  const [groupOptions, setGroupOptions] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [filterValues, setFilterValues] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [startDate, setStartDate] = useState("2025-01");
  const [endDate, setEndDate] = useState("2025-12");
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = useSelector((state) => state.auth.token);

  // Fetch group options (columns)
  useEffect(() => {
    const fetchGroupOptions = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/snowflake/column`,  {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGroupOptions(response.data);
        if (response.data.length > 0) {
          setSelectedGroup(response.data[0].displayName);
        }
      } catch (error) {
        console.error("Error fetching group options:", error);
        setError("Failed to load group options.");
      }
    };
    fetchGroupOptions();
  }, [token]);

  // Fetch filter values when group changes
  useEffect(() => {
    if (!selectedGroup) return;
    const fetchFilterValues = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/snowflake/columnDetails`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: { columnName: selectedGroup },
          }
        );
        const values = response.data.map(item => item[selectedGroup]);
        setFilterValues(values);
        if (values.length > 0) {
          setSelectedFilter(values[0]);
        }
      } catch (error) {
        console.error("Error fetching filter values:", error);
        setError("Failed to load filter values.");
      }
    };
    fetchFilterValues();
  }, [selectedGroup,token]);

  // Fetch user available cloud accounts
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/user/available-cloudaccounts/names-and-ids`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAccounts(response.data);
        if (response.data.length > 0) {
          setSelectedAccount(response.data[0].accountId);
        }
      } catch (error) {
        console.error("Error fetching accounts:", error);
        setError("Failed to load account information.");
      }
    };
    fetchAccounts();
  }, [token]);

  // Fetch table data
  const fetchTableData = async () => {
    if (!selectedGroup || !selectedAccount) return;
    setLoading(true);
    setError("");
    try {
      const payload = {
        startMonth: startDate,
        endMonth: endDate,
        filters: {
          "Account Id": [selectedAccount],
          ...(selectedFilter && { [selectedGroup]: [selectedFilter] }), // Apply selected filter if exists
        },
      };
      console.log(payload)
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/snowflake/dynamic-query?groupBy=${selectedGroup}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTableData(response.data);
    } catch (error) {
      console.error("Error fetching table data:", error);
      setError("Failed to fetch table data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Download Excel
  const downloadExcel = async () => {
    if (tableData.length === 0) {
      console.warn("No data available to download.");
      return;
    }
    try {
      const payload = {
        startMonth: startDate,
        endMonth: endDate,
        filters: {
          "Account Id": [selectedAccount],
          ...(selectedFilter && { [selectedGroup]: [selectedFilter] }),
        },
      };
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/snowflake/download?groupBy=${selectedGroup}`,
        payload,
        { responseType: "json" }, {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const formattedData = response.data.map((item) => ({
        "Usage Month": item.USAGE_MONTH,
        "Group": item[selectedGroup],
        "Total Usage Cost ($)": item.TOTAL_USAGE_COST,
      }));

      const ws = XLSX.utils.json_to_sheet(formattedData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "CostData");
      XLSX.writeFile(wb, "CostData.xlsx");
    } catch (error) {
      console.error("Error downloading Excel:", error);
      setError("Failed to download Excel.");
    }
  };

  // Fetch table data when dependencies change
  useEffect(() => {
    if (selectedGroup && selectedAccount && startDate && endDate) {
      fetchTableData();
    }
  }, [selectedGroup, selectedAccount, selectedFilter, startDate, endDate]);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Cost Explorer
      </Typography>

      {error && (
        <Typography variant="body1" color="error" gutterBottom>
          {error}
        </Typography>
      )}

      <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
        {/* Account Selector */}
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel>Select Account</InputLabel>
            <Select
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              label="Select Account"
            >
              {accounts.map((account) => (
                <MenuItem key={account.accountId} value={account.accountId}>
                  {account.accountName} ({account.accountId})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Group Selector */}
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel>Group By</InputLabel>
            <Select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              label="Group By"
            >
              {groupOptions.map((group) => (
                <MenuItem key={group.id} value={group.displayName}>
                  {group.displayName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Filter Selector */}
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel>Filter Value</InputLabel>
            <Select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              label="Filter Value"
            >
              {filterValues.map((value, index) => (
                <MenuItem key={index} value={value}>
                  {value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Date Selector */}
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel>Start Date</InputLabel>
            <Select
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              label="Start Date"
            >
              {Array.from({ length: 12 }, (_, i) => {
                const month = (i + 1).toString().padStart(2, "0");
                return (
                  <MenuItem key={month} value={`2025-${month}`}>
                    {new Date(2025, i).toLocaleString("default", { month: "long" })} 2025
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>End Date</InputLabel>
            <Select
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              label="End Date"
            >
              {Array.from({ length: 12 }, (_, i) => {
                const month = (i + 1).toString().padStart(2, "0");
                return (
                  <MenuItem key={month} value={`2025-${month}`}>
                    {new Date(2025, i).toLocaleString("default", { month: "long" })} 2025
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Charts */}
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center">
          <CircularProgress />
        </Box>
      ) : (
        <>
          <FusionChart tableData={tableData} />
          <FusionLineChart tableData={tableData} chartType="msline" />
        </>
      )}

      {/* Table */}
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Usage Month</TableCell>
              <TableCell>{selectedGroup}</TableCell>
              <TableCell>Total Usage Cost ($)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.USAGE_MONTH}</TableCell>
                <TableCell>{item[selectedGroup]}</TableCell>
                <TableCell>{item.TOTAL_USAGE_COST}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Download Button */}
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 3 }}
        onClick={downloadExcel}
      >
        Download Excel
      </Button>
    </Box>
  );
};

export default CostExplorer;
