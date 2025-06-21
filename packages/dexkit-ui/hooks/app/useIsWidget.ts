import { useDexKitContext } from "@dexkit/core/hooks/useDexKitContext";



export function useIsWidget() {
  const { widgetId } = useDexKitContext();
  return widgetId !== undefined && widgetId !== null;
}