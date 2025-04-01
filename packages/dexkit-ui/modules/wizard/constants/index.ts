import { AppPageOptions } from "../types/config";

export const CORE_PAGES: { [key: string]: AppPageOptions } = {
  ["swap"]: {
    title: "Swap",
    uri: "/swap",
  },
  ["collections"]: {
    title: "Collections",
    uri: "/collections",
  },
  ["wallet"]: {
    title: "Wallet",
    uri: "/wallet",
  },
};
