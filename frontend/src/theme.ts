import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    highlight: Palette["primary"];
    stats: {
      total: string;
      completed: string;
      remaining: string;
    };
  }

  interface PaletteOptions {
    highlight?: Partial<Palette["primary"]>;
    stats?: Partial<Palette["stats"]>;
  }
}

export function getTheme(mode: "light" | "dark") {
  return createTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1024,
        xl: 1536,
      },
    },
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
      highlight: {
        main: mode === "light" ? "#eef2ff" : "#1e2240",
      },
      stats: {
        total: "#3b82f6",
        completed: "#22c55e",
        remaining: "#a855f7",
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
      button: {
        textTransform: "none",
        fontWeight: 500,
        fontSize: "1rem", // xl and above (1536px+) — default/base
        "@media (max-width: 1535.95px)": {
          fontSize: "0.95rem", // lg (1200–1535px)
        },
        "@media (max-width: 1199.95px)": {
          fontSize: "0.85rem", // md (900–1199px)
        },
        "@media (max-width: 899.95px)": {
          fontSize: "0.75rem", // sm (600–899px)
        },
        "@media (max-width: 599.95px)": {
          fontSize: "0.6rem", // xs (0–599px)
        },
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 20,
            paddingTop: 4,
            paddingBottom: 4,
            margin: 4,
            boxShadow: "none",
            "&:hover": {
              boxShadow: "none",
            },
          },
        },
        variants: [
          {
            props: { variant: "contained", color: "primary" },
            style: {
              backgroundColor: "#0068ac",
              color: "#ffffff",
              "&:hover": {
                backgroundColor: "#00568c",
              },
            },
          },
          {
            props: { variant: "contained", color: "inherit" },
            style: {
              backgroundColor: mode === "light" ? "#e5e7eb" : "#3a3937",
              color: mode === "light" ? "#2e2c2b" : "#f1f1f1",
              "&:hover": {
                backgroundColor: mode === "light" ? "#d1d5db" : "#4a4947",
              },
            },
          },
        ],
      },
    },
  });
}
