import { useWeb3React } from '@web3-react/core';
import jwt_decode from 'jwt-decode';
import { ReactNode, useEffect, useState } from 'react';
import { AuthContext, AuthUser } from '../contexts';
import { useLoginAccountMutation } from '../hooks/account';
import { getAccessToken, getAccessTokenAndRefresh } from '../services/auth';
interface Props {
  children: ReactNode;
}

export function AuthProvider(props: Props) {
  const { account } = useWeb3React();
  const [triedLogin, setTriedLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<AuthUser | undefined>(undefined);
  const loginMutation = useLoginAccountMutation();
  const { children } = props;

  useEffect(() => {
    if (account && !isLoggedIn && triedLogin) {
      loginMutation.mutateAsync().then((d) => {
        setIsLoggedIn(true);
        if (d?.access_token) {
          setUser(jwt_decode(d?.access_token));
        }
      });
    }
  }, [account, isLoggedIn, triedLogin]);

  useEffect(() => {
    if (isLoggedIn) {
      const accessToken = getAccessToken();
      if (accessToken) {
        setUser(jwt_decode(accessToken));
      }
    } else {
      setUser(undefined);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (account) {
      getAccessTokenAndRefresh()
        .then((accessToken) => {
          if (accessToken) {
            setUser(jwt_decode(accessToken));
            setIsLoggedIn(true);
          } else {
            setIsLoggedIn(false);
          }
        })
        .finally(() => setTriedLogin(true));
    }
  }, [account]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
