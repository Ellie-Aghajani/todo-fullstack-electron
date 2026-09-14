import { Button, Stack } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setFilter, toggleTheme } from "../store/uiSlice";
import type { Filter } from "../store/uiSlice";

const options: Filter[] = ["all", "active", "completed"];

function FilterBar() {
  const dispatch = useAppDispatch();
  const filter = useAppSelector((state) => state.ui.filter);
  const theme = useAppSelector((state) => state.ui.theme);

  return (
    <Stack direction="row" spacing={1} sx={{ justifyContent: "center", width: "100%" }}>
      {options.map((option) => (
        <Button
          size="small"
          key={option}
          variant="contained"
          color={filter === option ? "primary" : "inherit"}
          onClick={() => dispatch(setFilter(option))}
        >
          {option}
        </Button>
      ))}
      <Button
        size="small"
        variant="contained"
        color="inherit"
        onClick={() => dispatch(toggleTheme())}
      >
        Switch to {theme === "light" ? "dark" : "light"} mode
      </Button>
    </Stack>
  );
}

export default FilterBar;
