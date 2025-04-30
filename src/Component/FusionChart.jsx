
// import React from "react";
// import FusionCharts from "fusioncharts";
// import charts from "fusioncharts/fusioncharts.charts";
// import ReactFusioncharts from "react-fusioncharts";
// import { Box, Typography } from "@mui/material";

// // Resolve charts dependency
// charts(FusionCharts);

// const FusionChart = ({ tableData }) => {
//   if (!tableData || tableData.length === 0) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" py={5}>
//         <Typography variant="h6" color="textSecondary">
//           No data available to display.
//         </Typography>
//       </Box>
//     );
//   }

//   // Detect label and value keys dynamically
//   const keys = Object.keys(tableData[0]);
//   const labelKey =
//     keys.find((k) =>
//       ["product", "service", "name", "type"].some((kw) =>
//         k.toLowerCase().includes(kw)
//       )
//     ) || keys[0];
//   const valueKey =
//     keys.find((k) =>
//       ["cost", "amount", "total"].some((kw) => k.toLowerCase().includes(kw))
//     ) || keys[keys.length - 1];

  
//   const chartData = tableData.map((item) => ({
//     label: item[labelKey],
//     value: item[valueKey],
//   }));

//   const dataSource = {
//     chart: {
//       caption: `Cost Breakdown by ${labelKey.replaceAll("_", " ")}`,
//       subcaption: `Grouped by ${labelKey.replaceAll("_", " ")}`,
//       xAxisName: labelKey.replaceAll("_", " "),
//       yAxisName: "Total Cost ($)",
//       theme: "fusion",
//       numberPrefix: "$",
//       showValues: "1",
//       rotateValues: "1",
//       labelDisplay: "rotate",
//     },
//     data: chartData,
//   };

//   return (
//     <Box sx={{ p: 3, mb: 3, border: "1px solid #e0e0e0", borderRadius: "8px" }}>
//       <Typography variant="h5" align="center" gutterBottom>
//         Cost Breakdown by {labelKey.replaceAll("_", " ")}
//       </Typography>
//       <ReactFusioncharts
//         type="column2d"
//         width="100%"
//         height="400"
//         dataFormat="JSON"
//         dataSource={dataSource}
//       />
//     </Box>
//   );
// };

// export default FusionChart;
// import React from "react";
// 
// import React from "react";
// import FusionCharts from "fusioncharts";
// import charts from "fusioncharts/fusioncharts.charts";
// import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";
// import ReactFusioncharts from "react-fusioncharts";
// import { Box, Typography } from "@mui/material";

// // Resolve charts and theme
// charts(FusionCharts);
// FusionTheme(FusionCharts);

// const FusionChart = ({ tableData }) => {
//   if (!tableData || tableData.length === 0) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" py={5}>
//         <Typography variant="h6" color="textSecondary">
//           No data available to display.
//         </Typography>
//       </Box>
//     );
//   }

//   const keys = Object.keys(tableData[0]);
//   const labelKey =
//     keys.find((k) =>
//       ["product", "service", "name", "type"].some((kw) =>
//         k.toLowerCase().includes(kw)
//       )
//     ) || keys[0];

//   const groupKey =
//     keys.find((k) =>
//       ["region", "zone", "account", "group", "category"].some((kw) =>
//         k.toLowerCase().includes(kw)
//       )
//     ) || null;

//   const valueKey =
//     keys.find((k) =>
//       ["cost", "amount", "total"].some((kw) => k.toLowerCase().includes(kw))
//     ) || keys[keys.length - 1];

//   if (!groupKey) {
//     const chartData = tableData.map((item) => ({
//       label: item[labelKey],
//       value: item[valueKey],
//     }));

//     return (
//       <Box sx={{ p: 3, mb: 3, border: "1px solid #e0e0e0", borderRadius: "8px" }}>
//         <Typography variant="h5" align="center" gutterBottom>
//           Cost Breakdown by {labelKey.replaceAll("_", " ")}
//         </Typography>
//         <ReactFusioncharts
//           type="column2d" // vertical bars (X: service, Y: cost)
//           width="100%"
//           height="400"
//           dataFormat="JSON"
//           dataSource={{
//             chart: {
//               caption: `Cost Breakdown by ${labelKey.replaceAll("_", " ")}`,
//               xAxisName: labelKey.replaceAll("_", " "),
//               yAxisName: "Total Cost ($)",
//               theme: "fusion",
//               numberPrefix: "$",
//               showValues: "1",
//               labelDisplay: "rotate",
//             },
//             data: chartData,
//           }}
//         />
//       </Box>
//     );
//   }

//   const categories = [
//     {
//       category: Array.from(
//         new Set(tableData.map((item) => ({ label: item[labelKey] })))
//       ),
//     },
//   ];

//   const groups = [...new Set(tableData.map((item) => item[groupKey]))];

//   const dataset = groups.map((group) => {
//     return {
//       seriesname: group,
//       data: categories[0].category.map((cat) => {
//         const item = tableData.find(
//           (entry) =>
//             entry[labelKey] === cat.label && entry[groupKey] === group
//         );
//         return {
//           value: item ? item[valueKey] : 0,
//         };
//       }),
//     };
//   });

//   return (
//     <Box sx={{ p: 3, mb: 3, border: "1px solid #e0e0e0", borderRadius: "8px" }}>
//       <Typography variant="h5" align="center" gutterBottom>
//         Grouped Cost Breakdown by {labelKey.replaceAll("_", " ")} and {groupKey.replaceAll("_", " ")}
//       </Typography>
//       <ReactFusioncharts
//         type="mscolumn2d" // vertical grouped bars (X: service, Y: cost)
//         width="100%"
//         height="400"
//         dataFormat="JSON"
//         dataSource={{
//           chart: {
//             caption: `Grouped Cost Breakdown`,
//             xAxisName: labelKey.replaceAll("_", " "),
//             yAxisName: "Total Cost ($)",
//             theme: "fusion",
//             numberPrefix: "$",
//             drawCrossLine: "1",
//             labelDisplay: "rotate",
//           },
//           categories,
//           dataset,
//         }}
//       />
//     </Box>
//   );
// };

// export default FusionChart;
import React from "react";
import FusionCharts from "fusioncharts";
import charts from "fusioncharts/fusioncharts.charts";
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";
import ReactFusioncharts from "react-fusioncharts";
import { Box, Typography } from "@mui/material";

// Resolve charts dependency
charts(FusionCharts);
FusionTheme(FusionCharts);

const FusionChart = ({ tableData }) => {
  if (!tableData || tableData.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" py={5}>
        <Typography variant="h6" color="textSecondary">
          No data available to display.
        </Typography>
      </Box>
    );
  }

  // Detect keys
  const keys = Object.keys(tableData[0]);
  const labelKey =
    keys.find((k) =>
      ["service", "product", "name", "type"].some((kw) =>
        k.toLowerCase().includes(kw)
      )
    ) || keys[0];
  const valueKey =
    keys.find((k) =>
      ["cost", "amount", "total"].some((kw) =>
        k.toLowerCase().includes(kw)
      )
    ) || keys[keys.length - 1];

  // Detect grouping key (e.g., region, date)
  const groupKey =
    keys.find((k) =>
      ["date", "region", "group", "account"].some((kw) =>
        k.toLowerCase().includes(kw)
      )
    ) || null;

  // Group data for multi-series chart
  const categoriesSet = new Set();
  const seriesMap = new Map();

  tableData.forEach((item) => {
    const category = item[labelKey];
    const group = groupKey ? item[groupKey] : "Default";
    const value = item[valueKey];

    categoriesSet.add(category);

    if (!seriesMap.has(group)) {
      seriesMap.set(group, {});
    }
    seriesMap.get(group)[category] = value;
  });

  const categories = Array.from(categoriesSet);

  const dataset = Array.from(seriesMap.entries()).map(([group, values]) => ({
    seriesname: group,
    data: categories.map((category) => ({
      value: values[category] || 0,
    })),
  }));

  const dataSource = {
    chart: {
      caption: `Grouped Cost by ${labelKey?.replaceAll("_", " ") || "Label"}${
        groupKey ? " and " + groupKey.replaceAll("_", " ") : ""
      }`,
      xAxisName: labelKey?.replaceAll("_", " ") || "Label",
      yAxisName: "Total Cost ($)",
      numberPrefix: "$",
      theme: "fusion",
      drawCrossLine: "1",
      showValues: "1",
    },
    categories: [
      {
        category: categories.map((label) => ({ label })),
      },
    ],
    dataset,
  };

  return (
    <Box sx={{ p: 3, mb: 3, border: "1px solid #e0e0e0", borderRadius: "8px" }}>
      <Typography variant="h5" align="center" gutterBottom>
        Grouped Cost Breakdown
      </Typography>
      <ReactFusioncharts
        type="mscolumn2d"
        width="100%"
        height="400"
        dataFormat="JSON"
        dataSource={dataSource}
      />
    </Box>
  );
};

export default FusionChart;
