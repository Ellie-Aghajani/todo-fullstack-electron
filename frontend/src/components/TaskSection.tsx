import { Stack } from "@mui/material";
import AddTodo from "./AddTodo";
import FilterBar from "./FilterBar";
import TodoList from "./TodoList";

function TaskSection() {
  return (
    <Stack spacing={2} sx={{ width: "100%", minWidth: 0 }}>
      <AddTodo />
      <FilterBar />
      <TodoList />
    </Stack>
  );
}

export default TaskSection;