import { createTheme } from "@mui/material/styles";
import type { Theme } from "@mui/material/styles";

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

export const cardColors = {
peach:    { light: "#FFD9B3", dark: "#9A6A45" },
yellow:   { light: "#FFF3B0", dark: "#8F8142" },
mint:     { light: "#C8F0DE", dark: "#3F785C" },
blue:     { light: "#CFE3FA", dark: "#426F9F" },
lavender: { light: "#E6DEFA", dark: "#69568F" },
pink:     { light: "#FBD3DE", dark: "#965A6C" },
} as const;

export type CardColorName = keyof typeof cardColors;

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
        default: mode === "light" ? "#cdeaf5" : "#040e1f",
        paper: mode === "light" ? "#f7f4e7" : "#013365",
      },
      text: {
        primary: mode === "light" ? "#041836" : "#f1f1f1",
        secondary: mode === "light" ? "#5A5D66" : "#9CA3AF",
      },
      highlight: {
        main: mode === "light" ? "#eff5f6" : "#254b6a",
      },
      stats: {
        total: "#f59e0b",
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
        fontSize: "1rem",
        "@media (max-width: 1535.95px)": {
          fontSize: "0.95rem",
        },
        "@media (max-width: 1199.95px)": {
          fontSize: "0.85rem",
        },
        "@media (max-width: 899.95px)": {
          fontSize: "0.75rem",
        },
        "@media (max-width: 599.95px)": {
          fontSize: "0.6rem",
        },
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 999,
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
              backgroundColor: mode === "light" ? "#ffffff" : "#0d2a45",
              color: mode === "light" ? "#041836" : "#f1f1f1",
              "&:hover": {
                backgroundColor: mode === "light" ? "#bfe0ef" : "#123a5e",
              },
            },
          },
          {
            props: { variant: "outlined", color: "primary" },
            style: {
              borderColor: "#0068ac",
              color: "#0068ac",
              backgroundColor: "#fff",
              "&:hover": {
                backgroundColor: mode === "light" ? "#eaf4fa" : "#0d2a45",
                borderColor: "#00568c",
              },
            },
          },
          {
            props: { variant: "outlined", color: "error" },
            style: ({ theme }: { theme: Theme }) => ({
              borderColor: theme.palette.error.main,
              "&:hover": {
                backgroundColor: mode === "light" ? "#fdecea" : "#3a1a1a",
              },
            }),
          },
        ],
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            backgroundColor: mode === "light" ? "#ffffff" : "#0d1b2f",
          },
          input: {
            "&:-webkit-autofill": {
              WebkitBoxShadow: `0 0 0 100px ${mode === "light" ? "#ffffff" : "#0d1b2f"} inset`,
              WebkitTextFillColor: mode === "light" ? "#041836" : "#f1f1f1",
            },
          },
        },
      },
    },
  });
}
