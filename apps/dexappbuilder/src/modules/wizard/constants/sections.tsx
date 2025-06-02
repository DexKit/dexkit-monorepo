import { SectionType } from '@dexkit/ui/modules/wizard/types/section';
import ContentCopyOutlined from '@mui/icons-material/ContentCopyOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import DesktopAccessDisabledIcon from '@mui/icons-material/DesktopAccessDisabled';
import DesktopWindows from '@mui/icons-material/DesktopWindowsOutlined';
import MobileOffOutlined from '@mui/icons-material/MobileOffOutlined';
import SmartphoneOutlined from '@mui/icons-material/SmartphoneOutlined';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityIcon from '@mui/icons-material/VisibilityOutlined';

import TokenIcon from '@mui/icons-material/Token';

import AppsIcon from '@mui/icons-material/Apps';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import CallToAction from '@mui/icons-material/CallToAction';
import Code from '@mui/icons-material/Code';
import CollectionsIcon from '@mui/icons-material/Collections';
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import GavelIcon from '@mui/icons-material/Gavel';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import StoreIcon from '@mui/icons-material/Store';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import VideocamIcon from '@mui/icons-material/Videocam';
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';
import Wallet from '@mui/icons-material/Wallet';
import React from 'react';

export const SECTION_MENU_OPTIONS = ({
  hideMobile,
  isVisible,
  hideDesktop,
}: {
  hideMobile?: boolean;
  isVisible?: boolean;
  hideDesktop?: boolean;
}) => {
  return [
    {
      title: {
        id: isVisible ? 'hide.preview' : 'preview.section',
        defaultMessage: isVisible ? 'Hide preview' : 'Preview section',
      },
      icon: isVisible ? <VisibilityOffIcon /> : <VisibilityIcon />,
      value: isVisible ? 'hide.section' : 'show.section',
    },
    {
      title: {
        id: 'clone.section',
        defaultMessage: 'Clone section',
      },
      icon: <ContentCopyOutlined />,
      value: 'clone',
    },
    {
      title: {
        id: 'hide.on.mobile',
        defaultMessage: 'Hide on mobile',
      },
      icon: hideMobile ? <MobileOffOutlined /> : <SmartphoneOutlined />,
      value: 'hide.mobile',
    },
    {
      title: {
        id: 'hide.on.desktop',
        defaultMessage: 'Hide on desktop',
      },
      icon: hideDesktop ? <DesktopAccessDisabledIcon /> : <DesktopWindows />,
      value: 'hide.desktop',
    },
    {
      title: {
        id: 'delete',
        defaultMessage: 'Delete',
      },
      icon: <DeleteIcon color={'error'} />,
      value: 'remove',
    },
  ];
};

export const SECTION_CONFIG: {
  [key in SectionType]: {
    title: { id: string; defaultMessage: string } | undefined;
    icon: React.ReactNode | undefined;
  };
} = {
  video: {
    title: { id: 'video', defaultMessage: 'Video' },
    icon: <VideocamIcon />,
  },
  'call-to-action': {
    title: { id: 'call.to.action', defaultMessage: 'Call to Action' },
    icon: <CallToAction />,
  },
  featured: {
    title: { id: 'featured', defaultMessage: 'Featured' },
    icon: <BookmarkIcon />,
  },
  collections: {
    title: { id: 'collection', defaultMessage: 'Collection' },
    icon: <AppsIcon />,
  },
  swap: {
    title: { id: 'swap', defaultMessage: 'Swap' },
    icon: <SwapHorizIcon />,
  },
  'asset-store': {
    title: { id: 'nft.store.new', defaultMessage: 'NFT Store' },
    icon: <StoreIcon />,
  },
  custom: {
    title: { id: 'custom', defaultMessage: 'Custom' },
    icon: <AutoAwesomeIcon />,
  },
  markdown: {
    title: { id: 'markdown', defaultMessage: 'Markdown' },
    icon: <FormatColorTextIcon />,
  },
  wallet: {
    title: { id: 'wallet', defaultMessage: 'Wallet' },
    icon: <Wallet />,
  },
  contract: {
    title: { id: 'contract', defaultMessage: 'Contract' },
    icon: <GavelIcon />,
  },
  'user-contract-form': {
    title: {
      id: 'list.user.contract.form',
      defaultMessage: 'User Contract Form',
    },
    icon: <GavelIcon />,
  },
  exchange: {
    title: { id: 'exchange', defaultMessage: 'Exchange' },
    icon: <ShowChartIcon />,
  },
  'code-page-section': {
    title: { id: 'code', defaultMessage: 'Code' },
    icon: <Code />,
  },
  collection: {
    title: { id: 'collection.list', defaultMessage: 'Collection List' },
    icon: <AppsIcon />,
  },
  'dex-generator-section': {
    title: { id: 'dex.generator.new', defaultMessage: 'DexGenerator' },
    icon: <GavelIcon />,
  },
  'asset-section': {
    title: { id: 'asset', defaultMessage: 'Asset' },
    icon: <AppsIcon />,
  },
  ranking: {
    title: { id: 'leaderboard', defaultMessage: 'Leaderboard' },
    icon: <LeaderboardIcon />,
  },
  'token-trade': {
    title: { id: 'token.trade', defaultMessage: 'Token Trade' },
    icon: <TokenIcon />,
  },
  carousel: {
    title: { id: 'carousel', defaultMessage: 'Carousel' },
    icon: <ViewCarouselIcon />,
  },
  showcase: {
    title: { id: 'showcase', defaultMessage: 'Showcase Gallery' },
    icon: <CollectionsIcon />,
  },
  'edition-drop-section': {
    title: undefined,
    icon: undefined,
  },
  'edition-drop-list-section': {
    title: undefined,
    icon: undefined,
  },
  'token-drop': {
    title: undefined,
    icon: undefined,
  },
  'nft-drop': {
    title: undefined,
    icon: undefined,
  },
  'token-stake': {
    title: undefined,
    icon: undefined,
  },
  'nft-stake': {
    title: undefined,
    icon: undefined,
  },
  'edition-stake': {
    title: undefined,
    icon: undefined,
  },
  token: {
    title: undefined,
    icon: undefined,
  },
  'airdrop-token': {
    title: undefined,
    icon: undefined,
  },
  'market-trade': {
    title: undefined,
    icon: undefined,
  },
  'claim-airdrop-token-erc-20': {
    title: undefined,
    icon: undefined,
  },
  plugin: {
    title: undefined,
    icon: undefined,
  },
};
