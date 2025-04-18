import { useContext } from 'react';
import { AppConfigContext } from '../../contexts';
/**
 * Site id from active app. If is DexAppBuilder this will return null
 * @returns 
 */
export function useSiteId() {
  return useContext(AppConfigContext).siteId;
}