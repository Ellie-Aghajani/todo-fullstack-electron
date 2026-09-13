export interface Todo {
  id: number;
  title: string;
  isComplete: boolean;
  categoryId: number;
}

const BASE_URL = "http://localhost:5192/api/Todos";

export async function fetchTodos(): Promise<Todo[]> {
  const response = await fetch(BASE_URL);
  if (!response.ok) {
    throw new Error("Failed to fetch todos");
  }
  return response.json();
}
export async function createTodo(title: string): Promise<Todo> {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, categoryId: 1 }),
  });
  if (!response.ok) {
    throw new Error("Failed to create todo");
  }
  return response.json();
}
export async function toggleTodo(todo: Todo): Promise<Todo> {
  const response = await fetch(`${BASE_URL}/${todo.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...todo, isComplete: !todo.isComplete }),
  });
  if (!response.ok) {
    throw new Error("Failed to update todo");
  }
  return response.json();
}
export async function deleteTodo(id: number): Promise<void> {
  const response = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  if (!response.ok) {
    throw new Error("Failed to delete todo");
  }
}

export async function renameTodo(todo: Todo, newTitle: string): Promise<Todo> {
  const response = await fetch(`${BASE_URL}/${todo.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...todo, title: newTitle }),
  });
  if (!response.ok) {
    throw new Error("Failed to rename todo");
  }
  return response.json();
}
