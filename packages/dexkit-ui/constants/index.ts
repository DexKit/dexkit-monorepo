import { MagicLoginType } from "@dexkit/core/constants";

export const WALLET_CONNECTORS: {
  id: string;
  name: string;
  icon: string;
  loginType?: MagicLoginType;
}[] = [
  {
    id: "metamask",
    name: "MetaMask",
    icon: "https://raw.githubusercontent.com/DexKit/assets/main/metamask-fox.svg",
  },
  {
    id: "walletconnect",
    name: "Wallet Connect",
    icon: "https://raw.githubusercontent.com/DexKit/assets/main/walletconnect-circle-blue.svg",
  },
  // { id: "magic", name: "Google", icon: "", loginType: "google" },
  // { id: "magic", name: "Twitter", icon: "", loginType: "twitter" },
];
