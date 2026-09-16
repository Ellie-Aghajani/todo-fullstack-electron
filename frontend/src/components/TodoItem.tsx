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
  Box,
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
    <ListItem sx={{ display: "block", minWidth: 0 }}>
      <Box sx={{ display: "flex", alignItems: "flex-start", minWidth: 0 }}>
        <Checkbox
          checked={todo.isComplete}
          onChange={() => toggleMutation.mutate(todo)}
        />

        {isEditing ? (
          <form onSubmit={handleRenameSubmit} style={{ flex: 1, minWidth: 0 }}>
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
              overflowWrap: "break-word",
              wordBreak: "break-word",
              minWidth: 0,
            }}
          />
        )}
      </Box>

      {!isEditing && (
        <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: 0.5 }}>
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

          <IconButton
            onClick={(e) => setMenuAnchor(e.currentTarget)}
            sx={{ display: { xs: "inline-flex", sm: "none" } }}
          >
            <MoreHorizIcon />
          </IconButton>
        </Box>
      )}

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