import { NETWORKS } from "@dexkit/core/constants/networks";

import {
  getIsCoinbaseWallet,
  getIsInjected,
  getIsMetaMaskWallet,
} from "../constants/connectors/utils";
import { isMobile } from "../utils/userAgent";

const rpcs: { [key: number]: string } = {};

for (const key in NETWORKS) {
  if (NETWORKS[key].providerRpcUrl) {
    rpcs[key] = NETWORKS[key].providerRpcUrl as string;
  }
}

function onError(error: Error) {
  console.debug(`web3-react error: ${error}`);
}

// Since eip6963 wallet are `announced` dynamically after compile-time, but web3provider required connectors to be statically defined,
// we define a static eip6963Connection object that provides access to all eip6963 wallets. The `wrap` function is used to obtain a copy
// of the connection with metadata & activation for a specific extension/provider.

const getIsCoinbaseWalletBrowser = () => isMobile && getIsCoinbaseWallet();
const getIsMetaMaskBrowser = () => isMobile && getIsMetaMaskWallet();
export const getIsInjectedMobileBrowser = () =>
  getIsCoinbaseWalletBrowser() || getIsMetaMaskBrowser();
const getShouldAdvertiseMetaMask = () =>
  !getIsMetaMaskWallet() &&
  !isMobile &&
  (!getIsInjected() || getIsCoinbaseWallet());

const getIsGenericInjector = () =>
  getIsInjected() && !getIsMetaMaskWallet() && !getIsCoinbaseWallet();

/*const [web3CoinbaseWallet, web3CoinbaseWalletHooks] = initializeConnector<CoinbaseWallet>(
  (actions) =>
    new CoinbaseWallet({
      actions,
      options: {
        url: rpcs[1],
        appName: 'Wallet',

      },
      onError,
    })
)
export const coinbaseWalletConnection: Connection = {
  getProviderInfo: () => ({ name: 'Coinbase Wallet', icon: COINBASE_WALLET_ICON }),
  connector: web3CoinbaseWallet,
  hooks: web3CoinbaseWalletHooks,
  type: ConnectionType.COINBASE_WALLET,
  shouldDisplay: () =>
    Boolean((isMobile && !getIsInjectedMobileBrowser()) || !isMobile || getIsCoinbaseWalletBrowser()),
  // If on a mobile browser that isn't the coinbase wallet browser, deeplink to the coinbase wallet app
  overrideActivate: () => {
    if (isMobile && !getIsInjectedMobileBrowser()) {
      window.open('https://go.cb-w.com/mtUDhEZPy1', 'cbwallet')
      return true
    }
    return false
  },
}*/
