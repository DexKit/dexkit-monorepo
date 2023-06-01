import { MetaMask } from "@web3-react/metamask";
import { Connector } from "@web3-react/types";
import { build, BuildInput } from "eth-url-parser";
import { BigNumber, ethers } from "ethers";
import { EventEmitter } from "events";
import { ChainId, CoinTypes, IPFS_GATEWAY } from "../constants";
import { NETWORKS } from "../constants/networks";
import { ZEROEX_NATIVE_TOKEN_ADDRESS } from "../constants/zrx";
import { EvmCoin, TokenWhitelabelApp } from "../types";
import { MagicConnector } from "../types/magic";

export function getConnectorName(connector?: Connector) {
  if (connector instanceof MagicConnector) {
    return "magic";
  }

  if (connector instanceof MetaMask) {
    return "metamask";
  }
}

export function parseChainId(chainId: string | number) {
  return typeof chainId === "number"
    ? chainId
    : Number.parseInt(chainId, chainId.startsWith("0x") ? 16 : 10);
}

export function waitForEvent<T>(
  emitter: EventEmitter,
  event: string,
  rejectEvent: string
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    emitter.once(event, (args) => {
      resolve(args);
    });
    emitter.once(rejectEvent, () => reject("rejected by the user"));
    emitter.once("error", reject);
  });
}

export const truncateAddress = (address: string | undefined) => {
  if (address !== undefined && ethers.utils.isAddress(address)) {
    return `${address.slice(0, 7)}...${address.slice(address.length - 5)}`;
  }
  return "";
};

export function hasLondonHardForkSupport(chainId: ChainId) {
  switch (chainId) {
    case ChainId.Ropsten:
    case ChainId.Ethereum:
    case ChainId.Goerli:
    case ChainId.Polygon:
    case ChainId.Mumbai:
      return true;

    default:
      return false;
  }
}

export function getNativeTokenSymbol(chainId?: number) {
  if (chainId) {
    return NETWORKS[chainId]?.symbol;
  }
}

export function isAddressEqual(address?: string, other?: string) {
  if (address === undefined || other === undefined) {
    return false;
  }

  if (!ethers.utils.isAddress(address) || !ethers.utils.isAddress(other)) {
    return false;
  }

  return address.toLowerCase() === other.toLowerCase();
}

export function formatBigNumber(val: BigNumber, decimals: number) {
  // TODO: improve this code in the future
  // pass to a memoized component or something
  const value = ethers.utils.formatUnits(val, decimals);

  let index = value.indexOf(".");

  if (val.isZero()) {
    return value;
  }

  while (true) {
    index = index + 1;

    if (value.at(index) !== "0") {
      break;
    }
  }

  let ending = index;

  while (true) {
    ending = ending + 1;

    if (ending === value.length - 1 || ending === index + 4) {
      break;
    }
  }

  return value.substring(0, ending);
}

export function getBlockExplorerUrl(chainId?: number) {
  if (chainId) {
    return NETWORKS[chainId].explorerUrl;
  }
}

export function copyToClipboard(textToCopy: string) {
  // navigator clipboard api needs a secure context (https)
  if (navigator.clipboard && window.isSecureContext) {
    // navigator clipboard api method'
    return navigator.clipboard.writeText(textToCopy);
  } else {
    // text area method
    let textArea = document.createElement("textarea");
    textArea.value = textToCopy;
    // make the textarea out of viewport
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    return new Promise((res, rej) => {
      // here the magic happens
      document.execCommand("copy") ? res(null) : rej();
      textArea.remove();
    });
  }
}
export function isIpfsUrl(url: string) {
  return url.startsWith("ipfs://");
}
export function getNormalizedUrl(url: string) {
  let fetchUrl = url;

  if (isIpfsUrl(url)) {
    let path = url.substring("ipfs://".length, url.length);
    fetchUrl = `${IPFS_GATEWAY}${path}`;
  }

  return fetchUrl;
}

export async function switchNetwork(connector: Connector, chainId: number) {
  if (connector instanceof MetaMask) {
    return connector.provider?.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: `0x${chainId.toString(16)}` }],
    });
  }
}

export function buildEtherReceiveAddress({
  receiver,
  chainId,
  contractAddress,
  amount,
}: {
  receiver?: string;
  amount?: string;
  chainId?: number;
  contractAddress?: string;
}) {
  if (receiver && chainId) {
    if (contractAddress) {
      let params: BuildInput = {
        chain_id: `${chainId}` as `${number}`,
        target_address: contractAddress,
      };
      params.function_name = "transfer";

      params.parameters = {};
      if (receiver) {
        params.parameters["address"] = receiver;
      }

      if (amount) {
        params.parameters["uint256"] = amount;
      }

      return build(params);
    } else {
      let params: BuildInput = {
        chain_id: `${chainId}` as `${number}`,
        target_address: receiver,
      };
      params.parameters = {};
      if (amount) {
        params.parameters["value"] = amount;
      }

      return build(params);
    }
  }

  return "";
}

export function convertTokenToEvmCoin(token: TokenWhitelabelApp): EvmCoin {
  const network = NETWORKS[token.chainId];

  if (
    token.address.toLowerCase() === ZEROEX_NATIVE_TOKEN_ADDRESS.toLowerCase()
  ) {
    return {
      network: {
        id: network.slug as string,
        name: network.name,
        chainId: token.chainId,
        icon: network.coinImageUrl,
        coingeckoPlatformId: network.coingeckoPlatformId,
      },
      coinType: CoinTypes.EVM_NATIVE,
      name: token.name,
      symbol: token.symbol,
      decimals: token.decimals,
      imageUrl: token.logoURI,
    };
  } else {
    return {
      network: {
        id: network.slug as string,
        name: network.name,
        chainId: token.chainId,
        icon: network.coinImageUrl,
        coingeckoPlatformId: network.coingeckoPlatformId,
      },
      coinType: CoinTypes.EVM_ERC20,
      contractAddress: token.address,
      name: token.name,
      symbol: token.symbol,
      decimals: token.decimals,
      imageUrl: token.logoURI,
    };
  }
}
