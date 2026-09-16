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
  Box,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
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
    <ListItem sx={{ display: "block", minWidth: 0, px: { xs: 0.5, sm: 1 } }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          minWidth: 0,
          width: "100%",
          gap: 0.5,
        }}
      >
        <Checkbox
          checked={todo.isComplete}
          onChange={() => toggleMutation.mutate(todo)}
          sx={{ p: { xs: 0.5, sm: 1 }, flexShrink: 0 }}
        />

        {isEditing ? (
          <form onSubmit={handleRenameSubmit} style={{ flex: 1, minWidth: 0 }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1}
              sx={{
                alignItems: { xs: "stretch", sm: "center" },
                width: "100%",
              }}
            >
              <TextField
                size="small"
                value={draftTitle}
                onChange={(e) => setDraftTitle(e.target.value)}
                autoFocus
                fullWidth
              />
              <Stack
                direction="row"
                spacing={1}
                sx={{ justifyContent: "flex-end" }}
              >
                <IconButton type="submit" size="small" aria-label="Save task">
                  ✓
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => setIsEditing(false)}
                  aria-label="Cancel edit"
                >
                  ✕
                </IconButton>
              </Stack>
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
              pr: 1,
              fontSize: { xs: "0.9rem", sm: "1rem" },
              flex: 1,
            }}
          />
        )}
      </Box>

      {!isEditing && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            width: "100%",
          }}
        >
          <Stack
            direction="row"
            spacing={1}
            sx={{ display: { xs: "none", sm: "flex" } }}
          >
            <IconButton
              size="small"
              onClick={() => setIsEditing(true)}
              aria-label="Update task"
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              color="error"
              onClick={() => deleteMutation.mutate(todo.id)}
              aria-label="Delete task"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
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
