import { memo, useMemo } from "react";

// The editor core
import Editor, {
  BottomToolbar,
  BottomToolbarProps,
  Value,
} from "@react-page/editor";

// import the main css, uncomment this: (this is commented in the example because of https://github.com/vercel/next.js/issues/19717)
import "@react-page/editor/lib/index.css";

// The rich text area plugin
// Stylesheets for the rich text area plugin
import "@react-page/plugins-slate/lib/index.css";

// Stylesheets for the imagea plugin
import "@react-page/plugins-image/lib/index.css";
//
import background, { ModeEnum } from "@react-page/plugins-background";

import "@react-page/plugins-background/lib/index.css";

import divider from "@react-page/plugins-divider";

// The html5-video plugin
import html5video from "@react-page/plugins-html5-video";
import "@react-page/plugins-html5-video/lib/index.css";

// The video plugin
import video from "@react-page/plugins-video";
import "@react-page/plugins-video/lib/index.css";

import "@react-page/plugins-spacer/lib/index.css";
import ExtendedSpacer from "./plugins/ExtendedSpacerPlugin";

import { Box, Theme, styled } from "@mui/material";
import { BuilderKit } from "../../constants";
import AssetAltPlugin from "./plugins/AssetAltPlugin";
import AssetListPlugin from "./plugins/AssetListPlugin";
import AssetPlugin from "./plugins/AssetPlugin";
import ButtonPlugin from "./plugins/ButtonPlugin";
import CodeSnippet from "./plugins/CodeSnippet";
import CollectionPlugin from "./plugins/CollectionPlugin";
import CollectionsPlugin from "./plugins/CollectionsPlugin";
import ContainerPlugin from "./plugins/ContainerPlugin";
import ContractFormPlugin from "./plugins/ContractFormPlugin";
import CustomContentPluginTwitter from "./plugins/CustomContentPluginTwitter";
import { DefaultSlate } from "./plugins/DefaultSlate";
import DexGeneratorFormPlugin from "./plugins/DexGeneratorFormPlugin";
import ExchangePlugin from "./plugins/ExchangePlugin";
import ImagePlugin from "./plugins/ImagePlugin";
import MediaPlugin from "./plugins/MediaPlugin";
import QrCodeReceive from "./plugins/QrCodeReceivePayment";
import SearchNFTPlugin from "./plugins/SearchNFTPlugin";
import StackPlugin from "./plugins/StackPlugin";
import Swap2Plugin from "./plugins/Swap2Plugin";
import TokenTradePlugin from "./plugins/TokenTradePlugin";
import UserContractFormPlugin from "./plugins/UserContractFormPlugin";
import WidgetPlugin from "./plugins/WidgetPlugin";

import CarouselPlugin from "./plugins/CarouselPlugin";
import ShowCasePlugin from "./plugins/ShowCasePlugin";

// Define which plugins we want to use.
const cellPlugins = [
  AssetAltPlugin,
  background({
    enabledModes:
      ModeEnum.COLOR_MODE_FLAG |
      ModeEnum.GRADIENT_MODE_FLAG |
      ModeEnum.IMAGE_MODE_FLAG,
  }),
  ButtonPlugin,
  CarouselPlugin,
  CodeSnippet,
  CollectionPlugin,
  CollectionsPlugin,
  ContainerPlugin,
  ContractFormPlugin,
  UserContractFormPlugin,

  DexGeneratorFormPlugin,
  divider,
  ExchangePlugin,
  html5video,
  ImagePlugin,
  MediaPlugin,
  AssetPlugin,
  AssetListPlugin,
  QrCodeReceive,
  ExtendedSpacer,
  SearchNFTPlugin,
  ShowCasePlugin,
  StackPlugin,
  //  CustomLayoutPlugin,
  // SwapPlugin,
  Swap2Plugin,

  DefaultSlate,
  TokenTradePlugin,
  CustomContentPluginTwitter,
  video,
  WidgetPlugin,
];

const nftPlugins = [
  background({
    enabledModes:
      ModeEnum.COLOR_MODE_FLAG |
      ModeEnum.GRADIENT_MODE_FLAG |
      ModeEnum.IMAGE_MODE_FLAG,
  }),
  ButtonPlugin,
  CarouselPlugin,
  CodeSnippet,
  CollectionPlugin,
  ContainerPlugin,
  ContractFormPlugin,
  UserContractFormPlugin,
  divider,
  html5video,
  ImagePlugin,
  MediaPlugin,
  AssetPlugin,
  AssetListPlugin,
  QrCodeReceive,
  ExtendedSpacer,
  StackPlugin,
  SearchNFTPlugin,
  ShowCasePlugin,
  DefaultSlate,
  CustomContentPluginTwitter,
  video,
  WidgetPlugin,
  //  ExchangePlugin,
];

const swapPlugins = [
  background({
    enabledModes:
      ModeEnum.COLOR_MODE_FLAG |
      ModeEnum.GRADIENT_MODE_FLAG |
      ModeEnum.IMAGE_MODE_FLAG,
  }),
  ButtonPlugin,
  CarouselPlugin,
  CodeSnippet,
  ContainerPlugin,
  ContractFormPlugin,
  UserContractFormPlugin,
  divider,
  html5video,
  ImagePlugin,
  MediaPlugin,
  QrCodeReceive,
  ExtendedSpacer,
  ShowCasePlugin,
  StackPlugin,
  TokenTradePlugin,
  //  CustomLayoutPlugin,
  // SwapPlugin,
  Swap2Plugin,
  DefaultSlate,
  CustomContentPluginTwitter,
  video,
  WidgetPlugin,
  // ExchangePlugin,
];

// https://github.com/react-page/react-page/issues/970
const BottomToolbarStyled = styled(BottomToolbar)({
  "&, & > *": {
    // Passed to MuiPaper
    zIndex: `1200 !important`,
  },
});

const CustomToolbar = memo<BottomToolbarProps>((props: any) => {
  return <BottomToolbarStyled {...props} />;
});

CustomToolbar.displayName = "CustomToolbar";

interface Props {
  readOnly?: boolean;
  value?: string | undefined | null;
  onChange?: (value: string | null) => void;
  theme?: Theme;
  builderKit?: BuilderKit;
}

export default function PageEditor(props: Props) {
  const { readOnly, onChange, value, theme, builderKit } = props;

  const onChangeValue = (val: Value | null) => {
    if (onChange) {
      if (val) {
        onChange(JSON.stringify(val));
      } else {
        onChange(null);
      }
    }
  };

  const plugins = useMemo(() => {
    if (builderKit === BuilderKit.NFT) {
      return nftPlugins;
    }
    if (builderKit === BuilderKit.Swap) {
      return swapPlugins;
    }
    return cellPlugins;
  }, [builderKit]);

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100%",
        overflowX: "hidden",
        "& .react-page-editable": {
          maxWidth: "100%",
          overflowX: "hidden",
        },
        "& .react-page-row": {
          width: "100%",
          maxWidth: "100%",
          flexWrap: "wrap",
        },
        // Mobile responsive styles
        "@media (max-width: 600px)": {
          "& .react-page-editable": {
            paddingLeft: "0 !important",
            paddingRight: "0 !important",
            width: "100% !important",
            maxWidth: "100% !important",
            overflowX: "hidden !important",
          },
          "& .react-page-row": {
            marginLeft: "0 !important",
            marginRight: "0 !important",
            width: "100% !important",
            maxWidth: "100% !important",
            flexWrap: "wrap !important",
          },
          "& .react-page-cell": {
            paddingLeft: "0 !important",
            paddingRight: "0 !important",
            flexBasis: "100% !important",
            width: "100% !important",
            minWidth: "100% !important",
            maxWidth: "100% !important",
            boxSizing: "border-box !important",
          },
          "& [class*='react-page-cell-xs-'], & [class*='react-page-cell-sm-'], & [class*='react-page-cell-md-'], & [class*='react-page-cell-lg-']": {
            flexBasis: "100% !important",
            width: "100% !important",
            minWidth: "100% !important",
            maxWidth: "100% !important",
          },
          "& .react-page-cell-inner": {
            width: "100% !important",
            maxWidth: "100% !important",
            boxSizing: "border-box !important",
            overflow: "hidden !important",
          },
          "& .react-page-cell-inner > *": {
            maxWidth: "100% !important",
            boxSizing: "border-box !important",
          },
          "& img, & video, & iframe, & canvas, & svg": {
            maxWidth: "100% !important",
            height: "auto !important",
          },
          "& table": {
            width: "100% !important",
            display: "block !important",
            overflowX: "auto !important",
          },
        },
      }}
    >
      <Editor
        components={{
          BottomToolbar: CustomToolbar,
        }}
        //@ts-ignore
        cellPlugins={plugins}
        value={JSON.parse(value || "null")}
        onChange={onChangeValue}
        readOnly={readOnly}
        //@ts-ignore
        uiTheme={theme}
      />
    </Box>
  );
}
