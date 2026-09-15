import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  TextField,
  InputAdornment,
  Stack,
  Select,
  MenuItem,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { createTodo } from "../api/todos";
import { fetchCategories } from "../api/categories";

function AddTodo() {
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const queryClient = useQueryClient();

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const createMutation = useMutation({
    mutationFn: ({ title, categoryId }: { title: string; categoryId: number }) =>
      createTodo(title, categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || categoryId === "") return;

    createMutation.mutate({ title, categoryId });
    setTitle("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack direction="row" spacing={1.5}>
        <TextField
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs doing?"
          fullWidth
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <AddCircleIcon color="primary" />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 999,
            },
          }}
        />

        <Select
          value={categoryId}
          onChange={(e) => setCategoryId(Number(e.target.value))}
          displayEmpty
          size="small"
          sx={{ minWidth: 140, borderRadius: 999 }}
        >
          <MenuItem value="" disabled>
            Category
          </MenuItem>
          {categories?.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </Select>

        <Button type="submit" variant="contained" color="primary">
          Add
        </Button>
      </Stack>
    </form>
  );
}

export default AddTodo;