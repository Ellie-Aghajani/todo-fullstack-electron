export interface Category {
  id: number;
  name: string;
}

const BASE_URL = "http://localhost:5192/api/Categories";

export async function fetchCategories(): Promise<Category[]> {
  const response = await fetch(BASE_URL);
  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }
  return response.json();
}

export async function createCategory(name: string): Promise<Category> {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!response.ok) {
    throw new Error("Failed to create category");
  }
  return response.json();
}
export async function deleteCategory(id: number): Promise<void> {
  const response = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  if (!response.ok) {
    if (response.status === 409) {
      throw new Error("Cannot delete a category that still has todos assigned to it.");
    }
    throw new Error("Failed to delete category");
  }
}

export async function renameCategory(id: number, name: string): Promise<Category> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!response.ok) {
    throw new Error("Failed to rename category");
  }
  return response.json();
}