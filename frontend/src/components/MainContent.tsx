import { Box } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { fetchTodos } from "../api/todos";
import Header from "./Header";
import StatsPanel from "./StatsPanel";
import TaskSection from "./TaskSection";

function MainContent() {
  const { data: todos } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });
  const hasTodos = (todos?.length ?? 0) > 0;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        width: "100%",
        minWidth: 0,
      }}
    >
      <Header />

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          width: "100%",
          "@media (min-width: 1024px)": {
            flexDirection: "row",
            alignItems: "flex-start",
          },
        }}
      >
        {hasTodos && (
          <Box
            sx={{
              width: "100%",
              order: 1,
              "@media (min-width: 1024px)": {
                order: 2,
                width: "25%",
                flexShrink: 0,
              },
            }}
          >
            <StatsPanel />
          </Box>
        )}

        <Box
          sx={{
            width: "100%",
            minWidth: 0,
            order: 2,
            "@media (min-width: 1024px)": {
              order: 1,
              width: "75%",
              minWidth: 0,
            },
          }}
        >
          <TaskSection />
        </Box>
      </Box>
    </Box>
  );
}

export default MainContent;
