
import { useAppConfig as useAppConfigUI } from '@dexkit/ui/hooks/useAppConfig';
// App config context is passed on _app.tsx, in each page we need to pass
// app config in static props to context be initialized
export function useAppConfig() {
  return useAppConfigUI();
}