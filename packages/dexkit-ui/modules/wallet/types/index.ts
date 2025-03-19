import { TokenWhitelabelApp } from "@dexkit/core/types";
import { BigNumber } from "ethers";

export interface TokenBalance {
  token: TokenWhitelabelApp;
  balance: BigNumber;
  isProxyUnlocked?: boolean;
}
