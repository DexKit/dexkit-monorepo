import type { ChainConfig } from "@dexkit/widgets/src/widgets/swap/types";

export interface SwapFeeForm {
  recipient: string;
  amountPercentage: number;
}

export interface SeoForm {
  title: string;
  description: string;
  shareImageUrl: string;
}

export enum SetupSteps {
  Disabled = -1,
  General,
  Theme,
  Collection,
  Pages,
  PagesMenu,
  Tokens,
  Fees,
  SwapFees,
  Seo,
  Done,
}

export enum WizardSetupSteps {
  Disabled = -1,
  Required,
  General,
  CollectionTokens,
  Layout,
  Done,
}

export interface StepperButtonProps {
  handleNext?: () => void;
  handleBack?: () => void;
  disableContinue?: boolean;
  isLastStep?: boolean;
  isFirstStep?: boolean;
}

export interface GatedCondition {
  type?: "collection" | "coin" | "multiCollection";
  condition?: "and" | "or";
  protocol?: "ERC20" | "ERC711" | "ERC1155";
  decimals?: number;
  address?: string;
  symbol?: string;
  chainId?: number;
  amount: string;
  tokenId?: string;
}

export interface GatedPageLayout {
  frontImage?: string;
  frontImageHeight?: number;
  frontImageWidth?: number;
  accessRequirementsMessage?: string;
}

export type MintNFTFormType = {
  name: string;
  description?: string;
  background_color?: string;
  animation_url?: string;
  image?: string;
  external_url?: string;
};

export type ThemeFormType = {
  primary?: string;
  secondary?: string;
  text?: string;
  background?: string;
  success?: string;
  error?: string;
  warning?: string;
  info?: string;
  paper?: string;
  themeId: string;
  borderRadius?: number;
};

export enum PreviewType {
  Swap = "swap",
  Exchange = "exchange",
  NFTs = "nfts",
}

export type AssetFormType = {
  address: string;
  network: string;
  tokenId: string;
  enableFiat?: boolean;
  enableDrops?: boolean; // only on edition
  enableDarkblock?: boolean;
};

export interface GamificationPoint {
  userEventType?: string;
  points?: number;
  filter?: string;
}

export type DeployedContract = {
  name: string;
  contractAddress: string;
  owner: string;
  id: number;
  type?: string;
  chainId?: number;
};

export enum SwapVariant {
  Classic = "classic",
  UniswapLike = "uniswap-like",
  MatchaLike = "matcha-like",
}

export interface SwapConfig {
  defaultChainId?: number;
  defaultEditChainId?: number;
  enableUrlParams?: boolean;
  enableImportExternTokens?: boolean;
  useGasless?: boolean;
  variant?: SwapVariant;
  myTokensOnlyOnSearch?: boolean;
  configByChain?: {
    [chain: number]: ChainConfig;
  };
}

export interface SiteMetadata {
  id?: number;
  slug?: string;
  title: string;
  subtitle: string;
  description: string;
  imageURL: string;
  chainIds?: number[];
  usecases?: string[];
}
