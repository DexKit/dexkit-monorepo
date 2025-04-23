import { useContext } from 'react';
import { AppConfigContext } from '../../contexts';
// App config context is passed on _app.tsx, in each page we need to pass
// app config in static props to context be initialized
export function useAppConfig() {
  return useContext(AppConfigContext).appConfig;
}