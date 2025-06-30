import { useAuth } from "@dexkit/ui/hooks/auth";
import { getAdminWidgetConfig } from "../services/widget";

import { useQuery } from "@tanstack/react-query";




export const QUERY_ADMIN_WIDGET_CONFIG = 'GET_ADMIN_WIDGET_CONFIG_QUERY';
/**
 * get widget config by name or query
 * @param param0
 * @returns
 */
export const useAdminWidgetConfigQuery = ({
  id,
}: {
  id?: number
}) => {
  const { setIsLoggedIn } = useAuth();


  return useQuery(
    [QUERY_ADMIN_WIDGET_CONFIG, id || null],
    async () => {
      if (id === undefined) {
        return null;
      }

      const response = (await getAdminWidgetConfig({ id }));

      if (response.status === 401 && setIsLoggedIn) {
        setIsLoggedIn(false);
      }
      return response.data


    },
    { refetchOnWindowFocus: false, refetchOnReconnect: false }
  );
};

