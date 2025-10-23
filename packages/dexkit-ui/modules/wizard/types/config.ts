import type { TokenWhitelabelApp } from "@dexkit/core/types";
import type { AppWhitelabelType, ThemeMode } from "@dexkit/ui/constants/enum";
import type { GatedPageLayout, SiteMetadata } from ".";
import type { AssetAPI } from "../../nft/types";
import type { AppPageSection } from "./section";

export type VideoEmbedType = "youtube" | "vimeo" | "custom";

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

export interface NavbarGlassSettings {
  backgroundType?: "solid" | "gradient" | "image";
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundSize?: "cover" | "contain" | "auto" | "100% 100%";
  backgroundPosition?: "center" | "top" | "bottom" | "left" | "right" | "top-left" | "top-right" | "bottom-left" | "bottom-right";
  backgroundRepeat?: "no-repeat" | "repeat" | "repeat-x" | "repeat-y";
  backgroundAttachment?: "fixed" | "scroll";
  gradientStartColor?: string;
  gradientEndColor?: string;
  gradientDirection?: string;
  blurIntensity?: number;
  glassOpacity?: number;
  disableBackground?: boolean;
  textColor?: string;
  iconColor?: string;
  logoPosition?: "left" | "center" | "right";
  menuPosition?: "left" | "center" | "right";
  actionsPosition?: "left" | "center" | "right";
  logoSize?: "small" | "medium" | "large" | "custom";
  customLogoWidth?: number;
  customLogoHeight?: number;
  borderRadius?: number;
  tabBuyColor?: string;
  tabSellColor?: string;
  tabBuyTextColor?: string;
  tabSellTextColor?: string;
  fillButtonColor?: string;
  fillButtonTextColor?: string;
  outlineButtonColor?: string;
  outlineButtonTextColor?: string;
  colorScheme?: {
    light?: {
      backgroundColor?: string;
      backgroundImage?: string;
      gradientStartColor?: string;
      gradientEndColor?: string;
      textColor?: string;
      iconColor?: string;
    };
    dark?: {
      backgroundColor?: string;
      backgroundImage?: string;
      gradientStartColor?: string;
      gradientEndColor?: string;
      textColor?: string;
      iconColor?: string;
    };
  };
}

export interface NavbarCustomSettings {
  backgroundType?: "solid" | "gradient" | "image";
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundSize?: "cover" | "contain" | "auto" | "100% 100%";
  backgroundPosition?: "center" | "top" | "bottom" | "left" | "right" | "top-left" | "top-right" | "bottom-left" | "bottom-right";
  backgroundRepeat?: "no-repeat" | "repeat" | "repeat-x" | "repeat-y";
  backgroundAttachment?: "fixed" | "scroll";
  gradientStartColor?: string;
  gradientEndColor?: string;
  gradientDirection?: string;
  blurIntensity?: number;
  borderRadius?: number;
  padding?: number;
  height?: number;
  logoPosition?: "left" | "center" | "right" | "center-left" | "center-right";
  logoSize?: "small" | "medium" | "large" | "custom";
  customLogoWidth?: number;
  customLogoHeight?: number;
  showLogo?: boolean;
  menuPosition?: "left" | "center" | "right" | "center-left" | "center-right";
  menuHoverColor?: string;
  menuActiveColor?: string;
  menuFontSize?: number;
  menuFontWeight?: "normal" | "bold" | "400" | "500" | "600" | "700";
  menuSpacing?: number;
  actionsPosition?: "left" | "center" | "right" | "center-left" | "center-right";
  iconColor?: string;
  iconHoverColor?: string;
  iconSize?: "small" | "medium" | "large";
  showIcons?: boolean;
  textColor?: string;
  linkColor?: string;
  linkHoverColor?: string;
  walletButtonTextColor?: string;
  showShadow?: boolean;
  shadowColor?: string;
  shadowIntensity?: number;
  showBorder?: boolean;
  borderColor?: string;
  borderWidth?: number;
  borderPosition?: "top" | "bottom" | "both";
  opacity?: number;
  mobileHeight?: number;
  mobilePadding?: number;
  mobileLogoSize?: "small" | "medium" | "large" | "custom";
  mobileCustomLogoWidth?: number;
  mobileCustomLogoHeight?: number;
  colorScheme?: {
    light?: {
      backgroundColor?: string;
      backgroundImage?: string;
      gradientStartColor?: string;
      gradientEndColor?: string;
      textColor?: string;
      iconColor?: string;
      iconHoverColor?: string;
      menuHoverColor?: string;
      menuActiveColor?: string;
      linkColor?: string;
      linkHoverColor?: string;
      walletButtonTextColor?: string;
      borderColor?: string;
      shadowColor?: string;
    };
    dark?: {
      backgroundColor?: string;
      backgroundImage?: string;
      gradientStartColor?: string;
      gradientEndColor?: string;
      textColor?: string;
      iconColor?: string;
      iconHoverColor?: string;
      menuHoverColor?: string;
      menuActiveColor?: string;
      linkColor?: string;
      linkHoverColor?: string;
      walletButtonTextColor?: string;
      borderColor?: string;
      shadowColor?: string;
    };
  };
}

export interface BottomBarSettings {
  showText?: boolean;
  backgroundColor?: string;
  textColor?: string;
  activeColor?: string;
  iconSize?: "small" | "medium" | "large";
  customIconSize?: number;
  fontSize?: number;
  showBorder?: boolean;
  borderColor?: string;
  elevation?: number;
}

export interface MiniSidebarSettings {
  startExpanded?: boolean;
}

export interface MenuSettings {
  layout?: {
    type?: string;
    variant?: string;
    glassSettings?: NavbarGlassSettings;
    customSettings?: NavbarCustomSettings;
    bottomBarSettings?: BottomBarSettings;
    miniSidebarSettings?: MiniSidebarSettings;
  };
}

export interface AssetItemType {
  type: "asset";
  title: string;
  chainId: number;
  contractAddress: string;
  backgroundImageUrl?: string;
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
