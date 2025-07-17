
// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Typography,
//   Grid,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   Button,
//   CircularProgress,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Checkbox,
//   ListItemText,
// } from "@mui/material";

// import { useSelector } from "react-redux";
// import FusionChart from "../../Component/FusionChart";
// import FusionLineChart from "../../Component/FusionLineChart";
// import * as XLSX from "xlsx";
// import axiosInstance from "../../utils/axiosInterceptor";

// const CostExplorer = () => {
//   const [groupOptions, setGroupOptions] = useState([]);
//   const [groupBy, setGroupBy] = useState("");
//   const [filterColumns, setFilterColumns] = useState([]);
//   const [filterValuesMap, setFilterValuesMap] = useState({});
//   const [selectedFilters, setSelectedFilters] = useState({});
//   const [accounts, setAccounts] = useState([]);
//   const [selectedAccount, setSelectedAccount] = useState("");
//   const [startDate, setStartDate] = useState("2025-01");
//   const [endDate, setEndDate] = useState("2025-12");
//   const [tableData, setTableData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const token = useSelector((state) => state.auth.token);

//   useEffect(() => {
//     const fetchGroupOptions = async () => {
//       try {
      
//         const response = await axiosInstance.get("/snowflake/column");
//         setGroupOptions(response.data.map((opt) => opt.displayName));
//       } catch (error) {
//         console.error("Error fetching group options:", error);
//         setError("Failed to load group options.");
//       }
//     };
//     fetchGroupOptions();
//   }, [token]);

//   useEffect(() => {
//     const fetchAccounts = async () => {
//       try {
        
//         const response = await axiosInstance.get(
//           "/user/available-cloudaccounts/names-and-ids"
//         );
//         setAccounts(response.data);
//         if (response.data.length > 0) {
//           setSelectedAccount(response.data[0].accountId);
//         }
//       } catch (error) {
//         console.error("Error fetching accounts:", error);
//         setError("Failed to load account information.");
//       }
//     };
//     fetchAccounts();
//   }, [token]);

//   useEffect(() => {
//     const fetchFilterValues = async () => {
//       const newMap = {};
//       for (const column of filterColumns) {
//         try {
         
//           const response= await axiosInstance.get("/snowflake/columnDetails",{
//             params: { columnName: column }, // Pass columnName as a query parameter
//           })
//           const values = response.data.map((item) => item[column]);
//           newMap[column] = [...new Set(values)];
//         } catch (error) {
//           console.error(`Error fetching filter values for ${column}:`, error);
//         }
//       }
//       setFilterValuesMap(newMap);
//     };

//     if (filterColumns.length > 0) {
//       fetchFilterValues();
//     }
//   }, [filterColumns, token]);

//   const fetchTableData = async () => {
//     if (!groupBy || !selectedAccount) return;
//     setLoading(true);
//     setError("");

//     try {
//       const filters = {
//         "Account Id": [selectedAccount],
//       };

//       for (const column of filterColumns) {
//         if (selectedFilters[column]?.length) {
//           filters[column] = selectedFilters[column];
//         }
//       }

//       const payload = {
//         startMonth: startDate,
//         endMonth: endDate,
//         filters,
//       };

    
   
//         const response=await axiosInstance.post(`/snowflake/dynamic-query?groupBy=${groupBy}`,payload)
//       const sortedData = response.data.sort(
//         (a, b) => b.TOTAL_USAGE_COST - a.TOTAL_USAGE_COST
//       );
//       setTableData(sortedData);
//     } catch (error) {
//       console.error("Error fetching table data:", error);
//       setError("Failed to fetch table data.");
//     } finally {
//       setLoading(false);
//     }
//   };


//   const downloadExcel = async () => {
//     if (tableData.length === 0 || !groupBy) {
//       setError("Please select a 'Group By' option and ensure data is available.");
//       return;
//     }
  
//     try {
//       const formattedData = tableData.map((item) => ({
//         "Usage Month": item.USAGE_MONTH,
//         [groupBy]: item[groupBy],
//         "Total Usage Cost ($)": item.TOTAL_USAGE_COST,
//       }));
  
//       const worksheet = XLSX.utils.json_to_sheet(formattedData);
//       const workbook = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(workbook, worksheet, "CostData");
//       XLSX.writeFile(workbook, "CostData.xlsx");
//     } catch (error) {
//       console.error("Error downloading Excel:", error);
//       setError("Failed to download Excel.");
//     }
//   };
  

//   useEffect(() => {
//     if (groupBy && selectedAccount && startDate && endDate) {
//       fetchTableData();
//     }
//   }, [groupBy, selectedFilters, selectedAccount, startDate, endDate]);

//   return (
//     <Box sx={{ p: 4 }}>
     
//       <Box
//   sx={{
//     p: 4,
//     width: "100%", 
//     maxWidth: "170rem", 
//     margin: "0 auto", 
//     "@media (max-width: 1101px)": {
//       maxWidth: "900px", 
//     },
//     "@media (max-width: 889px)": {
//       maxWidth: "700px", 
//     },
//     "@media (max-width: 600px)": {
//       maxWidth: "100%", 
//       padding: "16px", 
//     },
//   }}
// >
//         <Typography
       
//           variant="h4"
//           sx={{
//             color: "#007BFF",
//             fontWeight: "bold",
//             position: "sticky",
//             top: 0,
//             zIndex: 10,
//             backgroundColor: "#fff",
//             py: 1,
//             borderBottom: "1px solid #ddd",
//             textAlign:"center",
            

          
            
//           }}
//         >
//              Cost Explorer
//         </Typography>
//       </Box>

//       {error && (
//         <Typography variant="body1" color="error" gutterBottom>
//           {error}
//         </Typography>
//       )}

//       {/* Filter Section */}
//       <Grid container spacing={3} alignItems="center" sx={{ mb: 3 ,ml:4}}>
//         <Grid item xs={12} sm={6} md={3} sx={{width:"15rem"}}>
//           <FormControl fullWidth>
//             <InputLabel>Select Account</InputLabel>
//             <Select
//               value={selectedAccount}
//               onChange={(e) => setSelectedAccount(e.target.value)}
//               label="Select Account"
//             >
//               {accounts.map((acc) => (
//                 <MenuItem key={acc.accountId} value={acc.accountId}>
//                   {acc.accountName} ({acc.accountId})
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         </Grid>

//         <Grid item xs={12} sm={6} md={3}sx={{width:"15rem"}}>
//           <FormControl fullWidth>
//             <InputLabel>Group By</InputLabel>
//             <Select
//               value={groupBy}
//               onChange={(e) => setGroupBy(e.target.value)}
//               label="Group By"
//             >
//               {groupOptions.map((group) => (
//                 <MenuItem key={group} value={group}>
//                   {group}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         </Grid>

//         <Grid item xs={12} md={3} sx={{width:"15rem"}}>
//           <FormControl fullWidth>
//             <InputLabel>Filter Columns</InputLabel>
//             <Select
//               multiple
//               value={filterColumns}
//               onChange={(e) => setFilterColumns(e.target.value)}
//               renderValue={(selected) => selected.join(", ")}
//               label="Filter Columns"
//             >
//               {groupOptions.map((group) => (
//                 <MenuItem key={group} value={group}>
//                   <Checkbox checked={filterColumns.includes(group)} />
//                   <ListItemText primary={group} />
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         </Grid>

//         {/* Start and End Date */}
//         <Grid item xs={12} md={3} sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
//           <FormControl>
//             <InputLabel>Start Date</InputLabel>
//             <Select
//               value={startDate}
//               onChange={(e) => setStartDate(e.target.value)}
//               label="Start Date"
//               sx={{ minWidth: "10rem" }}
//             >
//               {Array.from({ length: 12 }, (_, i) => {
//                 const month = (i + 1).toString().padStart(2, "0");
//                 return (
//                   <MenuItem key={month} value={`2025-${month}`}>
//                     {new Date(2025, i).toLocaleString("default", {
//                       month: "long",
//                     })}{" "}
//                     2025
//                   </MenuItem>
//                 );
//               })}
//             </Select>
//           </FormControl>

//           <FormControl>
//             <InputLabel>End Date</InputLabel>
//             <Select
//               value={endDate}
//               onChange={(e) => setEndDate(e.target.value)}
//               label="End Date"
//               sx={{ minWidth: "10rem" }}
//             >
//               {Array.from({ length: 12 }, (_, i) => {
//                 const month = (i + 1).toString().padStart(2, "0");
//                 return (
//                   <MenuItem key={month} value={`2025-${month}`}>
//                     {new Date(2025, i).toLocaleString("default", {
//                       month: "long",
//                     })}{" "}
//                     2025
//                   </MenuItem>
//                 );
//               })}
//             </Select>
//           </FormControl>
//         </Grid>
//       </Grid>

//       {/* Filter Values per Selected Column */}
//       <Grid container spacing={3} sx={{
//     ml: Object.keys(selectedFilters).some(
//       (key) => selectedFilters[key]?.length > 0
//     )
//       ? 3.7 // Increase left margin when filters are selected
//       : 0, // Default margin when no filters are selected
//   }}>
//         {filterColumns.map((column) => (
//           <Grid item xs={12} sm={6} md={4} key={column}>
//             <FormControl fullWidth sx={{ width: "15rem" }}>
//               <InputLabel>{`Filter: ${column}`}</InputLabel>
//               <Select
//                 multiple
//                 value={selectedFilters[column] || []}
//                 onChange={(e) =>
//                   setSelectedFilters((prev) => ({
//                     ...prev,
//                     [column]: e.target.value,
//                   }))
//                 }
//                 renderValue={(selected) => selected.join(", ")}
//                 label={`Filter: ${column}`}
//               >
//                 {filterValuesMap[column]?.map((value, idx) => (
//                   <MenuItem key={idx} value={value}>
//                     <Checkbox checked={selectedFilters[column]?.includes(value)} />
//                     <ListItemText primary={value} />
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Grid>
//         ))}
//       </Grid>

     
//       {loading ? (
//         <Box display="flex" justifyContent="center" sx={{ mt: 5 }}>
//           <CircularProgress />
//         </Box>
//       ) : (
//         <>
//           <FusionChart tableData={tableData} />
//           <FusionLineChart tableData={tableData} chartType="msline" />
//         </>
//       )}

//       {/* Data Table */}
//       <TableContainer component={Paper} sx={{ mt: 4, maxHeight: "400px" }}>
//         <Table stickyHeader>
//           <TableHead>
//             <TableRow>
//               <TableCell sx={{ fontWeight: "bold" }}>Usage Month</TableCell>
//               {groupBy && <TableCell sx={{ fontWeight: "bold" }}>{groupBy}</TableCell>}
//               <TableCell sx={{ fontWeight: "bold" }}>Total Usage Cost ($)</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {tableData.map((item, index) => (
//               <TableRow key={index}>
//                 <TableCell>{item.USAGE_MONTH}</TableCell>
//                 {groupBy && <TableCell>{item[groupBy]}</TableCell>}
//                 <TableCell>{item.TOTAL_USAGE_COST}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

    
//       <Button
//         variant="contained"
//         color="primary"
//         sx={{ mt: 3, width: "100%" }}
//         onClick={downloadExcel}
//       >
//         Download Excel
//       </Button>
//     </Box>
//   );
// };

// export default CostExplorer;
// 
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  InputLabel,
  FormControl,
  Menu,
  MenuItem,
  Checkbox,
  ListItemText,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  FormControlLabel,
  TextField,
  Select,
  OutlinedInput,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import * as XLSX from "xlsx";
import axiosInstance from "../../utils/axiosInterceptor";
import FusionChart from "../../Component/FusionChart"
import FusionLineChart from "../../Component/FusionLineChart";
import { useSelector } from "react-redux";

const CostExplorer = () => {
  const [groupOptions, setGroupOptions] = useState([]);
  const [groupBy, setGroupBy] = useState("Service");
  const [filterAnchor, setFilterAnchor] = useState(null);
  const [filterColumns, setFilterColumns] = useState([]);
  const [filterValuesMap, setFilterValuesMap] = useState({});
  const [selectedFilters, setSelectedFilters] = useState({});
  const [valueAnchorEls, setValueAnchorEls] = useState({});
  const [othersColumns, setOthersColumns] = useState([]);
  const [othersAnchor, setOthersAnchor] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [startDate, setStartDate] = useState("2025-01");
  const [endDate, setEndDate] = useState("2025-12");
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = useSelector((state) => state.auth.token);

  // Fetch group options
  useEffect(() => {
    const fetchGroupOptions = async () => {
      try {
        const response = await axiosInstance.get("/snowflake/column");
        const allColumns = response.data.map((opt) => opt.displayName);

        const mainColumns = ["Service", "Instance Type", "Account ID", "Usage Type Group"];
        const others = allColumns.filter((col) => !mainColumns.includes(col));

        setGroupOptions(mainColumns);
        setOthersColumns(others);
      } catch (error) {
        console.error("Error fetching group options:", error);
        setError("Failed to load group options.");
      }
    };
    fetchGroupOptions();
  }, [token]);

  // Fetch accounts
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await axiosInstance.get(
          "/user/available-cloudaccounts/names-and-ids"
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

  // Fetch filter values for selected columns
  useEffect(() => {
    const fetchFilterValues = async () => {
      const newMap = {};
      for (const column of filterColumns) {
        try {
          const response = await axiosInstance.get("/snowflake/columnDetails", {
            params: { columnName: column },
          });
          const values = response.data.map((item) => item[column]);
          newMap[column] = [...new Set(values)];
        } catch (error) {
          console.error(`Error fetching filter values for ${column}:`, error);
        }
      }
      setFilterValuesMap(newMap);
    };

    if (filterColumns.length > 0) {
      fetchFilterValues();
    }
  }, [filterColumns]);

  const fetchTableData = async () => {
    if (!groupBy || !selectedAccount) return;
    setLoading(true);
    setError("");

    try {
      const filters = {
        "Account Id": [selectedAccount],
      };

      for (const column of filterColumns) {
        if (selectedFilters[column]?.length) {
          filters[column] = selectedFilters[column];
        }
      }

      const payload = {
        startMonth: startDate,
        endMonth: endDate,
        filters,
      };

      const response = await axiosInstance.post(
        `/snowflake/dynamic-query?groupBy=${groupBy}`,
        payload
      );
      const sortedData = response.data.sort(
        (a, b) => b.TOTAL_USAGE_COST - a.TOTAL_USAGE_COST
      );
      setTableData(sortedData);
    } catch (error) {
      console.error("Error fetching table data:", error);
      setError("Failed to fetch table data.");
    } finally {
      setLoading(false);
    }
  };

  const downloadExcel = () => {
    if (tableData.length === 0 || !groupBy) {
      setError("Please select a 'Group By' option and ensure data is available.");
      return;
    }

    try {
      const formattedData = tableData.map((item) => ({
        "Usage Month": item.USAGE_MONTH,
        [groupBy]: item[groupBy],
        "Total Usage Cost ($)": item.TOTAL_USAGE_COST,
      }));

      const worksheet = XLSX.utils.json_to_sheet(formattedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "CostData");
      XLSX.writeFile(workbook, "CostData.xlsx");
    } catch (error) {
      console.error("Error downloading Excel:", error);
      setError("Failed to download Excel.");
    }
  };

  // Filter Handlers
  const handleFilterClick = (event) => {
    setFilterAnchor(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchor(null);
  };

  const handleFilterToggle = (column) => {
    const newFilters = filterColumns.includes(column)
      ? filterColumns.filter((c) => c !== column)
      : [...filterColumns, column];
    setFilterColumns(newFilters);
  };

  const handleValueMenuOpen = (event, column) => {
    setValueAnchorEls((prev) => ({ ...prev, [column]: event.currentTarget }));
  };

  const handleValueMenuClose = (column) => {
    setValueAnchorEls((prev) => ({ ...prev, [column]: null }));
  };

  const handleValueToggle = (column, value) => {
    const currentValues = selectedFilters[column] || [];
    const updatedValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];
    setSelectedFilters((prev) => ({ ...prev, [column]: updatedValues }));
  };

  const handleOthersClick = (event) => {
    setOthersAnchor(event.currentTarget);
  };

  const handleOthersClose = () => {
    setOthersAnchor(null);
  };

  const handleGroupByChange = (group) => {
    setGroupBy(group);
    setOthersAnchor(null);
  };

  useEffect(() => {
    if (groupBy && selectedAccount && startDate && endDate) {
      fetchTableData();
    }
  }, [groupBy, selectedFilters, selectedAccount, startDate, endDate]);

  return (
    <Box p={4}>
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 3 }}>
        Cost Explorer
      </Typography>

      {error && (
        <Typography variant="body1" color="error" gutterBottom>
          {error}
        </Typography>
      )}

      {/* Group By Section */}
      <Box display="flex" gap={2} mb={3} alignItems="center">
        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
          Group By:
        </Typography>
        {groupOptions.map((group) => (
          <Button
            key={group}
            variant={groupBy === group ? "contained" : "outlined"}
            onClick={() => handleGroupByChange(group)}
          >
            {group}
          </Button>
        ))}
        <Button
          variant={groupBy === "Others" ? "contained" : "outlined"}
          onClick={handleOthersClick}
        >
          Others
        </Button>
        <Menu
          anchorEl={othersAnchor}
          open={Boolean(othersAnchor)}
          onClose={handleOthersClose}
        >
          {othersColumns.map((col) => (
            <MenuItem key={col} onClick={() => handleGroupByChange(col)}>
              {col}
            </MenuItem>
          ))}
        </Menu>
      </Box>
      <Box display="flex" gap={2} alignItems="center" mb={3}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Account</InputLabel>
          <Select
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
            input={<OutlinedInput label="Account" />}
          >
            {accounts.map((acc) => (
              <MenuItem key={acc.accountId} value={acc.accountId}>
                {acc.accountName} ({acc.accountId})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          type="month"
          label="Start Month"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <TextField
          type="month"
          label="End Month"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </Box>


      {/* Filters Section */}
      <Box display="flex" justifyContent="flex-end" mb={3}>
        <Tooltip title="Filters">
          <IconButton onClick={handleFilterClick}>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={filterAnchor}
          open={Boolean(filterAnchor)}
          onClose={handleFilterClose}
        >
          {[...groupOptions, ...othersColumns].map((col) => (
            <MenuItem key={col}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filterColumns.includes(col)}
                    onChange={() => handleFilterToggle(col)}
                  />
                }
                label={col}
                onClick={(e) => handleValueMenuOpen(e, col)}
              />
              <Menu
                anchorEl={valueAnchorEls[col]}
                open={Boolean(valueAnchorEls[col])}
                onClose={() => handleValueMenuClose(col)}
              >
                {filterValuesMap[col]?.map((val) => (
                  <MenuItem
                    key={val}
                    onClick={() => handleValueToggle(col, val)}
                  >
                    <Checkbox checked={selectedFilters[col]?.includes(val)} />
                    <ListItemText primary={val} />
                  </MenuItem>
                ))}
              </Menu>
            </MenuItem>
          ))}
        </Menu>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" sx={{ mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        // <Typography>Graph Placeholder (FusionChart/FusionLineChart)</Typography>
        <>
                 <FusionChart tableData={tableData} />
                 <FusionLineChart tableData={tableData} chartType="msline" />
               </>
      )}
        
        

      {/* Data Table */}
      <TableContainer component={Paper} sx={{ mt: 4, maxHeight: 400 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Usage Month</TableCell>
              {groupBy && <TableCell sx={{ fontWeight: "bold" }}>{groupBy}</TableCell>}
              <TableCell sx={{ fontWeight: "bold" }}>Total Usage Cost ($)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.USAGE_MONTH}</TableCell>
                {groupBy && <TableCell>{item[groupBy]}</TableCell>}
                <TableCell>{item.TOTAL_USAGE_COST}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 3, width: "100%" }}
        onClick={downloadExcel}
      >
        Download Excel
      </Button>
    </Box>
  );
};

export default CostExplorer;
