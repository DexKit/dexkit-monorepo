import { useSiteId as useSiteIdUI } from '@dexkit/ui/hooks/useSiteId';
/**
 * Site id from active app. If is DexAppBuilder this will return null
 * @returns 
 */
export function useSiteId() {
  return useSiteIdUI();
}