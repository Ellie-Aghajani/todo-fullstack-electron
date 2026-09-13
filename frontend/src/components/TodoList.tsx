import { useQuery } from "@tanstack/react-query";
import { fetchTodos } from "../api/todos";
import TodoItem from "./TodoItem";

function TodoList() {
  const { data: todos, isLoading, isError } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Something went wrong loading todos.</p>;

  return (
    <ul>
      {todos?.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
}

export default TodoList;