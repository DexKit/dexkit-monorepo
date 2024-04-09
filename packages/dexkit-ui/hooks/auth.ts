import { useMutation, useQuery } from "@tanstack/react-query";
import { useWeb3React } from "@web3-react/core";
import jwt_decode from 'jwt-decode';
import { useContext } from "react";
import { useDexKitContext, useSignMessageDialog } from ".";
import { AuthContext } from "../context/AuthContext";
import { getUserByAccount } from "../modules/user/services";
import { getRefreshAccessToken, loginApp, logoutApp, requestSignature, setAccessToken } from "../services/auth";


export function useAuth() {
  const { setIsLoggedIn, isLoggedIn, user, setUser } = useContext(AuthContext);
  return { setIsLoggedIn, isLoggedIn, user, setUser }
}


export function useLogoutAccountMutation() {
  const { account } = useWeb3React();

  const { setIsLoggedIn } = useAuth();

  return useMutation(async () => {
    if (!account) {
      return;
    }
    const accessTk = await getRefreshAccessToken();
    if (accessTk) {
      const logoutResponse = await logoutApp({ accessTk });
      const data = logoutResponse.data;
      if (data.logout) {
        if (setIsLoggedIn) {
          setIsLoggedIn(false);
        }
        setAccessToken(undefined)
      }
      return data.logout;
    }
    throw Error('not able to logout')
  })
}

export const GET_AUTH_USER = 'GET_AUTH_USER';
export function useAuthUserQuery() {
  const { account } = useWeb3React();
  return useQuery([GET_AUTH_USER, account], async () => {
    if (!account) {
      return;
    }
    const userRequest = await getUserByAccount();
    return userRequest.data;

  })
}

export function useLoginAccountMutation() {
  const { account, provider } = useWeb3React();
  const signMessageDialog = useSignMessageDialog();
  const { siteId, affiliateReferral } = useDexKitContext();

  const { setIsLoggedIn, setUser } = useAuth();

  return useMutation(async () => {
    if (!account || !provider) {
      return;
    }
    signMessageDialog.setOpen(true)
    const messageToSign = await requestSignature({ address: account });

    const signature = await provider.getSigner().signMessage(messageToSign.data);

    const loginResponse = await loginApp({ signature, address: account, siteId, referral: affiliateReferral });
    if (setIsLoggedIn) {
      setIsLoggedIn(true);
    }

    if (setUser && loginResponse.data.access_token) {
      setUser(jwt_decode(loginResponse.data.access_token))
    }
    setAccessToken(loginResponse.data.access_token)

    return loginResponse.data;
  }, {
    onError(error) {
      signMessageDialog.setOpen(false)
      // signMessageDialog.setError(Error('Error signing message'));
    },
    onSettled() {
      signMessageDialog.setOpen(false)
    }
  })
}
