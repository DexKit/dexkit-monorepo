import React from "react";

export interface AuthUser {
  address?: string;
}

interface IAuthContext {
  isLoggedIn: boolean;
  user?: AuthUser;
  setIsLoggedIn?: any;
  setUser?: any;
}

const AUTH_INITIAL_VALUES: IAuthContext = {
  isLoggedIn: false,
  setIsLoggedIn: undefined,
  user: undefined,
  setUser: undefined,
};

export const AuthContext =
  React.createContext<IAuthContext>(AUTH_INITIAL_VALUES);

export const AuthStateContext =
  React.createContext<IAuthContext>(AUTH_INITIAL_VALUES);
