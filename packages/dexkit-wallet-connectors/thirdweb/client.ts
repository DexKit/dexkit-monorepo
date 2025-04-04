import { createThirdwebClient } from "thirdweb";


import {
  createWallet,
  inAppWallet,
} from "thirdweb/wallets";

export const client = createThirdwebClient({
  clientId: "8b875cba6d295240d3b3861a3e8c2260",
});




export const wallets = [
  inAppWallet({
    auth: {
      options: [
        "google",
        "discord",
        "telegram",
        "farcaster",
        "email",
        "x",
        "passkey",
        "phone",
        "coinbase",
      ],
    },
  }),
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
  createWallet("io.rabby"),
  createWallet("io.zerion.wallet"),
];


export const appMetadata = {
  name: "My App",
  url: "https://my-app.com",
  description: "some description about your app",
  logoUrl: "https://path/to/my-app/logo.svg",
};