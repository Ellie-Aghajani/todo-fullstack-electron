import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, TextField, InputAdornment, Stack } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { createTodo } from "../api/todos";

function AddTodo() {
  const [title, setTitle] = useState("");
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    createMutation.mutate(title);
    setTitle("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack direction="row" spacing={1.5}  sx={{ margin: 2 }} >
        <TextField
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What's on your mind today?"
          fullWidth
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <AddCircleIcon fontSize="large" color="primary" />
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
        <Button type="submit" variant="contained" color="primary">
          Add
        </Button>
      </Stack>
    </form>
  );
}

export default AddTodo;
