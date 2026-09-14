import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import { useMemo } from "react";
import { getTheme } from "./theme";
import { useAppSelector } from "./store/hooks";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";

function App() {
  const mode = useAppSelector((state) => state.ui.theme);
  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex", width: "100%", minHeight: "100vh", overflowX: "hidden" }}>
        <Sidebar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            minWidth: 0,
            padding: { xs: 2, sm: 3 },
            boxSizing: "border-box",
          }}
        >
          <MainContent />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;