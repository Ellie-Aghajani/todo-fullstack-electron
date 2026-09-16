import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  Typography,
  Divider,
  Box,
  Tooltip,
  IconButton,
  TextField,
  Stack,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { Fragment } from "react";
import { useAppSelector } from "../store/hooks";
import { cardColors } from "../theme";
import type { CardColorName } from "../theme";
import TodoItem from "./TodoItem";
import { createTodo, type Todo } from "../api/todos";

const STORAGE_PREFIX = "todo-app-card-color-";
const colorNames = Object.keys(cardColors) as CardColorName[];

function getDefaultColor(seed: string): CardColorName {
  // Deterministic default: hash the category name into a consistent
  // index, so the same category always starts with the same color
  // instead of a random one changing on every reload.
  let hash = 0;
  for (const char of seed) {
    hash = (hash * 31 + char.charCodeAt(0)) % colorNames.length;
  }
  return colorNames[hash];
}

function loadCardColor(categoryKey: string): CardColorName {
  const saved = localStorage.getItem(STORAGE_PREFIX + categoryKey);
  if (saved && saved in cardColors) return saved as CardColorName;
  return getDefaultColor(categoryKey);
}

function CategoryCard({
  title,
  todos,
  categoryId,
}: {
  title: string;
  todos: Todo[];
  categoryId: number | null;
}) {
  const themeMode = useAppSelector((state) => state.ui.theme);
  const queryClient = useQueryClient();
  const [colorName, setColorName] = useState<CardColorName>(() =>
    loadCardColor(title),
  );
  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState("");

  const createTodoMutation = useMutation({
    mutationFn: ({
      title,
      categoryId,
    }: {
      title: string;
      categoryId: number;
    }) => createTodo(title, categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      setIsAddingTodo(false);
      setNewTodoTitle("");
    },
  });

  function handleColorSelect(name: CardColorName) {
    setColorName(name);
    localStorage.setItem(STORAGE_PREFIX + title, name);
  }

  function handleAddTodoSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (
      !newTodoTitle.trim() ||
      categoryId === null ||
      !Number.isFinite(categoryId)
    ) {
      return;
    }
    createTodoMutation.mutate({ title: newTodoTitle.trim(), categoryId });
  }

  const backgroundColor =
    cardColors[colorName][themeMode === "light" ? "light" : "dark"];

  return (
    <Card
      sx={{
        padding: 0,
        backgroundColor,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          backgroundColor:
            themeMode === "light"
              ? "rgba(39, 39, 18, 0.03)"
              : "rgba(3, 10, 20, 0.07)",
          padding: { xs: "10px 12px 8px", sm: "12px 16px 10px" },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
          }}
        >
          <Typography
            variant="h2"
            sx={{
              textTransform: "none",
              marginBottom: 0,
              color: (t) => t.palette.text.primary,
              opacity: 0.85,
              fontWeight: 700,
              fontSize: { xs: "1rem", sm: "1.25rem" },
            }}
          >
            {title}
          </Typography>

          {categoryId !== null && (
            <Tooltip title="Add todo to this category">
              <IconButton
                size="small"
                onClick={() => setIsAddingTodo((prev) => !prev)}
                aria-label="Add todo to this category"
                sx={{ ml: "auto" }}
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        {isAddingTodo && categoryId !== null && (
          <form onSubmit={handleAddTodoSubmit} style={{ marginTop: 8 }}>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <TextField
                size="small"
                value={newTodoTitle}
                onChange={(e) => setNewTodoTitle(e.target.value)}
                placeholder="New task"
                fullWidth
                autoFocus
              />
              <IconButton type="submit" size="small" aria-label="Save new task">
                <CheckIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => {
                  setIsAddingTodo(false);
                  setNewTodoTitle("");
                }}
                aria-label="Cancel add task"
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Stack>
          </form>
        )}
      </Box>

      <Box
        sx={{
          px: 2,
          pt: 1.5,
          pb: 2,
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        <ul style={{ margin: 0, padding: 0, minWidth: 0, listStyle: "none" }}>
          {todos.map((todo, index) => (
            <Fragment key={todo.id}>
              <TodoItem todo={todo} />
              {index < todos.length - 1 && <Divider component="li" />}
            </Fragment>
          ))}
        </ul>

        <Tooltip title="Click a color to personalize this card">
          <Box
            sx={{
              display: "flex",
              gap: 1,
              marginTop: "auto",
              pt: 2,
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            {colorNames.map((name) => (
              <Box
                key={name}
                onClick={() => handleColorSelect(name)}
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  cursor: "pointer",
                  backgroundColor:
                    cardColors[name][themeMode === "light" ? "light" : "dark"],
                  border: (t) =>
                    colorName === name
                      ? `1px solid ${t.palette.text.primary}`
                      : "1px solid transparent",
                }}
              />
            ))}
          </Box>
        </Tooltip>
      </Box>
    </Card>
  );
}

export default CategoryCard;
