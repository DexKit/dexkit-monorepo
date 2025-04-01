import {
  BRAVE_ICON,
  BROWSER_WALLET_ICON,
  LEDGER_ICON,
  METAMASK_ICON,
  RABBY_ICON,
  TRUST_WALLET_ICON,
} from "../../constants/icons";
import { ProviderInfo } from "../../types";

export const getIsInjected = () =>
  typeof window !== "undefined" ? Boolean(window.ethereum) : false;

const InjectedWalletTable: { [key in string]?: ProviderInfo } = {
  isBraveWallet: { name: "Brave", icon: BRAVE_ICON },
  isRabby: { name: "Rabby", icon: RABBY_ICON },
  isTrust: { name: "Trust Wallet", icon: TRUST_WALLET_ICON },
  isLedgerConnect: { name: "Ledger", icon: LEDGER_ICON },
};

// When using Brave browser, `isMetaMask` is set to true when using the built-in wallet
// This variable should be true only when using the MetaMask extension
// https://wallet-docs.brave.com/ethereum/wallet-detection#compatability-with-metamask
type NonMetaMaskFlag =
  | "isRabby"
  | "isBraveWallet"
  | "isTrustWallet"
  | "isLedgerConnect";
const allNonMetamaskFlags: NonMetaMaskFlag[] = [
  "isRabby",
  "isBraveWallet",
  "isTrustWallet",
  "isLedgerConnect",
];

/**
 * Checks the window object for the presence of a known injectors and returns the most relevant injector name and icon.
 * Returns a default metamask installation object if no wallet is detected.
 *
 * @param isDarkMode - optional parameter to determine which color mode of the
 */
export function getDeprecatedInjection(): ProviderInfo | undefined {
  if (typeof window === "undefined") {
    return;
  }
  for (const [key, wallet] of Object.entries(InjectedWalletTable)) {
    if (window.ethereum?.[key as keyof Window["ethereum"]]) return wallet;
  }

  // Check for MetaMask last, as some injectors will set isMetaMask = true in addition to their own, i.e. Brave browser
  if (window.ethereum?.isMetaMask)
    return { name: "MetaMask", icon: METAMASK_ICON };

  // Prompt MetaMask install when no window.ethereum or eip6963 injection is present, or the only injection detected is coinbase (CB has separate entry point in UI)
  //@ts-ignore
  if (!window.ethereum || window.ethereum?.isCoinbaseWallet)
    return { name: "Install MetaMask", icon: METAMASK_ICON };

  // Use a generic icon when injection is present but no known non-coinbase wallet is detected
  return { name: "Browser Wallet", icon: BROWSER_WALLET_ICON };
}

export const getIsMetaMaskWallet = () =>
  typeof window !== "undefined"
    ? Boolean(
        window.ethereum?.isMetaMask &&
          !allNonMetamaskFlags.some((flag) => (window.ethereum as any)?.[flag]),
      )
    : false;

export const getIsCoinbaseWallet = () =>
  typeof window !== "undefined"
    ? Boolean((window.ethereum as any)?.isCoinbaseWallet)
    : false;

// https://eips.ethereum.org/EIPS/eip-1193#provider-errors
export enum ErrorCode {
  USER_REJECTED_REQUEST = 4001,
  UNAUTHORIZED = 4100,
  UNSUPPORTED_METHOD = 4200,
  DISCONNECTED = 4900,
  CHAIN_DISCONNECTED = 4901,

  // https://docs.metamask.io/guide/rpc-api.html#unrestricted-methods
  CHAIN_NOT_ADDED = 4902,
  MM_ALREADY_PENDING = -32002,
  WC_V2_MODAL_CLOSED = "Error: Connection request reset. Please try again.",
  WC_MODAL_CLOSED = "Error: User closed modal",
  CB_REJECTED_REQUEST = "Error: User denied account authorization",
}

// TODO(WEB-1973): merge this function with existing didUserReject for Swap errors
