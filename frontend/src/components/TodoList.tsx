import { useQuery } from "@tanstack/react-query";
import { Typography } from "@mui/material";
import { fetchTodos } from "../api/todos";
import { fetchCategories } from "../api/categories";
import { useAppSelector } from "../store/hooks";
import TodoItem from "./TodoItem";

function TodoList() {
  const {
    data: todos,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });
  const filter = useAppSelector((state) => state.ui.filter);
  const selectedCategoryId = useAppSelector(
    (state) => state.ui.selectedCategoryId,
  );

  if (isLoading) return <Typography>Loading...</Typography>;
  if (isError)
    return <Typography>Something went wrong loading todos.</Typography>;

  const visibleTodos = todos?.filter((todo) => {
    const matchesStatus =
      filter === "active"
        ? !todo.isComplete
        : filter === "completed"
          ? todo.isComplete
          : true;
    const matchesCategory =
      selectedCategoryId === null || todo.categoryId === selectedCategoryId;
    return matchesStatus && matchesCategory;
  });

  if (visibleTodos && visibleTodos.length === 0) {
    const categoryName = categories?.find(
      (c) => c.id === selectedCategoryId,
    )?.name;
    const message =
      selectedCategoryId !== null
        ? `No todos in "${categoryName}".`
        : filter === "active"
          ? "No active todos."
          : filter === "completed"
            ? "No completed todos."
            : "No todos yet — add one above.";

    return (
      <Typography
        color="text.secondary"
        sx={{ textAlign: "center", padding: 3 }}
      >
        {message}
      </Typography>
    );
  }

  return (
    <ul>
      {visibleTodos?.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
}

export default TodoList;
