import { Card, Typography, Divider } from "@mui/material";
import { Fragment } from "react";
import TodoItem from "./TodoItem";
import type { Todo } from "../api/todos";

function CategoryCard({ title, todos }: { title: string; todos: Todo[] }) {
  return (
    <Card sx={{ padding: 2 }}>
      <Typography variant="h2" sx={{ textTransform: "none", marginBottom: 1 }}>
        {title}
      </Typography>
      <ul style={{ margin: 0, padding: 0, minWidth: 0, listStyle: "none" }}>
        {todos.map((todo, index) => (
          <Fragment key={todo.id}>
            <TodoItem todo={todo} />
            {index < todos.length - 1 && <Divider component="li" />}
          </Fragment>
        ))}
      </ul>
    </Card>
  );
}

export default CategoryCard;