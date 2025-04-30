
import React from "react";
import FusionCharts from "fusioncharts";
import charts from "fusioncharts/fusioncharts.charts";
import ReactFusioncharts from "react-fusioncharts";
import { Box, Typography } from "@mui/material";

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

 
  const keys = Object.keys(tableData[0]);
  const labelKey = keys[0]; 
  const groupByKey = keys[1]; 
  const valueKey =
    keys.find((k) =>
      ["cost", "amount", "total"].some((kw) => k.toLowerCase().includes(kw))
    ) || keys[2];

  const groupedSeries = {};
  tableData.forEach((item) => {
    const groupName = item[groupByKey];
    const label = item[labelKey];
    const value = item[valueKey];

    if (!groupedSeries[groupName]) {
      groupedSeries[groupName] = {};
    }
    groupedSeries[groupName][label] = value;
  });

 
  const uniqueLabels = Array.from(new Set(tableData.map((item) => item[labelKey]))).sort();

  
  const categories = [
    {
      category: uniqueLabels.map((label) => ({ label })),
    },
  ];


  const dataset = Object.keys(groupedSeries).map((groupName) => ({
    seriesname: groupName,
    data: uniqueLabels.map((label) => ({
      value: groupedSeries[groupName][label] || 0,
    })),
  }));

  const dataSource = {
    chart: {
      caption: `Usage Trend by ${groupByKey.replaceAll("_", " ")}`,
      subcaption: `Grouped by ${groupByKey.replaceAll("_", " ")}`,
      xaxisname: labelKey.replaceAll("_", " "),
      yaxisname: "Total Cost (USD)",
      theme: "fusion",
      drawAnchors: "1",
      anchorRadius: "4",
      lineThickness: "2",
      animation: "1",
      showValues: "0",
    },
    categories,
    dataset,
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
        Usage Trend by {groupByKey.replaceAll("_", " ")}
      </Typography>
      <ReactFusioncharts
        type="msline"
        width="100%"
        height="400"
        dataFormat="JSON"
        dataSource={dataSource}
      />
    </Box>
  );
};

export default LineChartDisplay;
