import CallToActionIcon from "@mui/icons-material/CallToAction";
import CodeIcon from "@mui/icons-material/Code";
import CollectionsIcon from "@mui/icons-material/Collections";
import DynamicFormIcon from "@mui/icons-material/DynamicForm";
import FeaturedVideoIcon from "@mui/icons-material/FeaturedVideo";
import GavelIcon from "@mui/icons-material/Gavel";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import StorefrontIcon from "@mui/icons-material/Storefront";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import {
  default as Token,
  default as TokenIcon,
} from "@mui/icons-material/Token";
import VideocamIcon from "@mui/icons-material/Videocam";
import ViewCarousel from "@mui/icons-material/ViewCarousel";
import WalletIcon from "@mui/icons-material/Wallet";
import { SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";

export const SECTIONS_TYPE_DATA_ICONS: {
  [key: string]: OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
    muiName: string;
  };
} = {
  video: VideocamIcon,
  "token-trade": TokenIcon,
  "call-to-action": CallToActionIcon,
  featured: FeaturedVideoIcon,
  swap: SwapHorizIcon,
  exchange: ShowChartIcon,
  "asset-store": StorefrontIcon,
  collections: CollectionsIcon,
  wallet: WalletIcon,
  contract: GavelIcon,
  "user-contract-form": DynamicFormIcon,
  markdown: TextSnippetIcon,
  "code-page-section": CodeIcon,
  collection: CollectionsIcon,
  "dex-generator-section": GavelIcon,
  "asset-section": Token,
  ranking: LeaderboardIcon,
  carousel: ViewCarousel,
  showcase: CollectionsIcon,
};
