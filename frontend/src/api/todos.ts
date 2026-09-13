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
