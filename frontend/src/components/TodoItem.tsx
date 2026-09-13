import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleTodo } from "../api/todos";
import type { Todo } from "../api/todos";

function TodoItem({ todo }: { todo: Todo }) {
  const queryClient = useQueryClient();

  const toggleMutation = useMutation({
    mutationFn: toggleTodo,

    // Runs BEFORE the network request starts.
    onMutate: async (todoBeingToggled) => {
      // Stop any in-flight refetch of "todos" so it doesn't overwrite
      // our optimistic update with stale data.
      await queryClient.cancelQueries({ queryKey: ["todos"] });

      // Snapshot the current cache, so we can roll back to exactly
      // this if the request fails.
      const previousTodos = queryClient.getQueryData<Todo[]>(["todos"]);

      // Optimistically flip the checkbox in the cache immediately,
      // before the server has responded at all.
      queryClient.setQueryData<Todo[]>(["todos"], (old) =>
        old?.map((t) =>
          t.id === todoBeingToggled.id
            ? { ...t, isComplete: !t.isComplete }
            : t
        )
      );

      // Returned here so onError can access it as `context.previousTodos`.
      return { previousTodos };
    },

    // Runs if the mutation fails.
    onError: (_err, _todoBeingToggled, context) => {
      // Roll back to the exact snapshot taken in onMutate — undo the
      // optimistic change since it turned out to be wrong.
      queryClient.setQueryData(["todos"], context?.previousTodos);
    },

    // Runs whether it succeeded or failed.
    onSettled: () => {
      // Resync with the server's actual truth either way.
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  return (
    <li>
      <label>
        <input
          type="checkbox"
          checked={todo.isComplete}
          onChange={() => toggleMutation.mutate(todo)}
        />
        {todo.title}
      </label>
    </li>
  );
}

export default TodoItem;