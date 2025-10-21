import { OrderMarketType } from "@dexkit/exchange/constants";
import { DexkitExchangeSettings } from "@dexkit/exchange/types";
import { ContractFormParams } from "@dexkit/web3forms/types";
import React from "react";
import { AssetFormType, DeployedContract, SwapConfig, SwapVariant } from ".";
import { AssetStoreOptions } from "../../nft/types";
import { PageSectionVariant, SectionItem, VideoEmbedType } from "./config";

export type SectionType =
  | "video"
  | "call-to-action"
  | "featured"
  | "collections"
  | "swap"
  | "custom"
  | "asset-store"
  | "markdown"
  | "wallet"
  | "contract"
  | "user-contract-form"
  | "exchange"
  | "edition-drop-section"
  | "edition-drop-list-section"
  | "token-drop"
  | "nft-drop"
  | "token-stake"
  | "nft-stake"
  | "edition-stake"
  | "token"
  | "airdrop-token"
  | "code-page-section"
  | "collection"
  | "dex-generator-section"
  | "asset-section"
  | "ranking"
  | "market-trade"
  | "token-trade"
  | "claim-airdrop-token-erc-20"
  | "carousel"
  | "showcase"
  | "plugin"
  | "commerce"
  | "referral"
  | "widget"
  | "card"
  | "accordion"
  | "stepper"
  | "tabs"

  ;

export interface PageSection {
  type: SectionType;
  title?: string;
  name?: string;
  variant?: PageSectionVariant;
  hideMobile?: boolean;
  hideDesktop?: boolean;
}

export interface CallToActionAppPageSection extends PageSection {
  type: "call-to-action";
  title?: string;
  subtitle: string;
  button: {
    title: string;
    url: string;
    openInNewPage?: boolean;
  };
  items: SectionItem[];
}

export interface VideoEmbedAppPageSection extends PageSection {
  type: "video";
  title: string;
  embedType: VideoEmbedType;
  videoUrl: string;
}

export interface FeaturedAppPageSection extends PageSection {
  type: "featured";
  title: string;
  items: SectionItem[];
}

export interface CollectionAppPageSection extends Omit<PageSection, 'variant'> {
  type: "collections";
  title: string;
  items: SectionItem[];
  variant?: "grid" | "list" | "carousel" | "cards" | "masonry" | "hero" | "compact";
  hideTitle?: boolean;
}

export interface SwapPageSection extends PageSection {
  type: "swap";
  title?: string;
  config?: SwapConfig;
}

export interface AssetStorePageSection extends PageSection {
  type: "asset-store";
  title?: string;
  config?: AssetStoreOptions;
}

export interface CustomEditorSection extends PageSection {
  type: "custom";
  title?: string;
  data: string | null | undefined;
}

export interface MarkdownEditorPageSection extends PageSection {
  type: "markdown";
  title?: string;
  config?: { source?: string };
}

export interface WalletPageSection extends PageSection {
  type: "wallet";
  settings?: WalletSettings;
}

export type WalletVariant = "default" | "glass" | "custom";

export interface WalletCustomSettings {
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
  primaryTextColor?: string;
  secondaryTextColor?: string;
  balanceTextColor?: string;
  backgroundBlur?: number;

  sendButtonConfig?: {
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
    hoverBackgroundColor?: string;
  };
  receiveButtonConfig?: {
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
    hoverBackgroundColor?: string;
  };
  scanButtonConfig?: {
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
    hoverBackgroundColor?: string;
  };
  importTokenButtonConfig?: {
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
    hoverBackgroundColor?: string;
  };
  swapButtonConfig?: {
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
    hoverBackgroundColor?: string;
  };
  backButtonConfig?: {
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
    hoverBackgroundColor?: string;
  };

  networkSelectorConfig?: {
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
    hoverBackgroundColor?: string;
  };

  cardConfig?: {
    backgroundColor?: string;
    borderColor?: string;
    borderRadius?: number;
    shadowColor?: string;
    shadowIntensity?: number;
  };

  inputConfig?: {
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
    focusBorderColor?: string;
    placeholderColor?: string;
    iconColor?: string;
  };
  paginationConfig?: {
    textColor?: string;
    backgroundColor?: string;
    buttonColor?: string;
    buttonHoverColor?: string;
    selectBackgroundColor?: string;
    selectTextColor?: string;
  };
  activityTableConfig?: {
    headerBackgroundColor?: string;
    headerTextColor?: string;
    rowBackgroundColor?: string;
    rowTextColor?: string;
    hoverRowBackgroundColor?: string;
    borderColor?: string;
  };
  tokenSearchConfig?: {
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
    focusBorderColor?: string;
    placeholderColor?: string;
    iconColor?: string;
  };

  layout?: {
    componentOrder?: Array<"balance" | "actions" | "search" | "tabs" | "content">;
    spacing?: number;
    actionButtonsLayout?: "horizontal" | "vertical" | "grid";
    actionButtonsAlignment?: "left" | "center" | "right";
  };

  visibility?: {
    hideNFTs?: boolean;
    hideActivity?: boolean;
    hideTransactions?: boolean;
    hideTrades?: boolean;
    hideSearch?: boolean;
    hideImportToken?: boolean;
    hideSendButton?: boolean;
    hideReceiveButton?: boolean;
    hideScanButton?: boolean;
    hideNetworkSelector?: boolean;
    hideBalance?: boolean;
    hideSwapAction?: boolean;
    hideExchangeAction?: boolean;
    hideSendAction?: boolean;
  };

  swapConfig?: {
    variant?: SwapVariant;
    glassSettings?: {
      blurIntensity?: number;
      glassOpacity?: number;
    };
  };

  exchangeConfig?: {
    variant?: "default" | "custom";
    inheritWalletColors?: boolean;

    tradeWidgetPrimaryTextColor?: string;
    tradeWidgetButtonTextColor?: string;
    tradeWidgetInputTextColor?: string;
    tradeWidgetTabTextColor?: string;
    fillAmountButtonActiveColor?: string;
    fillAmountButtonInactiveColor?: string;
    fillAmountButtonActiveTextColor?: string;
    fillAmountButtonInactiveTextColor?: string;
    tokenInfoBarBackgroundColor?: string;
    tokenInfoBarPrimaryTextColor?: string;
  };


  nftColors?: {
    titleColor?: string;
    collectionColor?: string;
    cardBackgroundColor?: string;
    cardBorderColor?: string;
  };

  tabsConfig?: {
    backgroundColor?: string;
    activeTabColor?: string;
    inactiveTabColor?: string;
    activeTabTextColor?: string;
    inactiveTabTextColor?: string;
    tabBarBackgroundColor?: string;
    indicatorColor?: string;
    tokensTitleColor?: string;
    nftsTitleColor?: string;
    tokensIndicatorColor?: string;
    nftsIndicatorColor?: string;
    collectedTitleColor?: string;
    favoritesTitleColor?: string;
    hiddenTitleColor?: string;
    collectedIndicatorColor?: string;
    favoritesIndicatorColor?: string;
    hiddenIndicatorColor?: string;
  };

  tokenTableConfig?: {
    headerBackgroundColor?: string;
    headerTextColor?: string;
    rowBackgroundColor?: string;
    rowTextColor?: string;
    hoverRowBackgroundColor?: string;
    borderColor?: string;
  };

  filterConfig?: {
    closeArrowColor?: string;
  };

  removePadding?: boolean;
  customPadding?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };
}

export interface WalletGlassSettings {
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
  hideNFTs?: boolean;
  hideActivity?: boolean;
  hideSwapAction?: boolean;
  hideExchangeAction?: boolean;
  hideSendAction?: boolean;
  networkModalTextColor?: string;
  receiveModalTextColor?: string;
  sendModalTextColor?: string;
  scanModalTextColor?: string;
  importTokenModalTextColor?: string;
  removePadding?: boolean;
  customPadding?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };
}

export interface WalletSettings {
  variant?: WalletVariant;
  glassSettings?: WalletGlassSettings;
  customSettings?: WalletCustomSettings;
}

export interface ContractPageSection extends PageSection {
  type: "contract";
  config?: ContractFormParams;
}

export interface UserContractPageSection extends PageSection {
  type: "user-contract-form";
  formId: number;
  hideFormInfo?: boolean;
}

export interface ChipConfig {
  text: string;
  emoji: string;
  color: 'success' | 'primary' | 'secondary' | 'info' | 'warning' | 'error';
}

export interface CustomStyleConfig {
  backgroundColor?: {
    type: 'solid' | 'gradient';
    solid?: string;
    gradient?: {
      from: string;
      to: string;
      direction?: 'to-r' | 'to-br' | 'to-b' | 'to-bl' | 'to-l' | 'to-tl' | 'to-t' | 'to-tr';
    };
  };
  inputColors?: {
    backgroundColor?: string;
    borderColor?: string;
    textColor?: string;
    focusBorderColor?: string;
  };
  buttonColors?: {
    backgroundColor?: string;
    hoverBackgroundColor?: string;
    textColor?: string;
    borderColor?: string;
  };
  textColors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    chipsTitle?: string;
    balanceLabel?: string;
    balanceValue?: string;
    contractDescription?: string;
    quantityLabel?: string;
    maxPerWalletLabel?: string;
    currentBalanceLabel?: string;
    maxTotalPhaseLabel?: string;
    availableRemainingLabel?: string;
  };
  statsColors?: {
    maxTotalBackground?: string;
    maxTotalBorder?: string;
    availableRemainingBackground?: string;
    availableRemainingBorder?: string;
  };
  phaseColors?: {
    currentPhaseBackground?: string;
    currentPhaseBorder?: string;
    currentPhaseTitle?: string;
    currentPhaseText?: string;
    phaseEndsBackground?: string;
    phaseEndsBorder?: string;
    phaseEndsTitle?: string;
    phaseEndsText?: string;
    nextPhaseBackground?: string;
    nextPhaseBorder?: string;
    nextPhaseTitle?: string;
    nextPhaseText?: string;
  };
  fontFamily?: string;
  borderRadius?: number;
}

export interface TokenDropPageSection extends PageSection {
  type: "token-drop";
  settings: {
    network: string;
    address: string;
    variant?: "simple" | "detailed" | "premium";
    customTitle?: string;
    customSubtitle?: string;
    customChips?: ChipConfig[];
    customChipsTitle?: string;
    customStyles?: CustomStyleConfig;
  };
}

export interface NftDropPageSection extends PageSection {
  type: "nft-drop";
  settings: {
    network: string;
    address: string;
    variant?: "simple" | "detailed" | "premium";
    customTitle?: string;
    customSubtitle?: string;
    customChips?: ChipConfig[];
    customChipsTitle?: string;
    customStyles?: CustomStyleConfig;
  };
}

export interface StakeErc20PageSection extends PageSection {
  type: "token-stake";
  settings: {
    network: string;
    address: string;
  };
}

export interface StakeErc155PageSection extends PageSection {
  type: "edition-stake";
  settings: {
    network: string;
    address: string;
  };
}

export interface StakeErc721PageSection extends PageSection {
  type: "nft-stake";
  settings: {
    network: string;
    address: string;
  };
}

export interface AirdropErc20PageSection extends PageSection {
  type: "airdrop-token";
  settings: {
    network: string;
    address: string;
  };
}

export interface ClaimAirdropErc20PageSection extends PageSection {
  type: "claim-airdrop-token-erc-20";
  settings: {
    network: string;
    address: string;
  };
}

export interface TokenErc20PageSection extends PageSection {
  type: "token";
  settings: {
    network: string;
    address: string;
    disableTransfer?: boolean;
    disableBurn?: boolean;
    disableMint?: boolean;
    disableInfo?: boolean;
  };
}

export interface ExchangePageSection extends PageSection {
  type: "exchange";
  settings: DexkitExchangeSettings;
}

export interface EditionDropPageSection extends PageSection {
  type: "edition-drop-section";
  config: {
    network: string;
    address: string;
    tokenId: string;
  };
}

export interface EditionDropListPageSection extends PageSection {
  type: "edition-drop-list-section";
  config: {
    address: string;
    network: string;
  };
}

export interface CodePageSection extends PageSection {
  type: "code-page-section";
  config: {
    js: string;
    css: string;
    html: string;
  };
}

export interface MarketTradePageSection extends PageSection {
  type: "market-trade";
  config: {
    show: OrderMarketType;
    slippage?: number;
    useGasless?: boolean;
    baseTokenConfig: { address: string; chainId: number };
  };
}

export interface TokenTradePageSection extends PageSection {
  type: "token-trade";
  config: {
    showTokenDetails?: boolean;
    show?: OrderMarketType;
    useGasless?: boolean;
    slippage?: number;
    baseTokenConfig?: { address?: string; chainId?: number };
  };
}

export interface AssetPageSection extends PageSection {
  type: "asset-section";
  config: AssetFormType;
}

export interface CollectionPageSection extends PageSection {
  type: "collection";
  config: {
    address: string;
    network: string;
    hideFilters: boolean;
    showPageHeader: boolean;
    showCollectionStats?: boolean;
    hideHeader: boolean;
    hideDrops: boolean;
    hideAssets: boolean;
    disableSecondarySells?: boolean;
    showSidebarOnDesktop?: boolean;
    isLock?: boolean;
  };
}

export interface TokenTradePageSection extends PageSection {
  type: "token-trade";
  config: {
    useGasless?: boolean;
    showTokenDetails?: boolean;
    show?: OrderMarketType;
    slippage?: number;
    baseTokenConfig?: { address?: string; chainId?: number };
  };
}

export interface RankingPageSection extends PageSection {
  type: "ranking";
  settings: {
    rankingId?: number;
  };
}

export interface WidgetPageSection extends PageSection {
  type: "widget";
  config: {
    widgetId?: number;
  };
}

export interface CardPageSection extends PageSection {
  type: "card";
  settings: {
    cards: Array<{
      id: string;
      title: string;
      description?: string;
      image?: string;
      imageFile?: File;
      actions?: Array<{
        label: string;
        href?: string;
        onClick?: () => void;
      }>;
      layout: {
        x: number;
        y: number;
        w: number;
        h: number;
        minW?: number;
        maxW?: number;
        minH?: number;
        maxH?: number;
        static?: boolean;
        isDraggable?: boolean;
        isResizable?: boolean;
      };
    }>;
    gridSettings: {
      cols: number;
      rowHeight: number;
      margin: [number, number];
      containerPadding: [number, number];
      compactType: 'vertical' | 'horizontal' | null;
      allowOverlap?: boolean;
      preventCollision?: boolean;
      isDraggable?: boolean;
      isResizable?: boolean;
    };
    responsive?: {
      breakpoints: Record<string, number>;
      cols: Record<string, number>;
    };
  };
}

export interface AccordionPageSection extends PageSection {
  type: "accordion";
  settings: {
    accordions: Array<{
      id: string;
      title: string;
      content: string;
      summary?: string;
      expanded?: boolean;
      disabled?: boolean;
      actions?: Array<{
        label: string;
        href?: string;
        onClick?: () => void;
        variant?: 'text' | 'outlined' | 'contained';
        color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
        size?: 'small' | 'medium' | 'large';
        startIcon?: string;
        endIcon?: string;
        disabled?: boolean;
      }>;
      titleVariant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'subtitle1' | 'subtitle2' | 'body1' | 'body2' | 'caption' | 'button' | 'overline';
      contentVariant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'subtitle1' | 'subtitle2' | 'body1' | 'body2' | 'caption' | 'button' | 'overline';
      ariaControls?: string;
      ariaExpanded?: boolean;
      sx?: any;
      summaryProps?: any;
      detailsProps?: any;
      expandIcon?: string;
      collapseIcon?: string;
    }>;
    settings: {
      variant?: 'elevation' | 'outlined';
      square?: boolean;
      disableGutters?: boolean;
      defaultExpanded?: string[];
      expandedIds?: string[];
      allowMultiple?: boolean;
      unmountOnExit?: boolean;
      headingComponent?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div';
      transitionDuration?: number | 'auto';
      transitionEasing?: string;
      spacing?: number;
      fullWidth?: boolean;
      elevation?: number;
      borderRadius?: number;
      sx?: any;
      actionsPlacement?: 'summary' | 'details' | 'both';
      actionsAlignment?: 'left' | 'center' | 'right';
      defaultExpandIcon?: string;
      defaultCollapseIcon?: string;
      iconPosition?: 'start' | 'end';
      hideExpandIcon?: boolean;
      defaultTitleVariant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'subtitle1' | 'subtitle2' | 'body1' | 'body2' | 'caption' | 'button' | 'overline';
      defaultContentVariant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'subtitle1' | 'subtitle2' | 'body1' | 'body2' | 'caption' | 'button' | 'overline';
      disableRipple?: boolean;
      focusRipple?: boolean;
      className?: string;
      onChange?: (accordionId: string, expanded: boolean) => void;
    };
  };
}

export interface StepperPageSection extends PageSection {
  type: "stepper";
  settings: {
    steps: Array<{
      id: string;
      label: string;
      content: string;
      description?: string;
      completed?: boolean;
      optional?: boolean;
      error?: boolean;
      disabled?: boolean;
      icon?: string;
      iconColor?: string;
      actions?: Array<{
        label: string;
        href?: string;
        onClick?: () => void;
        variant?: 'text' | 'outlined' | 'contained';
        color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
        size?: 'small' | 'medium' | 'large';
        startIcon?: string;
        endIcon?: string;
        disabled?: boolean;
        sx?: any;
      }>;
      sx?: any;
      stepProps?: any;
      stepLabelProps?: any;
      stepContentProps?: any;
      stepButtonProps?: any;
    }>;
    orientation?: 'horizontal' | 'vertical';
    variant?: 'elevation' | 'outlined';
    linear?: boolean;
    alternativeLabel?: boolean;
    connector?: string;
    elevation?: number;
    borderRadius?: number;
    square?: boolean;
    nonLinear?: boolean;
    allowStepSkipping?: boolean;
    allowStepReset?: boolean;
    mobileStepper?: boolean;
    mobileStepperVariant?: 'text' | 'dots' | 'progress';
    mobileStepperPosition?: 'bottom' | 'top' | 'static';
    mobileStepperLinearProgress?: boolean;
    fullWidth?: boolean;
    spacing?: number;
    padding?: number;
    showBackButton?: boolean;
    showNextButton?: boolean;
    showSkipButton?: boolean;
    showResetButton?: boolean;
    backButtonText?: string;
    nextButtonText?: string;
    skipButtonText?: string;
    resetButtonText?: string;
    finishButtonText?: string;
    defaultStepIcon?: string;
    completedStepIcon?: string;
    errorStepIcon?: string;
    hideStepIcons?: boolean;
    customStepIcons?: Record<number, string>;
    unmountOnExit?: boolean;
    transitionDuration?: number | 'auto';
    transitionEasing?: string;
    validateOnNext?: boolean;
    onStepChange?: (activeStep: number, previousStep: number) => void;
    onStepClick?: (step: number) => void;
    onComplete?: () => void;
    onReset?: () => void;
    sx?: any;
    className?: string;
    stepperProps?: any;
    stepIconProps?: any;
    stepConnectorProps?: any;
  };
}

export interface TabsPageSection extends PageSection {
  type: "tabs";
  settings: {
    tabs: Array<{
      id: string;
      label: string;
      content: string;
      icon?: string;
      iconPosition?: 'start' | 'end' | 'top' | 'bottom';
      disabled?: boolean;
      wrapped?: boolean;
      sx?: any;
      tabProps?: any;
    }>;
    orientation?: 'horizontal' | 'vertical';
    variant?: 'standard' | 'scrollable' | 'fullWidth';
    indicatorColor?: 'primary' | 'secondary';
    textColor?: 'primary' | 'secondary' | 'inherit';
    centered?: boolean;
    allowScrollButtonsMobile?: boolean;
    scrollButtons?: boolean | 'auto';
    selectionFollowsFocus?: boolean;
    visibleScrollbar?: boolean;
    fullWidth?: boolean;
    borderRadius?: number;
    elevation?: number;
    padding?: number;
    backgroundColor?: string;
    className?: string;
    sx?: any;
    tabsProps?: any;
  };
}

export type SlideActionLink = {
  type: "link";
  caption?: string;
  url?: string;
};

export type SlideActionPage = {
  type: "page";
  page?: string;
  caption?: string;
};

export type SlideAction = SlideActionLink | SlideActionPage;

export interface CarouselSlide {
  title: string;
  subtitle?: string;
  imageUrl: string;
  textColor?: string;
  overlayColor?: string;
  overlayPercentage?: number;
  action?: SlideAction;
  imageScaling?: 'cover' | 'contain' | 'fill' | 'center' | 'mosaic' | 'expanded';
  imagePosition?: 'center' | 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  visualEffect?: 'none' | 'pulse' | 'float' | 'zoom' | 'slide' | 'rotate' | 'shake' | 'glow';
  effectIntensity?: 'low' | 'medium' | 'high';
  effectSpeed?: 'slow' | 'normal' | 'fast';
  effectDirection?: 'horizontal' | 'vertical' | 'diagonal' | 'radial';
}

export interface CarouselFormType {
  interval?: number;
  height?: {
    mobile?: number;
    desktop?: number;
  };
  paddingTop?: number;
  paddingBottom?: number;
  pagination?: {
    show?: boolean;
    position?: 'top' | 'bottom' | 'left' | 'right';
    alignment?: 'start' | 'center' | 'end';
    size?: 'small' | 'medium' | 'large';
    spacing?: number;
    activeColor?: string;
    inactiveColor?: string;
    activeSize?: number;
    inactiveSize?: number;
    activeOpacity?: number;
    inactiveOpacity?: number;
    showNumbers?: boolean;
    showProgress?: boolean;
    customStyle?: 'dots' | 'bars' | 'circles' | 'squares' | 'lines';
    animation?: 'fade' | 'scale' | 'slide' | 'bounce' | 'none';
  };
  navigation?: {
    show?: boolean;
    position?: 'inside' | 'outside';
    size?: 'small' | 'medium' | 'large';
    color?: string;
    backgroundColor?: string;
    hoverColor?: string;
    hoverBackgroundColor?: string;
    borderRadius?: number;
    opacity?: number;
    hoverOpacity?: number;
    showOnHover?: boolean;
    arrowStyle?: 'chevron' | 'triangle' | 'circle' | 'square';
  };
  slides: CarouselSlide[];
}

export interface CarouselPageSection extends PageSection {
  type: "carousel";
  settings: CarouselFormType;
}

export interface PluginPageSection extends PageSection {
  type: "plugin";
  data: unknown;
  pluginPath: string;
}

export type ShowCaseActionLink = {
  type: "link";
  url: string;
};

export type ShowCaseActionPage = {
  type: "page";
  page: string;
};

export type ShowCaseAction = ShowCaseActionLink | ShowCaseActionPage;

export type ShowCaseItemAsset = {
  type: "asset";
  contractAddress: string;
  tokenId: string;
  chainId: number;
  textAlign?: "left" | "center" | "right";
};

export type ShowCaseItemCollection = {
  type: "collection";
  title?: string;
  subtitle: string;
  imageUrl: string;
  contractAddress: string;
  tokenId: string;
  chainId: number;
  textAlign?: "left" | "center" | "right";
};

export type ShowCaseItemImage = {
  type: "image";
  textColor?: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  url?: string;
  page?: string;
  actionType?: "link" | "page";
  textAlign?: "left" | "center" | "right";
  customImageScaling?: "cover" | "contain" | "fill" | "center" | "mosaic" | "expanded";
  customImagePosition?: "center" | "top" | "bottom" | "left" | "right" | "top-left" | "top-right" | "bottom-left" | "bottom-right";
  customHoverEffect?: "none" | "zoom" | "lift" | "glow" | "fade" | "slide" | "rotate" | "scale";
  customCardStyle?: "default" | "minimal" | "elevated" | "bordered" | "glassmorphism";
  customBorderRadius?: number;
  customShadowIntensity?: "none" | "low" | "medium" | "high";
  customOverlayColor?: string;
  customOverlayOpacity?: number;
  customOverlayStyle?: "linear-top" | "linear-bottom" | "linear-left" | "linear-right" | "linear-top-left" | "linear-top-right" | "linear-bottom-left" | "linear-bottom-right" | "radial-center" | "radial-top" | "radial-bottom" | "radial-left" | "radial-right" | "radial-top-left" | "radial-top-right" | "radial-bottom-left" | "radial-bottom-right" | "uniform";
  showTextBelow?: boolean;
  priority?: "low" | "normal" | "high";
};

export type ShowCaseItem =
  | ShowCaseItemImage
  | ShowCaseItemAsset
  | ShowCaseItemCollection;

export type ShowCaseParams = {
  alignItems: "center" | "left" | "right";
  itemsSpacing: number;
  paddingTop: number;
  paddingBottom: number;
  items: ShowCaseItem[];
  layout: "grid" | "masonry" | "carousel" | "list";
  columns: { desktop: number; tablet: number; mobile: number };
  showOverlay: boolean;
  textOverlay: boolean;
  textOverlayPosition: "top" | "center" | "bottom" | "top-left" | "top-right" | "bottom-left" | "bottom-right" | "left" | "right";
  textOverlayBackground: "none" | "solid" | "gradient" | "blur";
  textOverlayBackgroundColor: string;
  textOverlayTextColor: string;
  textOverlayBorderRadius: number;
};

export interface ShowCasePageSection extends PageSection {
  type: "showcase";
  settings: ShowCaseParams;
}

export type CommerceContentBase = {};

export type CommerceCollectionContent = CommerceContentBase & {
  type: "collection";
  id: string;
};

export type CommerceCheckoutContent = CommerceContentBase & {
  type: "checkout";
  id: string;
};

export type CommerceSingleProductContent = CommerceContentBase & {
  type: "single-product";
  id: string;
};

export type CommerceStoreContent = CommerceContentBase & {
  type: "store";
  params: {
    emailRequired: boolean;
  };
};

export type CommerceContent =
  | CommerceCollectionContent
  | CommerceCheckoutContent
  | CommerceStoreContent
  | CommerceSingleProductContent;

export type CommerceSettings = {
  content: CommerceContent;
};

export interface CommercePageSection extends PageSection {
  type: "commerce";
  settings: CommerceSettings;
}

export type DexGeneratorPageSectionType =
  | TokenDropPageSection
  | NftDropPageSection
  | EditionDropPageSection
  | TokenErc20PageSection
  | AirdropErc20PageSection
  | StakeErc721PageSection
  | StakeErc20PageSection
  | StakeErc155PageSection
  | CollectionPageSection
  | ClaimAirdropErc20PageSection
  | ReferralPageSection;

export interface DexGeneratorPageSection extends PageSection {
  type: "dex-generator-section";
  contract?: DeployedContract;
  section?: DexGeneratorPageSectionType;
}

export type AppPageSection =
  | CallToActionAppPageSection
  | VideoEmbedAppPageSection
  | FeaturedAppPageSection
  | CollectionAppPageSection
  | CustomEditorSection
  | SwapPageSection
  | AssetStorePageSection
  | MarkdownEditorPageSection
  | WalletPageSection
  | ContractPageSection
  | UserContractPageSection
  | ExchangePageSection
  | EditionDropListPageSection
  | TokenDropPageSection
  | CodePageSection
  | CollectionPageSection
  | DexGeneratorPageSection
  | AssetPageSection
  | RankingPageSection
  | TokenTradePageSection
  | ClaimAirdropErc20PageSection
  | TokenTradePageSection
  | CarouselPageSection
  | ShowCasePageSection
  | PluginPageSection
  | CommercePageSection
  | ReferralPageSection
  | WidgetPageSection
  | CardPageSection
  | AccordionPageSection
  | StepperPageSection
  | TabsPageSection;

export interface SectionMetadata {
  type: SectionType;
  title?: string | React.ReactNode;
  titleId?: string;
  titleDefaultMessage?: string;
  subtitle?: string | React.ReactNode;
  category?: "all" | "cryptocurrency" | "resources" | "low-code" | "nft";
  description?: string | React.ReactNode;
  icon?: string | React.ReactNode;
}

export interface ReferralPageSection extends PageSection {
  type: "referral";
  title?: string;
  subtitle?: string;
  config?: {
    showStats?: boolean;
    showLeaderboard?: boolean;
    rankingId?: number;
    pointsConfig?: {
      connect: number;
      swap: number;
      default: number;
    };
  };
}