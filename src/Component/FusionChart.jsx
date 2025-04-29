import React from "react";
import FusionCharts from "fusioncharts";
import charts from "fusioncharts/fusioncharts.charts";
import ReactFusioncharts from "react-fusioncharts";
import { Box, Typography } from "@mui/material";

// Resolve charts dependency
charts(FusionCharts);

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

  // Extract keys for labels, series, and values
  const labelKey = Object.keys(tableData[0])[0]; // e.g., "USAGE_MONTH"
  const seriesKey = Object.keys(tableData[0])[1]; // e.g., "LINEITEM_USAGETYPE" or "PRODUCT_PRODUCTNAME"
  const valueKey = Object.keys(tableData[0])[2]; // e.g., "TOTAL_USAGE_COST"

  // Construct categories and dataset
  const categories = [
    {
      category: tableData.map((item) => ({
        label: item[labelKey], // "2025-04"
      })),
    },
  ];

  const dataset = [
    {
      seriesname: seriesKey,
      data: tableData.map((item) => ({
        value: item[valueKey],
      })),
    },
  ];

  const dataSource = {
    chart: {
      caption: "Cost Breakdown by Usage Type",
      subcaption: "Top Usage Costs",
      xaxisname: labelKey,
      yaxisname: "Cost ($)",
      theme: "fusion",
      drawcrossline: "1",
      showvalues: "1",
      numberPrefix: "$",
    },
    categories: categories,
    dataset: dataset,
  };

  return (
    <Box sx={{ p: 3, mb: 3, border: "1px solid #e0e0e0", borderRadius: "8px" }}>
      <Typography variant="h5" align="center" gutterBottom>
        Cost Breakdown
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