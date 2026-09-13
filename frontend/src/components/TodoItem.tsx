import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleTodo, deleteTodo, renameTodo } from "../api/todos";
import type { Todo } from "../api/todos";

function TodoItem({ todo }: { todo: Todo }) {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(todo.title);

  const toggleMutation = useMutation({
    mutationFn: toggleTodo,
    onMutate: async (todoBeingToggled) => {
      await queryClient.cancelQueries({ queryKey: ["todos"] });
      const previousTodos = queryClient.getQueryData<Todo[]>(["todos"]);
      queryClient.setQueryData<Todo[]>(["todos"], (old) =>
        old?.map((t) =>
          t.id === todoBeingToggled.id
            ? { ...t, isComplete: !t.isComplete }
            : t
        )
      );
      return { previousTodos };
    },
    onError: (_err, _todo, context) => {
      queryClient.setQueryData(["todos"], context?.previousTodos);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTodo,
    onMutate: async (idBeingDeleted) => {
      await queryClient.cancelQueries({ queryKey: ["todos"] });
      const previousTodos = queryClient.getQueryData<Todo[]>(["todos"]);
      queryClient.setQueryData<Todo[]>(["todos"], (old) =>
        old?.filter((t) => t.id !== idBeingDeleted)
      );
      return { previousTodos };
    },
    onError: (_err, _id, context) => {
      queryClient.setQueryData(["todos"], context?.previousTodos);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const renameMutation = useMutation({
    mutationFn: ({ todo, newTitle }: { todo: Todo; newTitle: string }) =>
      renameTodo(todo, newTitle),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      setIsEditing(false);
    },
  });

  function handleRenameSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!draftTitle.trim() || draftTitle === todo.title) {
      setIsEditing(false);
      return;
    }
    renameMutation.mutate({ todo, newTitle: draftTitle });
  }

  return (
    <li>
      <input
        type="checkbox"
        checked={todo.isComplete}
        onChange={() => toggleMutation.mutate(todo)}
      />

      {isEditing ? (
        <form onSubmit={handleRenameSubmit} style={{ display: "inline" }}>
          <input
            type="text"
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
            autoFocus
          />
          <button type="submit">Save</button>
          <button type="button" onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        </form>
      ) : (
        <>
          <span>{todo.title}</span>
          <button onClick={() => setIsEditing(true)}>Update</button>
        </>
      )}

      <button onClick={() => deleteMutation.mutate(todo.id)}>Delete</button>
    </li>
  );
}

export default TodoItem;