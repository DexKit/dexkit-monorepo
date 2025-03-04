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
  Swap = 'swap',
  Exchange = 'exchange',
  NFTs = 'nfts',
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
  title?: string;
  filter?: string;
}
