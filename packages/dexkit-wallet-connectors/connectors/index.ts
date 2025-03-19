//import { CoinbaseWallet } from "@web3-react/coinbase-wallet";

import {
  getIsCoinbaseWallet,
  getIsInjected,
  getIsMetaMaskWallet,
} from "../constants/connectors/utils";
import { BROWSER_WALLET_ICON } from "../constants/icons";
import { isMobile } from "../utils/userAgent";

//@dev https://github.com/Uniswap/interface/blob/main/src/connection/index.ts
const getIsCoinbaseWalletBrowser = () => isMobile && getIsCoinbaseWallet();
const getIsMetaMaskBrowser = () => isMobile && getIsMetaMaskWallet();
const getIsGenericInjector = () =>
  getIsInjected() && !getIsMetaMaskWallet() && !getIsCoinbaseWallet();
const getIsInjectedMobileBrowser = () =>
  getIsCoinbaseWalletBrowser() || getIsMetaMaskBrowser();

export function GET_CONNECTOR_NAME(connector: any) {
  /* if (connector instanceof MetaMask) return 'MetaMask';
   if (connector instanceof WalletConnect) return 'WalletConnect';
   // if (connector instanceof CoinbaseWallet) return 'Coinbase';
   if (connector instanceof Connector) {
     if (typeof window !== "undefined") {
       const loginType = localStorage.getItem("loginType");
       const name = WALLET_CONNECTORS.find(w => w.id === 'magic' && w.loginType === loginType)?.name;
       if (name) {
         return name;
       }
     }
   }*/
  return "Unknown";
}

export function GET_WALLET_ICON() {
  /*if (connector instanceof MetaMask) return METAMASK_ICON;
  if (connector instanceof WalletConnect) return WALLET_CONNECT_ICON;
  // if (connector instanceof CoinbaseWallet) return COINBASE_WALLET_ICON;
  if (connector instanceof Connector) {
    if (typeof window !== "undefined") {
      const loginType = localStorage.getItem("loginType");
      const icon = WALLET_CONNECTORS.find(w => w.id === 'magic' && w.loginType === loginType)?.icon;
      if (icon) {
        return icon;
      }
    }
  }*/

  return BROWSER_WALLET_ICON;
}
