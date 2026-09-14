import { createTheme } from "@mui/material/styles";

export function getTheme(mode: "light" | "dark") {
  return createTheme({
    palette: {
      mode,
      primary: {
        main: "#0068ac",
      },
      background: {
        default: mode === "light" ? "#f1f1f1" : "#1a1918",
        paper: mode === "light" ? "#FFFFFF" : "#2e2c2b",
      },
      text: {
        primary: mode === "light" ? "#2e2c2b" : "#f1f1f1",
        secondary: mode === "light" ? "#5A5D66" : "#9CA3AF",
      },
    },
    shape: {
      borderRadius: 12,
    },
    typography: {
      fontFamily: '"Inter", "Segoe UI", system-ui, sans-serif',
      h1: {
        textTransform: "uppercase",
        letterSpacing: "1.5px",
        fontWeight: 500,
        fontSize: "2rem",
      },
      h2: {
        textTransform: "uppercase",
        letterSpacing: "1px",
        fontWeight: 500,
        fontSize: "1.25rem",
      },
    },
  });
}