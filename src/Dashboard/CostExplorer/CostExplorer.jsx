
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import FusionCharts from "fusioncharts";
import Charts from "fusioncharts/fusioncharts.charts";
import ReactFusionCharts from "react-fusioncharts";
import axios from "axios";
import { useSelector } from "react-redux";

ReactFusionCharts.fcRoot(FusionCharts, Charts);

const columnMappings = {
  "Service": "PRODUCT_PRODUCTNAME",
  "Instance Type": "MYCLOUD_INSTANCETYPE",
  "Account ID": "LINKEDACCOUNTID",
  "Usage Type": "LINEITEM_USAGETYPE",
  "Platform": "MYCLOUD_PLATFORM",
  "Region": "MYCLOUD_REGIONNAME",
};

const CostExplorer = () => {
  const token = useSelector((state) => state.auth.token);
  const [accountId, setAccountId] = useState(""); 
  const [accounts, setAccounts] = useState([]); 
  const [groupBy, setGroupBy] = useState("Service"); 
  const [startDate, setStartDate] = useState("2025-01"); 
  const [endDate, setEndDate] = useState("2025-12"); 
  const [chartData, setChartData] = useState([]); 
  const [lineChartData, setLineChartData] = useState([]); 
  const [tableData, setTableData] = useState([]); 
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(""); 

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
      } catch (error) {
        console.error("Error fetching accounts:", error);
        setError("Failed to load account information.");
      }
    };

    fetchAccounts();
  }, [token]);

  
  useEffect(() => {
    const fetchData = async () => {
      if (!accountId) return;
      setLoading(true);
      setError("");

      try {
        const payload = {
          startMonth: startDate,
          endMonth: endDate,
          filters: {
            [columnMappings["Account ID"]]: [accountId],
          },
        };

        const response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/grouped-data?groupBy=${columnMappings[groupBy]}`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = response.data;

        // Prepare chart data for the bar chart
        const barChartData = data.slice(0, 5).map((item) => ({
          label: item[columnMappings[groupBy]],
          value: item.TOTAL_USAGE_COST,
        }));
        setChartData(barChartData);

      
        const lineChartData = data.map((item) => ({
          label: item.USAGE_MONTH,
          value: item.TOTAL_USAGE_COST,
        }));
        setLineChartData(lineChartData);

      
        setTableData(data.slice(0, 5)); 
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch cost data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [accountId, groupBy, startDate, endDate, token]);


  const barChartConfigs = {
    type: "column2d", 
    width: "100%", 
    height: "400", 
    dataFormat: "json", 
    dataSource: {
      chart: {
        caption: "Cost Explorer",
        subCaption: `Top 5 ${groupBy} by Cost`,
        xAxisName: groupBy,
        yAxisName: "Cost ($)",
        numberPrefix: "$",
        theme: "fusion",
      },
      data: chartData,
    },
  };

  const lineChartConfigs = {
    type: "line", 
    width: "100%", 
    height: "400", 
    dataFormat: "json", 
    dataSource: {
      chart: {
        caption: "Cost Trends Over Time",
        subCaption: `Monthly Cost for ${groupBy}`,
        xAxisName: "Month",
        yAxisName: "Cost ($)",
        numberPrefix: "$",
        theme: "fusion",
      },
      data: lineChartData,
    },
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold"  sx={{ color: "#007BFF" }} gutterBottom>
        Cost Explorer
      </Typography>

      {error && (
        <Typography variant="body1" color="error" gutterBottom>
          {error}
        </Typography>
      )}

      <Grid container spacing={7} alignItems="center" sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth sx={{ minWidth: 300 }}>
            <InputLabel>Select Account</InputLabel>
            <Select
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
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

        {/* Start Date */}
        <Grid item xs={12} sm={4}>
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
        </Grid>

        {/* End Date */}
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
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

      {/* Group By Tabs */}
      <Tabs
        value={groupBy}
        onChange={(e, newValue) => setGroupBy(newValue)}
        textColor="primary"
        indicatorColor="primary"
        sx={{ mb: 3 }}
      >
        {Object.keys(columnMappings).map((key) => (
          <Tab key={key} label={key} value={key} />
        ))}
      </Tabs>

      {/* Bar Chart */}
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" py={5}>
          <CircularProgress />
        </Box>
      ) : (
        <ReactFusionCharts {...barChartConfigs} />
      )}

      {/* Line Chart */}
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" py={5}>
          <CircularProgress />
        </Box>
      ) : (
        <ReactFusionCharts {...lineChartConfigs} />
      )}

      {/* Data Table */}
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Month</TableCell>
              <TableCell>{groupBy}</TableCell>
              <TableCell>Total Usage Cost</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.USAGE_MONTH}</TableCell>
                <TableCell>{row[columnMappings[groupBy]]}</TableCell>
                <TableCell>{row.TOTAL_USAGE_COST}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CostExplorer;
// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Typography,
//   Tabs,
//   Tab,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   Grid,
//   CircularProgress,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Button,
// } from "@mui/material";
// import FusionCharts from "fusioncharts";
// import Charts from "fusioncharts/fusioncharts.charts";
// import ReactFusionCharts from "react-fusioncharts";
// import axios from "axios";
// import * as XLSX from "xlsx"; // Import XLSX for Excel download
// import { useSelector } from "react-redux";

// // Include the FusionCharts library
// ReactFusionCharts.fcRoot(FusionCharts, Charts);

// const columnMappings = {
//   "Service": "PRODUCT_PRODUCTNAME",
//   "Instance Type": "MYCLOUD_INSTANCETYPE",
//   "Account ID": "LINKEDACCOUNTID",
//   "Usage Type": "LINEITEM_USAGETYPE",
//   "Platform": "MYCLOUD_PLATFORM",
//   "Region": "MYCLOUD_REGIONNAME",
// };

// const CostExplorer = () => {
//   const token = useSelector((state) => state.auth.token);
//   const [accountId, setAccountId] = useState(""); 
//   const [accounts, setAccounts] = useState([]); 
//   const [groupBy, setGroupBy] = useState("Service"); 
//   const [startDate, setStartDate] = useState("2025-01"); 
//   const [endDate, setEndDate] = useState("2025-12"); 
//   const [chartData, setChartData] = useState([]); 
//   const [lineChartData, setLineChartData] = useState([]); 
//   const [tableData, setTableData] = useState([]); 
//   const [loading, setLoading] = useState(false); 
//   const [error, setError] = useState(""); 

//   useEffect(() => {
//     const fetchAccounts = async () => {
//       try {
//         const response = await axios.get(
//           `${process.env.REACT_APP_API_BASE_URL}/user/available-cloudaccounts/names-and-ids`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         setAccounts(response.data);
//       } catch (error) {
//         console.error("Error fetching accounts:", error);
//         setError("Failed to load account information.");
//       }
//     };

//     fetchAccounts();
//   }, [token]);

  
//   useEffect(() => {
//     const fetchData = async () => {
//       if (!accountId) return;
//       setLoading(true);
//       setError("");

//       try {
//         const payload = {
//           startMonth: startDate,
//           endMonth: endDate,
//           filters: {
//             [columnMappings["Account ID"]]: [accountId],
//           },
//         };

//         const response = await axios.post(
//           `${process.env.REACT_APP_API_BASE_URL}/grouped-data?groupBy=${columnMappings[groupBy]}`,
//           payload,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );

//         const data = response.data;

//         // Prepare chart data for the bar chart
//         const barChartData = data.slice(0, 5).map((item) => ({
//           label: item[columnMappings[groupBy]],
//           value: item.TOTAL_USAGE_COST,
//         }));
//         setChartData(barChartData);

//         // Prepare chart data for the line chart
//         const lineChartData = data.map((item) => ({
//           label: item.USAGE_MONTH,
//           value: item.TOTAL_USAGE_COST,
//         }));
//         setLineChartData(lineChartData);

//         // Set table data
//         setTableData(data.slice(0, 5)); // Top 5 services
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         setError("Failed to fetch cost data. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [accountId, groupBy, startDate, endDate, token]);


//   const barChartConfigs = {
//     type: "column2d", 
//     width: "100%", 
//     height: "400", 
//     dataFormat: "json", 
//     dataSource: {
//       chart: {
//         caption: "Cost Explorer",
//         subCaption: `Top 5 ${groupBy} by Cost`,
//         xAxisName: groupBy,
//         yAxisName: "Cost ($)",
//         numberPrefix: "$",
//         theme: "fusion",
//       },
//       data: chartData,
//     },
//   };

//   const lineChartConfigs = {
//     type: "line", 
//     width: "100%", 
//     height: "400", 
//     dataFormat: "json", 
//     dataSource: {
//       chart: {
//         caption: "Cost Trends Over Time",
//         subCaption: `Monthly Cost for ${groupBy}`,
//         xAxisName: "Month",
//         yAxisName: "Cost ($)",
//         numberPrefix: "$",
//         theme: "fusion",
//       },
//       data: lineChartData,
//     },
//   };

//   const handleDownloadExcel = () => {
//     const worksheet = XLSX.utils.json_to_sheet(tableData); // Convert table data to worksheet
//     const workbook = XLSX.utils.book_new(); // Create a new workbook
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Cost Data"); // Append the worksheet
//     XLSX.writeFile(workbook, "CostExplorerData.xlsx"); // Download the Excel file
//   };

//   return (
//     <Box sx={{ p: 3 }}>
//       <Typography variant="h4" fontWeight="bold"  sx={{ color: "#007BFF" }} gutterBottom>
//         Cost Explorer
//       </Typography>

//       {error && (
//         <Typography variant="body1" color="error" gutterBottom>
//           {error}
//         </Typography>
//       )}

//       <Grid container spacing={7} alignItems="center" sx={{ mb: 3 }}>
//         <Grid item xs={12} sm={4}>
//           <FormControl fullWidth sx={{ minWidth: 300 }}>
//             <InputLabel>Select Account</InputLabel>
//             <Select
//               value={accountId}
//               onChange={(e) => setAccountId(e.target.value)}
//               label="Select Account"
//             >
//               {accounts.map((account) => (
//                 <MenuItem key={account.accountId} value={account.accountId}>
//                   {account.accountName} ({account.accountId})
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         </Grid>

//         {/* Start Date */}
//         <Grid item xs={12} sm={4}>
//           <FormControl fullWidth>
//             <InputLabel>Start Date</InputLabel>
//             <Select
//               value={startDate}
//               onChange={(e) => setStartDate(e.target.value)}
//               label="Start Date"
//             >
//               {Array.from({ length: 12 }, (_, i) => {
//                 const month = (i + 1).toString().padStart(2, "0");
//                 return (
//                   <MenuItem key={month} value={`2025-${month}`}>
//                     {new Date(2025, i).toLocaleString("default", { month: "long" })} 2025
//                   </MenuItem>
//                 );
//               })}
//             </Select>
//           </FormControl>
//         </Grid>

//         {/* End Date */}
//         <Grid item xs={12} sm={4}>
//           <FormControl fullWidth>
//             <InputLabel>End Date</InputLabel>
//             <Select
//               value={endDate}
//               onChange={(e) => setEndDate(e.target.value)}
//               label="End Date"
//             >
//               {Array.from({ length: 12 }, (_, i) => {
//                 const month = (i + 1).toString().padStart(2, "0");
//                 return (
//                   <MenuItem key={month} value={`2025-${month}`}>
//                     {new Date(2025, i).toLocaleString("default", { month: "long" })} 2025
//                   </MenuItem>
//                 );
//               })}
//             </Select>
//           </FormControl>
//         </Grid>
//       </Grid>

//       {/* Group By Tabs */}
//       <Tabs
//         value={groupBy}
//         onChange={(e, newValue) => setGroupBy(newValue)}
//         textColor="primary"
//         indicatorColor="primary"
//         sx={{ mb: 3 }}
//       >
//         {Object.keys(columnMappings).map((key) => (
//           <Tab key={key} label={key} value={key} />
//         ))}
//       </Tabs>

//       {/* Bar Chart */}
//       {loading ? (
//         <Box display="flex" justifyContent="center" alignItems="center" py={5}>
//           <CircularProgress />
//         </Box>
//       ) : (
//         <ReactFusionCharts {...barChartConfigs} />
//       )}

//       {/* Line Chart */}
//       {loading ? (
//         <Box display="flex" justifyContent="center" alignItems="center" py={5}>
//           <CircularProgress />
//         </Box>
//       ) : (
//         <ReactFusionCharts {...lineChartConfigs} />
//       )}

//       {/* Data Table */}
//       <TableContainer component={Paper} sx={{ mt: 3 }}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Month</TableCell>
//               <TableCell>{groupBy}</TableCell>
//               <TableCell>Total Usage Cost</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {tableData.map((row, index) => (
//               <TableRow key={index}>
//                 <TableCell>{row.USAGE_MONTH}</TableCell>
//                 <TableCell>{row[columnMappings[groupBy]]}</TableCell>
//                 <TableCell>{row.TOTAL_USAGE_COST}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       {/* Download Button */}
//       <Box display="flex" justifyContent="flex-end" sx={{ mt: 2 }}>
//         <Button variant="contained" color="primary" onClick={handleDownloadExcel}>
//           Download Excel
//         </Button>
//       </Box>
//     </Box>
//   );
// };

// export default CostExplorer;