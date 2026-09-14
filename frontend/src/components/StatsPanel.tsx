import { useQuery } from "@tanstack/react-query";
import { Box, Card, Stack, Typography, Avatar } from "@mui/material";
import BarChartIcon from "@mui/icons-material/BarChart";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import ScheduleIcon from "@mui/icons-material/Schedule";
import CheckIcon from "@mui/icons-material/Check";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { fetchTodos } from "../api/todos";

function StatsPanel() {
  const { data: todos } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });

  const total = todos?.length ?? 0;
  const completedCount = todos?.filter((t) => t.isComplete).length ?? 0;
  const remainingCount = total - completedCount;

  const stats = [
    { label: "Total Tasks", value: total, color: "#3b82f6", icon: <CheckIcon fontSize="small" /> },
    { label: "Completed", value: completedCount, color: "#22c55e", icon: <DoneAllIcon fontSize="small" /> },
    { label: "Remaining", value: remainingCount, color: "#a855f7", icon: <ScheduleIcon fontSize="small" /> },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        width: "100%",
        "@media (min-width: 600px) and (max-width: 1023px)": {
          flexDirection: "row",
        },
      }}
    >
      <Card sx={{ padding: 3, flex: 1, minWidth: 0 }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: "center", marginBottom: 2 }}>
          <BarChartIcon color="primary" />
          <Typography variant="h2" sx={{ textTransform: "none" }}>
            Quick Stats
          </Typography>
        </Stack>

        <Stack spacing={2}>
          {stats.map((stat) => (
            <Stack
              key={stat.label}
              direction="row"
              sx={{ alignItems: "center", justifyContent: "space-between" }}
            >
              <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                <Avatar sx={{ width: 32, height: 32, backgroundColor: stat.color }}>
                  {stat.icon}
                </Avatar>
                <Typography variant="body2">{stat.label}</Typography>
              </Stack>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {stat.value}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Card>

      <Card
        sx={{
          padding: 3,
          flex: 1,
          minWidth: 0,
          textAlign: "center",
          backgroundColor: (t) => (t.palette.mode === "light" ? "#eef2ff" : "#1e2240"),
        }}
      >
        <AutoAwesomeIcon color="primary" />
        <Typography variant="body1" sx={{ fontWeight: 600, marginTop: 1 }}>
          Progress, not perfection.
        </Typography>
        <FavoriteBorderIcon color="primary" sx={{ marginTop: 1 }} />
      </Card>
    </Box>
  );
}

export default StatsPanel;