import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setFilter, toggleTheme } from "../store/uiSlice";
import type { Filter } from "../store/uiSlice";

const options: Filter[] = ["all", "active", "completed"];

function FilterBar() {
  const dispatch = useAppDispatch();
  const filter = useAppSelector((state) => state.ui.filter);
  const theme = useAppSelector((state) => state.ui.theme);

  return (
    <div>
      {options.map((option) => (
        <button
          key={option}
          onClick={() => dispatch(setFilter(option))}
          disabled={filter === option}
        >
          {option}
        </button>
      ))}
      <button onClick={() => dispatch(toggleTheme())}>
        Switch to {theme === "light" ? "dark" : "light"} mode
      </button>
    </div>
  );
}

export default FilterBar;