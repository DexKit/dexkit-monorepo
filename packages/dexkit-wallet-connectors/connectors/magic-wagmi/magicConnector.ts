import type { OAuthExtension } from '@magic-ext/oauth';
import type {
  InstanceWithExtensions,
  MagicSDKAdditionalConfiguration,
  MagicSDKExtensionsOption,
  SDKBase,
} from '@magic-sdk/provider';
import { EventEmitter } from "events";
import type { EthNetworkConfiguration } from 'magic-sdk';
import { getAddress } from 'viem';
const IS_SERVER = typeof window === 'undefined'

export const MagicOauthConnectors = [
  {
    name: 'Google',
    icon: "https://raw.githubusercontent.com/DexKit/assets/main/google-icon.svg",
    oauth: 'google'
  },
  {
    name: 'Twitter',
    icon: "https://raw.githubusercontent.com/DexKit/assets/main/twitter-logo.svg",
    oauth: 'twitter'
  },
  {
    name: 'Discord',
    icon: "https://raw.githubusercontent.com/DexKit/assets/main/discord-logo.svg",
    oauth: 'discord'
  }
]



import { NETWORKS } from '@dexkit/core/constants/networks';
import { ProviderWrapper } from '../magic';

export interface MagicOptions {
  apiKey: string
  accentColor?: string
  isDarkMode?: boolean
  customLogo?: string
  customHeaderText?: string
  connectorType?: 'dedicated' | 'universal'
  magicSdkConfiguration?: MagicSDKAdditionalConfiguration
  networks?: EthNetworkConfiguration[]
}

/**
 * Magic Connector class is a base class for Dedicated Wallet and Universal Wallet Connectors
 * It implements the common functionality of both the connectors
 *
 * Dedicated Wallet Connector and Universal Wallet Connector are the two connectors provided by this library
 * And both of them extend this class.
 */

export interface MagicConnectorParams {

  options: MagicOptions
}

// we connect always 
const network = NETWORKS[1];

let customNode = {
  // magic not allow the default rpc used
  rpcUrl: (network?.providerRpcUrl as string),
  chainId: network?.chainId,
};

function setCustomNode(chainId?: number) {
  if (chainId) {
    const network = NETWORKS[chainId];
    if (network) {
      customNode = {
        // magic not allow the default rpc used
        rpcUrl: network.chainId === 56 ? "https://bsc-dataseed1.binance.org/" : (network?.providerRpcUrl as string),
        chainId: network?.chainId,
      };
    }
  }
}



const eventEmitter = new EventEmitter();

export function magicConnector({ options }: MagicConnectorParams) {

  if (!options.apiKey) {
    throw new Error(
      'Magic API Key is required. Get one at https://dashboard.magic.link/',
    )
  }

  const getMagicSDK = async (): Promise<
    | InstanceWithExtensions<SDKBase, OAuthExtension[]>
    | InstanceWithExtensions<SDKBase, MagicSDKExtensionsOption<string>>
    | null> => {
    if (options.connectorType === 'dedicated') {
      const Magic = (await import('magic-sdk')).Magic;
      const OAuthExtension = (await import('@magic-ext/oauth')).OAuthExtension;
      return new Magic(options.apiKey, {
        ...options.magicSdkConfiguration,
        network: {
          ...customNode
        },
        extensions: [new OAuthExtension()],
      })
    }
    if (options.connectorType === 'universal') {
      const Magic = (await import('magic-sdk')).Magic;
      return new Magic(options.apiKey, {
        ...options.magicSdkConfiguration,
        network:
          options.magicSdkConfiguration?.network ?? options?.networks?.[0],
      })
    }
    return null
  }

  const getProvider = async () => {
    const magic = await getMagicSDK()
    if (!magic) return null

    return new ProviderWrapper(magic.rpcProvider, eventEmitter);

  }

  const getAccount = async () => {
    const provider = await getProvider()
    const accounts = await provider?.request({
      method: 'eth_accounts',
    })
    const account = getAddress(accounts[0] as string)
    return account
  }

  const switchChain = async ({ chainId }: { chainId: number }) => {
    setCustomNode(chainId)

  }

  /*  const getWalletClient = async ({ chainId }: { chainId?: number } = {}) => {
      const provider = await getProvider()
      const account = await getAccount()
      const chain = chains.find((x) => x.id === chainId) ?? chains[0]
      if (!provider) throw new Error('provider is required.')
      return createWalletClient({
        account,
        chain,
        transport: custom(provider),
      })
    }*/

  const onAccountsChanged = async (accounts: string[]) => {
    const provider = (await getProvider())?.provider
    if (accounts.length === 0 || !accounts[0]) provider?.emit('disconnect')
    else provider?.emit('change', { account: getAddress(accounts[0]) })
  }

  return {
    id: 'magic',
    name: 'Magic',
    type: 'Magic',
    isModalOpen: false,
    isReady: IS_SERVER,
    getProvider,
    getMagicSDK,
    getAccount,
    switchChain,
    //   getWalletClient,
    onAccountsChanged,
  }
}