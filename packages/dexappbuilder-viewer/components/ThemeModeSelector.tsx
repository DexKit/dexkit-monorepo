import { ThemeMode } from "@dexkit/ui/constants/enum";
import { useThemeMode } from "@dexkit/ui/hooks";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useColorScheme } from "@mui/material";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import { useEffect } from "react";

export function ThemeModeSelector() {
  const { mode, setThemeMode } = useThemeMode();
  const { setMode } = useColorScheme();
  
  useEffect(() => {
    setMode(mode);
  }, [mode, setMode]);

  return (
    <Stack direction={"row"} alignContent={"center"} alignItems={"center"}>
      <LightModeIcon />
      <Switch
        checked={mode === ThemeMode.dark}
        onChange={() => {
          if (mode === ThemeMode.dark) {
            setThemeMode(ThemeMode.light);
          } else {
            setThemeMode(ThemeMode.dark);
          }
        }}
      />
      <DarkModeIcon />
    </Stack>
  );
}
