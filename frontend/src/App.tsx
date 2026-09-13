import AddTodo from "./components/AddTodo";
import TodoList from "./components/TodoList";
import FilterBar from "./components/FilterBar";
import { useAppSelector } from "./store/hooks";

function App() {
  const theme = useAppSelector((state) => state.ui.theme);

  return (
    <div className={theme}>
      <h1>To-Do</h1>
      <AddTodo />
      <FilterBar />
      <TodoList />
    </div>
  );
}

export default App;