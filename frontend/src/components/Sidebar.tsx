import { useQuery } from "@tanstack/react-query";
import {
  Drawer,
  Box,
  Stack,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Chip,
  Switch,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import ChecklistIcon from "@mui/icons-material/Checklist";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { fetchTodos } from "../api/todos";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { toggleTheme, setFilter } from "../store/uiSlice";
import type { Filter } from "../store/uiSlice";
import CategoryListItems from "./CategoryListItems";

const DRAWER_WIDTH = 260;

function Sidebar() {
  const dispatch = useAppDispatch();
  const filter = useAppSelector((state) => state.ui.filter);
  const theme = useAppSelector((state) => state.ui.theme);

  const { data: todos } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });

  const total = todos?.length ?? 0;
  const activeCount = todos?.filter((t) => !t.isComplete).length ?? 0;
  const completedCount = todos?.filter((t) => t.isComplete).length ?? 0;

  const navItems: { label: string; icon: React.ReactNode; filter: Filter; count: number }[] = [
    { label: "All Tasks", icon: <ChecklistIcon />, filter: "all", count: total },
    { label: "Active", icon: <PlayArrowIcon />, filter: "active", count: activeCount },
    { label: "Completed", icon: <CheckCircleIcon />, filter: "completed", count: completedCount },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: { xs: 0, md: DRAWER_WIDTH },
        flexShrink: 0,
        display: { xs: "none", md: "block" },
        "& .MuiDrawer-paper": {
          width: DRAWER_WIDTH,
          boxSizing: "border-box",
          position: "relative",
          border: "none",
        },
      }}
    >
      <Box sx={{ padding: 3 }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <ChecklistIcon color="primary" />
          <Typography variant="h2" sx={{ textTransform: "none" }}>
            To-Do
          </Typography>
        </Stack>
      </Box>

     <List>
  <ListItemButton selected>
    <ListItemIcon>
      <HomeIcon />
    </ListItemIcon>
    <ListItemText primary="Home" />
  </ListItemButton>

  {navItems.map((item) => (
    <ListItemButton
      key={item.filter}
      selected={filter === item.filter}
      onClick={() => dispatch(setFilter(item.filter))}
    >
      <ListItemIcon>{item.icon}</ListItemIcon>
      <ListItemText primary={item.label} />
      <Chip label={item.count} size="small" />
    </ListItemButton>
  ))}

  <CategoryListItems />
</List>

      <Box sx={{ marginTop: "auto", padding: 3 }}>
        <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between" }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <DarkModeIcon fontSize="small" />
            <Typography variant="body2">Dark Mode</Typography>
          </Stack>
          <Switch checked={theme === "dark"} onChange={() => dispatch(toggleTheme())} />
        </Stack>
      </Box>
    </Drawer>
  );
}

export default Sidebar;