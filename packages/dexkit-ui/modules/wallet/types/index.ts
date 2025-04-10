import { TokenWhitelabelApp } from "@dexkit/core/types";



export interface TokenBalance {
  token: TokenWhitelabelApp;
  balance: bigint;
  isProxyUnlocked?: boolean;
}