import { TokenWhitelabelApp } from "@dexkit/core/types";
import type { BigNumber } from "ethers";


export interface TokenBalance {
  token: TokenWhitelabelApp;
  balance: BigNumber;
  isProxyUnlocked?: boolean;
}