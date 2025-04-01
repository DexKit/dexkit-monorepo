import { isMobile } from "../rainbowkit/utils/isMobile";
import { CreateWalletFn } from "../rainbowkit/wallets/Wallet";
import {
  braveWallet,
  coinbaseWallet,
  ledgerWallet,
  rabbyWallet,
  trustWallet,
} from "../rainbowkit/wallets/walletConnectors";

const InjectedWalletTable: { [key in string]?: CreateWalletFn } = {
  isBraveWallet: braveWallet,
  isRabby: rabbyWallet,
  isTrust: trustWallet,
  isLedgerConnect: ledgerWallet,
};

/**
 * Checks the window object for the presence of a known injectors and returns the most relevant injector name and icon.
 * Returns a default metamask installation object if no wallet is detected.
 *
 * @param isDarkMode - optional parameter to determine which color mode of the
 */
export function getDeprecatedInjectionOnMobileBrowser():
  | CreateWalletFn
  | undefined {
  if (!isMobile()) {
    return;
  }

  if (typeof window === "undefined") {
    return;
  }
  for (const [key, wallet] of Object.entries(InjectedWalletTable)) {
    if (window?.ethereum?.[key as keyof Window["ethereum"]]) return wallet;
  }

  // Check for MetaMask last, as some injectors will set isMetaMask = true in addition to their own, i.e. Brave browser
  // Metamask is injected has eip on app but is not being filtered
  //if (window.ethereum?.isMetaMask) return metaMaskWallet

  if (window.ethereum?.isCoinbaseWallet) return coinbaseWallet;
}

/**
 * Check if there is a injected provider on mobile browser, if there is this should disable social media login
 *
 */
export function getHashInjectionOnMobileBrowser(): boolean {
  if (!isMobile()) {
    return false;
  }

  if (typeof window === "undefined") {
    return false;
  }
  for (const [key, wallet] of Object.entries(InjectedWalletTable)) {
    if (window?.ethereum?.[key as keyof Window["ethereum"]]) return true;
  }
  // Check for MetaMask last, as some injectors will set isMetaMask = true in addition to their own, i.e. Brave browser
  if (window.ethereum?.isMetaMask) return true;

  // Prompt MetaMask install when no window.ethereum or eip6963 injection is present, or the only injection detected is coinbase (CB has separate entry point in UI)
  //@ts-ignore
  if (window.ethereum?.isCoinbaseWallet) return true;

  return false;
}
