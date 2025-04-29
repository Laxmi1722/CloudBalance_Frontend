import React from "react";
import FusionCharts from "fusioncharts";
import charts from "fusioncharts/fusioncharts.charts";
import ReactFusioncharts from "react-fusioncharts";
import { Box, Typography } from "@mui/material";

// Resolve charts dependency
charts(FusionCharts);

const LineChartDisplay = ({ tableData }) => {
  if (!tableData || tableData.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" py={5}>
        <Typography variant="h6" color="textSecondary">
          No data available to display.
        </Typography>
      </Box>
    );
  }

  // Extract keys for dynamic chart generation
  const labelKey = Object.keys(tableData[0])[0]; // First key (e.g., month, service, etc.)
  const seriesKey = Object.keys(tableData[0])[1]; // Second key (e.g., usage type, service name)
  const valueKey = Object.keys(tableData[0])[2]; // Third key (e.g., usage amount)

  // Create categories for the x-axis (e.g., month names, service names, etc.)
  const categories = [
    {
      category: tableData.map((item) => ({
        label: item[seriesKey] || "Unknown",
      })),
    },
  ];

  // Create dataset for the line chart (series)
  const dataset = [
    {
      seriesname: "Amount (USD)", // Static name for the series
      data: tableData.map((item) => ({
        value: item[valueKey] || 0, // Fallback to 0 if no value present
      })),
    },
  ];

  // Define the data source object for FusionCharts
  const dataSource = {
    chart: {
      caption: "Service Wise Total Usage (Line Chart)", // Customizable chart title
      subcaption: "Total Usage Costs by Service", // Customizable subtitle
      xaxisname: labelKey, // Name for x-axis
      yaxisname: "Total Cost (USD)", // y-axis label
      theme: "fusion", // Chart theme
      drawAnchors: "1", // Show anchors on the line
      anchorRadius: "4", // Size of the anchor points
      lineThickness: "2", // Line thickness
      animation: "1", // Enable animation
    },
    categories: categories,
    dataset: dataset,
  };

  return (
    <Box
      sx={{
        p: 3,
        mb: 3,
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#fafafa",
      }}
    >
      <Typography variant="h5" align="center" gutterBottom>
        Service Wise Total Usage
      </Typography>
      <ReactFusioncharts
        type="msline" // Line chart type
        width="100%"
        height="400" // Height of the chart
        dataFormat="JSON"
        dataSource={dataSource} // Pass the data source
      />
    </Box>
  );
};

export default LineChartDisplay;