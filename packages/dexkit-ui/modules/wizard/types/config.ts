import type { TokenWhitelabelApp } from "@dexkit/core/types";
import type { AppWhitelabelType, ThemeMode } from "@dexkit/ui/constants/enum";
import type { GatedPageLayout, SiteMetadata } from ".";
import type { AssetAPI } from "../../nft/types";
import type { AppPageSection } from "./section";

export type VideoEmbedType = "youtube" | "vimeo";

export type SocialMediaTypes =
  | "instagram"
  | "facebook"
  | "twitter"
  | "youtube"
  | "linkedin"
  | "pinterest"
  | "reddit";

export interface MenuTree {
  name: string;
  type: "Page" | "Menu" | "External";
  href?: string;
  data?: any;
  children?: MenuTree[];
}

export interface MenuSettings {
  layout?: {
    type?: string;
    variant?: string;
  };
}

export interface AssetItemType {
  type: "asset";
  title: string;
  chainId: number;
  contractAddress: string;
  tokenId: string;
}

export interface SearchbarConfig {
  enabled?: boolean;
  hideCollections?: boolean;
  hideTokens?: boolean;
}

export interface CollectionItemType {
  type: "collection";
  variant: "default" | "simple";
  featured?: boolean;
  title: string;
  subtitle: string;
  backgroundImageUrl: string;
  chainId: number;
  contractAddress: string;
}

export type SectionItem = AssetItemType | CollectionItemType;

export type PageSectionVariant = "dark" | "light";

export interface GatedCondition {
  type?: "collection" | "coin" | "multiCollection";
  condition?: "and" | "or";
  protocol?: "ERC20" | "ERC721" | "ERC1155";
  decimals?: number;
  address?: string;
  symbol?: string;
  chainId?: number;
  amount: string;
  tokenId?: string;
}

export type LayoutPosMobile = "top" | "bottom";
export type LayoutPosDesktop = "top" | "bottom" | "side";

export type PageSectionsTabsLayout = {
  type: "tabs";
  layout?: {
    desktop: { position: LayoutPosDesktop };
    mobile: { position: LayoutPosMobile };
  };
};

export type PageSectionsListLayout = {
  type: "list";
};

export type PageSectionsLayout =
  | PageSectionsListLayout
  | PageSectionsTabsLayout;

export interface AppPageOptions {
  key?: string;
  title?: string;
  clonedPageKey?: string;
  uri?: string;
  layout?: PageSectionsLayout;
  isEditGatedConditions?: boolean;
  enableGatedConditions?: boolean;
  gatedConditions?: GatedCondition[];
  gatedPageLayout?: GatedPageLayout;
}

export type AppPage = {
  gatedConditions?: GatedCondition[];
  sections: AppPageSection[];
} & AppPageOptions;

export interface SocialMedia {
  type: SocialMediaTypes;
  handle: string;
}

export interface SocialMediaCustom {
  link: string;
  iconUrl: string;
  label: string;
}

interface SeoImage {
  url: string;
  width?: number;
  height?: number;
  alt?: string;
  type?: string;
}

export interface PageSeo {
  title: string;
  description: string;
  images: Array<SeoImage>;
}

export interface AppCollection {
  image: string;
  name: string;
  backgroundImage: string;
  chainId: number;
  contractAddress: string;
  description?: string;
  uri?: string;
  disableSecondarySells?: boolean;
}

export interface AppToken {
  name?: string;
  logoURI?: string;
  keywords?: string[];
  tags?: {
    [key: string]: {
      name: string;
      description: string;
    };
  };
  timestamp?: string;
  tokens: TokenWhitelabelApp[];
}

export interface CommerceConfig {
  enabled?: boolean;
}

export interface AppConfig {
  name: string;
  locale?: string;
  hide_powered_by?: boolean;
  activeChainIds?: number[];
  font?: {
    family: string;
    category?: string;
  };
  defaultThemeMode?: ThemeMode;
  theme: string;
  customTheme?: string;
  customThemeLight?: string;
  customThemeDark?: string;
  domain: string;
  email: string;
  currency: string;
  logo?: {
    width?: number;
    height?: number;
    widthMobile?: number;
    heightMobile?: number;
    url: string;
  };
  logoDark?: {
    width?: number;
    height?: number;
    widthMobile?: number;
    heightMobile?: number;
    url?: string;
  };
  favicon_url?: string;
  social?: SocialMedia[];
  social_custom?: SocialMediaCustom[];
  pages: { [key: string]: AppPage };
  transak?: { enabled: boolean };
  fees?: {
    amount_percentage: number;
    recipient: string;
  }[];
  swapFees?: {
    recipient: string;
    amount_percentage: number;
  };
  searchbar?: SearchbarConfig;
  format?: {
    date: string;
    datetime: string;
  };
  menuSettings?: MenuSettings;
  menuTree?: MenuTree[];
  footerMenuTree?: MenuTree[];
  collections?: AppCollection[];
  seo?: {
    [key: string | "home"]: PageSeo;
  };
  analytics?: {
    gtag?: string;
  };
  tokens?: AppToken[];
  commerce?: CommerceConfig;
}
export interface ConfigResponse {
  id: number;
  slug: string;
  config: string;
  isTemplate?: boolean;
  domain: string;
  cname?: string;
  domainStatus?: string;
  type: AppWhitelabelType;
  active?: boolean;
  previewUrl?: string;
  nft?: AssetAPI;
}

export interface SiteResponse {
  id: number;
  slug: string;
  config: string;
  domain: string;
  cname?: string;
  owner?: string;
  clonable?: string;
  metadata: SiteMetadata;
  domainStatus?: string;
  emailVerified?: boolean;
  type: AppWhitelabelType;
  active?: boolean;
  previewUrl?: string;
  nft?: AssetAPI;
  lastVersionSet?: {
    version: string;
  };
  verifyDomainRawData?: string;
  permissions?: {
    accountId: string;
    permissions: {
      [key: string]: boolean;
    };
  }[];
}
