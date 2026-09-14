import { ThemeProvider, CssBaseline } from "@mui/material";
import { useMemo } from "react";
import { getTheme } from "./theme";
import { useAppSelector } from "./store/hooks";
import AddTodo from "./components/AddTodo";
import TodoList from "./components/TodoList";
import FilterBar from "./components/FilterBar";
import Header from "./components/Header";

function App() {
  const mode = useAppSelector((state) => state.ui.theme);
  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <AddTodo />
      <FilterBar />
      <TodoList />
    </ThemeProvider>
  );
}

export default App;
