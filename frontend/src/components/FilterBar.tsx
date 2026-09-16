import { Button, Stack } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setFilter, setSelectedCategoryId } from "../store/uiSlice";
import type { Filter } from "../store/uiSlice";
import { fetchCategories } from "../api/categories";

const options: Filter[] = ["all", "active", "completed"];

function FilterBar() {
  const dispatch = useAppDispatch();
  const filter = useAppSelector((state) => state.ui.filter);
  const selectedCategoryId = useAppSelector(
    (state) => state.ui.selectedCategoryId,
  );

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  return (
    <Stack
      direction="row"
      spacing={1}
      useFlexGap
      sx={{
        justifyContent: "center",
        width: "100%",
        flexWrap: "wrap",
        rowGap: 1,
      }}
    >
      {options.map((option) => (
        <Button
          size="small"
          key={option}
          variant="contained"
          color={filter === option ? "primary" : "inherit"}
          onClick={() => {
            dispatch(setFilter(option));
            if (option === "all") {
              dispatch(setSelectedCategoryId(null));
            }
          }}
          sx={{ minWidth: 100 }}
        >
          {option}
        </Button>
      ))}

      {categories?.map((category) => (
        <Button
          size="small"
          key={category.id}
          variant="contained"
          color={selectedCategoryId === category.id ? "primary" : "inherit"}
          onClick={() =>
            dispatch(
              setSelectedCategoryId(
                selectedCategoryId === category.id ? null : category.id,
              ),
            )
          }
          sx={{ minWidth: 100 }}
        >
          {category.name}
        </Button>
      ))}
    </Stack>
  );
}

export default FilterBar;
