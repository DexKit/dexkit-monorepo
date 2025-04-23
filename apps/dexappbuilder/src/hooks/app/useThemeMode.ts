import { useThemeMode as useThemeModeUI } from '@dexkit/ui/hooks/theme/useThemeMode';


export function useThemeMode() {
  const { mode, userMode, setThemeMode } = useThemeModeUI()

  return { mode, userMode, setThemeMode };
}