import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" }, 
    error: { main: "#d32f2f" },   
    warning: { main: "#ffa000" }, 
    success: { main: "#388e3c" }, 
    background: { default: "#f4f6f8" }, 
  },
  typography: {
    fontFamily: "Arial, sans-serif",
    h1: { fontSize: "4rem", fontWeight: 700 },
    h5: { fontSize: "1.5rem", fontWeight: 500 },
  },
});

export default theme;
