import { useAuth } from "@dexkit/ui/hooks";
import { useQuery } from "@tanstack/react-query";
import { getProtectedAppConfig } from "../../services/whitelabel";

export const PROTECTED_CONFIG_QUERY = "PROTECTED_CONFIG_QUERY";

export function useProtectedAppConfig({
  isProtected,
  domain,
  page,
  slug,
  result,
}: {
  isProtected: boolean;
  domain?: string;
  page: string;
  slug?: string;
  result?: boolean;
}) {
  const { isLoggedIn } = useAuth();

  return useQuery(
    [
      PROTECTED_CONFIG_QUERY,
      isProtected,
      domain,
      page,
      isLoggedIn,
      slug,
      result,
    ],
    async () => {
      if (isProtected && isLoggedIn) {
        if (result === true) {
          try {
            const response = await getProtectedAppConfig({
              domain,
              appPage: page,
              slug,
            });
            return response.data;
          } catch (error) {
            console.error("Error fetching protected content:", error);
            throw error;
          }
        }
      }
      return null;
    },
    {
      staleTime: 0,
      retry: 1,
      refetchOnWindowFocus: true,
      meta: {
        debugLabel: "ProtectedConfig",
      },
    }
  );
}
