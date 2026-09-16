import { useQuery } from "@tanstack/react-query";
import { fetchTodos } from "../api/todos";
import { useAppSelector } from "../store/hooks";
import TodoItem from "./TodoItem";

function TodoList() {
  const { data: todos, isLoading, isError } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });
  const filter = useAppSelector((state) => state.ui.filter);
  const selectedCategoryId = useAppSelector((state) => state.ui.selectedCategoryId);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Something went wrong loading todos.</p>;

  const visibleTodos = todos?.filter((todo) => {
    const matchesStatus =
      filter === "active" ? !todo.isComplete : filter === "completed" ? todo.isComplete : true;
    const matchesCategory =
      selectedCategoryId === null || todo.categoryId === selectedCategoryId;
    return matchesStatus && matchesCategory;
  });

  return (
    <ul>
      {visibleTodos?.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
}

export default TodoList;