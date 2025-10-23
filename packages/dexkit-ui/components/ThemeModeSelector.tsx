import { ThemeMode } from "@dexkit/ui/constants/enum";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useColorScheme } from "@mui/material";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import { useThemeMode } from "../hooks";

export function ThemeModeSelector() {
  const { mode, setThemeMode } = useThemeMode();
  const { mode: colorSchemeMode, setMode } = useColorScheme();

  const handleToggle = () => {
    const newMode = mode === ThemeMode.dark ? ThemeMode.light : ThemeMode.dark;
    setThemeMode(newMode);
    setMode(newMode);
  };

  return (
    <Stack direction={"row"} alignContent={"center"} alignItems={"center"}>
      <LightModeIcon />
      <Switch
        checked={mode === ThemeMode.dark}
        onChange={handleToggle}
      />
      <DarkModeIcon />
    </Stack>
  );
}
