import type { OAuthExtension, OAuthProvider } from "@magic-ext/oauth";
import type {
  InstanceWithExtensions,
  MagicSDKAdditionalConfiguration,
  SDKBase,
} from "@magic-sdk/provider";
import { ChainNotConfiguredError, normalizeChainId } from "@wagmi/core";
import { SwitchChainError, UserRejectedRequestError, getAddress } from "viem";
import { createConnector } from "wagmi";
import {
  magicConnector,
  type MagicConnectorParams,
  type MagicOptions,
} from "./magicConnector";

/**
 * Dedicated Wallet Connector class used to connect to wallet using Dedicated Wallet.
 * It uses modal UI defined in our package which also takes in various styling options
 * for custom experience.
 *
 * @example
 * ```typescript
 * import { DedicatedWalletConnector } from '@magiclabs/wagmi-connector';
 * const connector = new DedicatedWalletConnector({
 *  options: {
 *     apiKey: YOUR_MAGIC_LINK_API_KEY, //required
 *    //...Other options
 *  },
 * });
 * ```
 * @see https://github.com/magiclabs/wagmi-magic-connector#-usage
 * @see https://magic.link/docs/dedicated/overview
 */

interface DedicatedWalletOptions extends MagicOptions {
  enableEmailLogin?: boolean;
  enableSMSLogin?: boolean;
  oauthOptions?: { providers: OAuthProvider[]; callbackUrl?: string };
  magicSdkConfiguration?: MagicSDKAdditionalConfiguration<
    string,
    OAuthExtension[]
  >;
}

export interface DedicatedWalletConnectorParams extends MagicConnectorParams {
  options: DedicatedWalletOptions;
}

export function dedicatedWalletConnector({
  options,
}: DedicatedWalletConnectorParams) {
  let {
    id,
    name,
    type,
    getAccount,
    getMagicSDK,
    getProvider,
    onAccountsChanged,
    switchChain,
  } = magicConnector({ options: { ...options, connectorType: "dedicated" } });

  const oauthProviders = options.oauthOptions?.providers ?? [];
  const oauthCallbackUrl = options.oauthOptions?.callbackUrl;
  const enableSMSLogin = options.enableSMSLogin ?? false;
  const enableEmailLogin = options.enableEmailLogin ?? true;

  return createConnector((config) => ({
    id,
    type,
    name,
    getProvider,
    connect: async function ({
      oauthProvider,
      email,
      phoneNumber,
      isLoggingIn,
    }: any) {
      if (!options.apiKey) {
        throw new Error("Magic API Key is not provided.");
      }

      const provider = (await getProvider())?.provider;

      if (provider?.on) {
        provider.on("accountsChanged", this.onAccountsChanged.bind(this));
        provider.on("chainChanged", this.onChainChanged.bind(this));
        provider.on("disconnect", this.onDisconnect.bind(this));
      }

      let chainId: number;
      try {
        chainId = await this.getChainId();
      } catch {
        chainId = 0;
      }

      if (await this.isAuthorized()) {
        return { chainId, accounts: [await getAccount()] };
      }

      const magic = (await getMagicSDK()) as InstanceWithExtensions<
        SDKBase,
        OAuthExtension[]
      >;

      // LOGIN WITH MAGIC USING OAUTH PROVIDER
      if (oauthProvider) {
        await magic.oauth.loginWithRedirect({
          provider: oauthProvider,
          redirectURI: oauthCallbackUrl ?? window.location.href,
        });
      }

      // LOGIN WITH MAGIC USING EMAIL
      if (email) await magic.auth.loginWithEmailOTP({ email: email });

      // LOGIN WITH MAGIC USING PHONE NUMBER
      if (phoneNumber)
        await magic.auth.loginWithSMS({ phoneNumber: phoneNumber });

      if (await magic.user.isLoggedIn()) {
        return { accounts: [await getAccount()], chainId };
      }

      throw new UserRejectedRequestError(Error("User Rejected Request"));
    },

    disconnect: async () => {
      try {
        const magic = await getMagicSDK();
        await magic?.wallet.disconnect();
        localStorage.removeItem("magicRedirectResult");
        localStorage.removeItem("loginType");
        config.emitter.emit("disconnect");
      } catch (error) {
        console.error("Error disconnecting from Magic SDK:", error);
      }
    },

    getAccounts: async () => {
      const provider = await getProvider();
      const accounts = (await provider?.request({
        method: "eth_accounts",
      })) as string[];
      return accounts.map((x) => getAddress(x));
    },

    getChainId: async (): Promise<number> => {
      const provider = await getProvider();
      if (provider) {
        const chainId = await provider.request({
          method: "eth_chainId",
          params: [],
        });
        return normalizeChainId(chainId);
      }
      const networkOptions = options.magicSdkConfiguration?.network;
      if (typeof networkOptions === "object") {
        const chainID = networkOptions.chainId;
        if (chainID) return normalizeChainId(chainID);
      }
      throw new Error("Chain ID is not defined");
    },

    isAuthorized: async () => {
      try {
        const magic = (await getMagicSDK()) as InstanceWithExtensions<
          SDKBase,
          OAuthExtension[]
        >;

        if (!magic) {
          return false;
        }

        const isLoggedIn = await magic.user.isLoggedIn();

        let result: any;
        try {
          result = await magic.oauth.getRedirectResult();
          if (result) {
            localStorage.setItem("magicRedirectResult", JSON.stringify(result));
          }
        } catch {
          localStorage.removeItem("magicRedirectResult");
        }

        if (isLoggedIn) return true;

        return result && result !== null;
      } catch (e) {}
      return false;
    },

    onAccountsChanged,

    async switchChain({ addEthereumChainParameter, chainId }) {
      const chain = config.chains.find((x) => x.id === chainId);
      if (!chain) throw new SwitchChainError(new ChainNotConfiguredError());
      switchChain({ chainId: chainId });
      localStorage.setItem("magic:defaultChainId", String(chainId));
      config.emitter.emit("change", { chainId });

      return chain;
    },

    onChainChanged(chain) {
      const chainId = normalizeChainId(chain);
      switchChain({ chainId: chainId });
      config.emitter.emit("change", { chainId });
    },

    async onConnect(connectInfo) {
      const chainId = normalizeChainId(connectInfo.chainId);
      const accounts = await this.getAccounts();
      config.emitter.emit("connect", { accounts, chainId });
    },

    onDisconnect: () => {
      config.emitter.emit("disconnect");
    },
  }));
}
