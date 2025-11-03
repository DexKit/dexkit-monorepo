import { useDexKitContext } from "@dexkit/core/hooks";



export function useIsWidget() {
  const { widgetId } = useDexKitContext();
  return widgetId !== undefined && widgetId !== null;
}