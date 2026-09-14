import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Checkbox,
  IconButton,
  Menu,
  MenuItem,
  ListItem,
  ListItemText,
  TextField,
  Stack,
  Button,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { toggleTodo, deleteTodo, renameTodo } from "../api/todos";
import type { Todo } from "../api/todos";

function TodoItem({ todo }: { todo: Todo }) {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(todo.title);
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);

  const toggleMutation = useMutation({
    mutationFn: toggleTodo,
    onMutate: async (todoBeingToggled) => {
      await queryClient.cancelQueries({ queryKey: ["todos"] });
      const previousTodos = queryClient.getQueryData<Todo[]>(["todos"]);
      queryClient.setQueryData<Todo[]>(["todos"], (old) =>
        old?.map((t) =>
          t.id === todoBeingToggled.id
            ? { ...t, isComplete: !t.isComplete }
            : t,
        ),
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
        old?.filter((t) => t.id !== idBeingDeleted),
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
    <ListItem
      secondaryAction={
        !isEditing && (
          <>
            {/* Tablet and up: inline text buttons. Hidden below the "sm"
                breakpoint via theme-driven CSS, not a JS media query hook. */}
            <Stack
              direction="row"
              spacing={1}
              sx={{ display: { xs: "none", sm: "flex" } }}
            >
              <Button size="small" onClick={() => setIsEditing(true)}>
                Update
              </Button>
              <Button
                size="small"
                variant="outlined"
                color="error"
                onClick={() => deleteMutation.mutate(todo.id)}
              >
                Delete
              </Button>
            </Stack>

            {/* Mobile: collapsed into the overflow menu instead. */}
            <IconButton
              onClick={(e) => setMenuAnchor(e.currentTarget)}
              sx={{ display: { xs: "inline-flex", sm: "none" } }}
            >
              <MoreHorizIcon />
            </IconButton>
          </>
        )
      }
    >
      <Checkbox
        checked={todo.isComplete}
        onChange={() => toggleMutation.mutate(todo)}
      />

      {isEditing ? (
        <form onSubmit={handleRenameSubmit} style={{ flex: 1 }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <TextField
              size="small"
              value={draftTitle}
              onChange={(e) => setDraftTitle(e.target.value)}
              autoFocus
              fullWidth
            />
            <IconButton type="submit" size="small">
              ✓
            </IconButton>
            <IconButton size="small" onClick={() => setIsEditing(false)}>
              ✕
            </IconButton>
          </Stack>
        </form>
      ) : (
        <ListItemText
          primary={todo.title}
          sx={{
            textDecoration: todo.isComplete ? "line-through" : "none",
            color: (t) =>
              todo.isComplete
                ? t.palette.text.secondary
                : t.palette.text.primary,
          }}
        />
      )}

      {/* Always rendered — inactive/invisible until menuAnchor is set,
          so there's no need to conditionally mount/unmount it. */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
      >
        <MenuItem
          onClick={() => {
            setIsEditing(true);
            setMenuAnchor(null);
          }}
        >
          Update
        </MenuItem>
        <MenuItem
          onClick={() => {
            deleteMutation.mutate(todo.id);
            setMenuAnchor(null);
          }}
        >
          Delete
        </MenuItem>
      </Menu>
    </ListItem>
  );
}

export default TodoItem;