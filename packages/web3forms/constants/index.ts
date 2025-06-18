import { ChainId } from "@dexkit/core/constants";

export const PARSE_UNITS = [
  "ether",
  "milliether",
  "microether",
  "gwei",
  "kwei",
  "wei",
];

export const THIRDWEB_CONTRACT_TYPES: { [key: string]: string } = {
  ["edition-drop"]: "Edition drop",
  ["split"]: "Split",
  ["edition"]: "Edition",
  ["nft-collection"]: "Collection",
  ["nft-drop"]: "Collection Drop",
  ["pack"]: "Pack",
  ["token"]: "Token",
  ["token-drop"]: "Token Drop",
  ["vote"]: "Vote",
  ["custom"]: "Custom",
};

export const ETHER_SCAN_API_URL: { [key: number]: string } = {
  [ChainId.Ethereum]: "api.etherscan.io",
  [ChainId.Polygon]: "api.polygonscan.com",
  [ChainId.Arbitrum]: "api.arbiscan.io",
  [ChainId.Optimism]: "api-optimistic.etherscan.io",
  [ChainId.BSC]: "api.bscscan.com",
  [ChainId.BSCTest]: "api-testnet.bscscan.com",
  [ChainId.Avax]: "api.snowtrace.io",
  [ChainId.Mumbai]: "api-testnet.polygonscan.com",
  [ChainId.Goerli]: "api-goerli.etherscan.io",
  [ChainId.Base]: "api.basescan.org",
  [ChainId.BlastSepolia]:
    "api.routescan.io/v2/network/testnet/evm/168587773/etherscan",
  [ChainId.Linea]: "api.lineascan.build",
  [ChainId.Scroll]: "api.scrollscan.com",
  [ChainId.Mantle]: "api.mantlescan.xyz",
  [ChainId.Blast]: "api.blastscan.io",
  [ChainId.Mode]: "api.explorer.mode.network",
};

export const WEB3FORMS_INPUT_TYPES: {
  [key: string]: {
    name: string;
    messageId: string;
    defaultMessage: string;
    helpMessageId: string;
    helpDefaultMessage: string;
    type: string;
  };
} = {
  address: {
    name: "Address input",
    messageId: "address.input",
    defaultMessage: "Address input",
    helpMessageId: "address.input.type.description",
    helpDefaultMessage:
      'The "address input" type serves to define an enumeration of addresses that can be used in this input',
    type: "address",
  },
  connectedAccount: {
    name: "Connected account",
    messageId: "connected.account",
    defaultMessage: "Connected account",
    helpMessageId: "connected.account.input.type.description",
    helpDefaultMessage:
      'The "Connected account" type is used to makes the input use the connected account of the user wallet',
    type: "address",
  },
  switch: {
    name: "switch",
    messageId: "switch.button",
    defaultMessage: "Switch Button",
    helpMessageId: "switch.type.description",
    helpDefaultMessage:
      'The "switch" type serves to change the input component of this field to a visual "switch" component instead of a free text field',
    type: "bool",
  },
  decimal: {
    name: "decimal",
    messageId: "formatted.decimal",
    defaultMessage: "Formatted Decimal",
    helpMessageId: "decimal.type.description",
    helpDefaultMessage:
      'The "decimal" type serves to insert numbers in decimal format according to the total of decimals defined in the field below.',
    type: "uint256",
  },
  options: {
    name: "options",
    messageId: "options",
    defaultMessage: "Options",
    helpDefaultMessage: "Use pre-defined options on the input",
    helpMessageId: "use.pre.defined.option.on.the.input",
    type: "bytes32",
  },
};

export const THIRDWEB_CONTRACT_LIST_URL = "";

export const THIRDWEB_ICON_URL =
  "https://ipfs-public.thirdwebcdn.com/ipfs/QmeNn6emc8Z3VMTFBKSSozSHiG3qt36bFi7EuPCiGGpo17/0.png";

export const THIRD_WEB_CONTRACT_VERSIONS: { [key: string]: string } = {
  DropERC20: "4.0.3",
  DropERC721: "4.1.0",
  DropERC1155: "4.1.0",
  MarketplaceV3: "2.0.1",
  Multiwrap: "1.1.8",
  NFTStake: "1.0.3",
  TokenStake: "1.0.3",
  EditionStake: "1.0.3",
  Pack: "2.0.8",
  SignatureDrop: "0.0.6",
  Split: "1.0.3",
  TokenERC1155: "1.2.0",
  TokenERC20: "1.0.8",
  TokenERC721: "1.1.0",
  VoteERC20: "1.0.8",
  AirdropERC20: "1.0.7",
  AirdropERC721: "1.0.7",
  AirdropERC1155: "1.0.8",
};
