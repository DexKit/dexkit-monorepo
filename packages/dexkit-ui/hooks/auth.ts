import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import jwt_decode from "jwt-decode";
import { useContext } from "react";
import { useDexKitContext, useSignMessageDialog } from ".";
import { AuthStateContext } from "../context/AuthContext";
import { getUserByAccount } from "../modules/user/services";
import { QUERY_WHITELABEL_CONFIGS_BY_OWNER_PAGINATED_NAME } from "../modules/whitelabel/hooks/useWhitelabelConfigsByOwnerPaginatedQuery";
import {
  getRefreshAccessToken,
  loginApp,
  logoutApp,
  requestSignature,
  setAccessToken,
} from "../services/auth";
import { useIsWidget } from "./app/useIsWidget";

export function useAuth() {
  const { setIsLoggedIn, isLoggedIn, user, setUser } =
    useContext(AuthStateContext);
  return { setIsLoggedIn, isLoggedIn, user, setUser };
}

export function useLogoutAccountMutation() {
  const { account } = useWeb3React();
  const isWidget = useIsWidget()

  const { setIsLoggedIn, setUser } = useAuth();

  return useMutation(async () => {
    if (!account) {
      return;
    }
    const accessTk = await getRefreshAccessToken({ isWidget });
    if (accessTk) {
      const logoutResponse = await logoutApp({ accessTk, isWidget });
      const data = logoutResponse.data;
      if (data.logout) {
        if (setIsLoggedIn) {
          setIsLoggedIn(false);
        }
        if (setUser) {
          setUser(undefined);
        }
        setAccessToken(undefined);
      }
      return data.logout;
    }
    throw Error("not able to logout");
  });
}

export const GET_AUTH_USER = "GET_AUTH_USER";
export function useAuthUserQuery() {
  const { account } = useWeb3React();
  return useQuery(
    [GET_AUTH_USER, account],
    async () => {
      if (!account) {
        return null;
      }
      const userRequest = await getUserByAccount();
      return userRequest.data;
    },
    {
      enabled: !!account,
      retry: false,
      staleTime: 5 * 60 * 1000,
    }
  );
}

export function useLoginAccountMutation() {
  const { account, provider, chainId } = useWeb3React();
  const signMessageDialog = useSignMessageDialog();
  const { siteId, affiliateReferral } = useDexKitContext();
  const isWidget = useIsWidget();
  const { signMessage } = useWeb3React();
  const { setIsLoggedIn, setUser } = useAuth();
  const queryClient = useQueryClient();

  return useMutation(
    async () => {
      if (!account || !provider) {
        return;
      }
      (signMessageDialog.setOpen as (value: boolean) => void)(true);
      (signMessageDialog.setError as (value: Error | undefined) => void)(undefined);
      (signMessageDialog.setIsSuccess as (value: boolean) => void)(false);

      try {
        const messageToSign = await requestSignature({ address: account });
        (signMessageDialog.setMessage as (value: string | undefined) => void)(messageToSign.data);

        const signature = await signMessage({
          message: messageToSign.data,
        });

        const chain = chainId;

        const loginResponse = await loginApp({
          signature,
          address: account,
          chainId: chain,
          siteId,
          referral: affiliateReferral,
          isWidget
        });

        if (setIsLoggedIn) {
          setIsLoggedIn(true);
        }

        if (setUser && loginResponse.data.access_token) {
          const decodedUser = jwt_decode(loginResponse.data.access_token) as any;
          // Ensure address is set from account if not in JWT
          const userWithAddress = {
            ...decodedUser,
            address: decodedUser?.address || account,
          };
          setUser(userWithAddress);

          // Invalidate queries that depend on user address to refresh data
          const userAddress = userWithAddress.address || account;
          if (userAddress) {
            queryClient.invalidateQueries({
              queryKey: [QUERY_WHITELABEL_CONFIGS_BY_OWNER_PAGINATED_NAME],
            });
            queryClient.invalidateQueries({
              queryKey: [GET_AUTH_USER, account],
            });
          }
        }
        setAccessToken(loginResponse.data.access_token);
        (signMessageDialog.setIsSuccess as (value: boolean) => void)(true);

        return loginResponse.data;
      } catch (error: any) {
        (signMessageDialog.setError as (value: Error | undefined) => void)(error instanceof Error ? error : new Error(error?.message || 'Error signing message'));
        throw error;
      }
    },
    {
      onError(error: any) {
        const errorMessage = error?.message || error?.toString() || 'Error signing message';
        (signMessageDialog.setError as (value: Error | undefined) => void)(error instanceof Error ? error : new Error(errorMessage));
      },
      onSettled() {
        // Keep dialog open if there's an error so user can see it
        if (!signMessageDialog.error) {
          (signMessageDialog.setOpen as (value: boolean) => void)(false);
        }
      },
    }
  );
}
