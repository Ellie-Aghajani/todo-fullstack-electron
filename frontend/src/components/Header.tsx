import { useState, useEffect } from "react";
import { Box, Typography, Stack } from "@mui/material";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import WbTwilightIcon from "@mui/icons-material/WbTwilight";
import NightlightIcon from "@mui/icons-material/Nightlight";
import Brightness5Icon from "@mui/icons-material/Brightness5";

function getGreeting(hour: number): string {
  if (hour < 5) return "Good night";
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  if (hour < 21) return "Good evening";
  return "Good night";
}
function getGreetingIcon(hour: number) {
  if (hour < 5) return <NightlightIcon sx={{ color: "#818cf8" }} />;
  if (hour < 12) return <WbSunnyIcon sx={{ color: "#ffe600" }} />;
  if (hour < 17) return <Brightness5Icon sx={{ color: "#f5ca0b" }} />;
  if (hour < 21) return <WbTwilightIcon sx={{ color: "#fb923c" }} />;
  return <NightlightIcon sx={{ color: "#5b6af5" }} />;
}
function getAffirmation(hour: number): string {
  if (hour < 5) return "Rest well — tomorrow is a fresh start.";
  if (hour < 12) return "Small steps make big progress.";
  if (hour < 17) return "Keep the momentum going.";
  if (hour < 21) return "Wrap up strong, you're almost there.";
  return "Time to slow down and recharge.";
}

function Header() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    // Tick every minute — a todo app's clock doesn't need second-level
    // precision, and updating less often means less unnecessary re-rendering.
    const intervalId = setInterval(() => setNow(new Date()), 60_000);

    // Cleanup function: runs when the component unmounts. Without this,
    // the interval would keep running forever in the background even
    // after Header disappears — the same category of bug as the
    // lapsed-listener memory leak, just with a timer instead of an event.
    return () => clearInterval(intervalId);
  }, []);

  const hour = now.getHours();

  const dateFormatted = now.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const timeFormatted = now.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      sx={{
        justifyContent: "space-between",
        alignItems: "flex-start",
        margin: 3,
      }}
    >
      <Box sx={{ textAlign: "left" }}>
        <Stack
          direction="row"
          spacing={1}
          sx={{ alignItems: "center", justifyContent: "flex-end" }}
        >
          <Typography variant="h1" sx={{ textTransform: "none" }}>
            {getGreeting(hour)}
          </Typography>
          {getGreetingIcon(hour)}
        </Stack>
        <Typography variant="body2" color="text.secondary">
          {getAffirmation(hour)}
        </Typography>
      </Box>
      <Box>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {dateFormatted}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {timeFormatted}
        </Typography>
      </Box>
    </Stack>
  );
}

export default Header;
