import { useMemo } from 'react';

// The editor core
import { useIsMobile } from '@dexkit/core';
import Editor, { Value } from '@react-page/editor';

// import the main css, uncomment this: (this is commented in the example because of https://github.com/vercel/next.js/issues/19717)
import '@react-page/editor/lib/index.css';

// The rich text area plugin
// Stylesheets for the rich text area plugin
import '@react-page/plugins-slate/lib/index.css';

// Stylesheets for the imagea plugin
import '@react-page/plugins-image/lib/index.css';
//
import background, { ModeEnum } from '@react-page/plugins-background';

import '@react-page/plugins-background/lib/index.css';

import divider from '@react-page/plugins-divider';

// The html5-video plugin
import html5video from '@react-page/plugins-html5-video';
import '@react-page/plugins-html5-video/lib/index.css';

// The video plugin
import video from '@react-page/plugins-video';
import '@react-page/plugins-video/lib/index.css';

import '@react-page/plugins-spacer/lib/index.css';
import ExtendedSpacer from './plugins/ExtendedSpacerPlugin';

import { Box, Stack, Theme } from '@mui/material';
import { BuilderKit } from '../../constants';
import AssetAltPlugin from './plugins/AssetAltPlugin';
import AssetListPlugin from './plugins/AssetListPlugin';
import AssetPlugin from './plugins/AssetPlugin';
import ButtonPlugin from './plugins/ButtonPlugin';
import CodeSnippet from './plugins/CodeSnippet';
import CollectionPlugin from './plugins/CollectionPlugin';
import CollectionsPlugin from './plugins/CollectionsPlugin';
import ContainerPlugin from './plugins/ContainerPlugin';
import ContractFormPlugin from './plugins/ContractFormPlugin';
import CustomContentPluginTwitter from './plugins/CustomContentPluginTwitter';
import { DefaultSlate } from './plugins/DefaultSlate';
import DexGeneratorFormPlugin from './plugins/DexGeneratorFormPlugin';
import ExchangePlugin from './plugins/ExchangePlugin';
import ImagePlugin from './plugins/ImagePlugin';
import QrCodeReceive from './plugins/QrCodeReceivePayment';
import SearchNFTPlugin from './plugins/SearchNFTPlugin';
import StackPlugin from './plugins/StackPlugin';
import Swap2Plugin from './plugins/Swap2Plugin';
import TokenTradePlugin from './plugins/TokenTradePlugin';
import UserContractFormPlugin from './plugins/UserContractFormPlugin';
import WidgetPlugin from './plugins/WidgetPlugin';

import CustomPageEditorToolbar from './CustomPageEditorToolbar';
import CarouselPlugin from './plugins/CarouselPlugin';
import ShowCasePlugin from './plugins/ShowCasePlugin';

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

interface Props {
  readOnly?: boolean;
  value?: string | undefined | null;
  onChange?: (value: string | null) => void;
  theme?: Theme;
  builderKit?: BuilderKit;
}

export default function PageEditor(props: Props) {
  const { readOnly, onChange, value, theme, builderKit } = props;
  const isMobile = useIsMobile();

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
    <Stack sx={{ width: '100%', height: '100%' }}>
      <Box
        sx={{
          overflow: 'auto',
          pb: isMobile ? 12 : 8,
          height: '100%',
          '& .react-page-cell-insert-new': {
            zIndex: '1100 !important'
          },
          '& .react-page-cell-insert-new button': {
            width: isMobile ? '36px !important' : 'auto',
            height: isMobile ? '36px !important' : 'auto',
            minWidth: isMobile ? '36px !important' : 'auto',
            padding: isMobile ? '4px !important' : 'auto',
          }
        }}
      >
        <Editor
          components={{
            BottomToolbar: CustomPageEditorToolbar,
          }}
          cellPlugins={plugins}
          value={JSON.parse(value || 'null')}
          onChange={onChangeValue}
          readOnly={readOnly}
          uiTheme={theme as any}
        />
      </Box>
    </Stack>
  );
}
