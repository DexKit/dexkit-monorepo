import { SectionMetadata } from '@dexkit/ui/modules/wizard/types/section';
import CallToActionIcon from '@mui/icons-material/CallToAction';
import CodeIcon from '@mui/icons-material/Code';
import CollectionsIcon from '@mui/icons-material/Collections';
import DynamicFormIcon from '@mui/icons-material/DynamicForm';
import FeaturedVideoIcon from '@mui/icons-material/FeaturedVideo';
import GavelIcon from '@mui/icons-material/Gavel';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import StorefrontIcon from '@mui/icons-material/Storefront';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import {
  default as Token,
  default as TokenIcon,
} from '@mui/icons-material/Token';
import VideocamIcon from '@mui/icons-material/Videocam';
import ViewCarousel from '@mui/icons-material/ViewCarousel';
import WalletIcon from '@mui/icons-material/Wallet';
import { SvgIconTypeMap } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';

export const SECTION_TYPES_DATA = [
  {
    type: 'video',
    titleId: 'video',
    titleDefaultMessage: 'Video',
    category: 'resources',
    description: 'Display engaging videos to captivate your audience.',
    icon: <VideocamIcon fontSize="large" />,
  },
  {
    type: 'token-trade',
    titleId: 'token.trade',
    titleDefaultMessage: 'Token trade',
    category: 'cryptocurrency',
    description: 'Easiest way to trade and display actions for your token .',
    icon: <TokenIcon fontSize="large" />,
  },
  {
    type: 'call-to-action',
    titleId: 'call.to.action',
    titleDefaultMessage: 'Call to action',
    category: 'resources',
    description:
      'Encourage specific user actions with effective calls to action.',
    icon: <CallToActionIcon fontSize="large" />,
  },
  {
    type: 'featured',
    titleId: 'featured',
    titleDefaultMessage: 'Featured NFTs',
    category: 'nft',
    description:
      'Highlight and promote your NFTs for enhanced visibility and user engagement.',
    icon: <FeaturedVideoIcon fontSize="large" />,
  },
  {
    type: 'swap',
    titleId: 'swap',
    titleDefaultMessage: 'Swap',
    category: 'cryptocurrency',
    description:
      'Build a cryptocurrency swap tool using the powerful 0x protocol.',
    icon: <SwapHorizIcon fontSize="large" />,
  },
  {
    type: 'exchange',
    titleId: 'exchange',
    titleDefaultMessage: 'Exchange',
    category: 'cryptocurrency',
    description: 'Limit order using 0x',
    icon: <ShowChartIcon fontSize="large" />,
  },
  {
    type: 'asset-store',
    titleId: 'nft.store',
    titleDefaultMessage: 'NFT store',
    category: 'nft',
    description: 'Create a Shopify-style NFT store for your unique collection.',
    icon: <StorefrontIcon fontSize="large" />,
  },
  {
    type: 'collections',
    titleId: 'collection',
    titleDefaultMessage: 'Collection',
    category: 'nft',
    description: 'Add new NFT collections to diversify your digital assets.',
    icon: <CollectionsIcon fontSize="large" />,
  },
  {
    type: 'wallet',
    titleId: 'wallet',
    titleDefaultMessage: 'Wallet',
    category: 'cryptocurrency',
    description:
      'Create a digital wallet to securely store and manage your cryptocurrencies.',
    icon: <WalletIcon fontSize="large" />,
  },
  {
    type: 'contract',
    titleId: 'contract',
    titleDefaultMessage: 'Contract form',
    category: 'web3',
    description:
      'Interact with blockchain contracts by importing them and using interactive forms.',
    icon: <GavelIcon fontSize="large" />,
  },
  {
    type: 'user-contract-form',
    titleId: 'user.contract.form',
    titleDefaultMessage: 'User Contract Form',
    category: 'web3',
    description:
      'Customize forms for your interactions with blockchain contracts.',
    icon: <DynamicFormIcon fontSize="large" />,
  },
  {
    type: 'markdown',
    titleId: 'markdown',
    titleDefaultMessage: 'Markdown',
    category: 'low-code',
    description:
      'Easily format text using markdown for a clean and structured appearance.',
    icon: <TextSnippetIcon fontSize="large" />,
  },
  {
    type: 'code-page-section',
    titleId: 'code',
    titleDefaultMessage: 'Code',
    category: 'low-code',
    description: 'Easily add code section to your pages',
    icon: <CodeIcon fontSize="large" />,
  },
  {
    type: 'collection',
    titleId: 'collection.list',
    titleDefaultMessage: 'Collection List',
    category: 'nft',
    description: 'Easily add a collection',
    icon: <CollectionsIcon fontSize="large" />,
  },
  {
    type: 'dex-generator-section',
    titleId: 'dex.app.builder.contract',
    titleDefaultMessage: 'DexGenerator Contract',
    category: 'web3',
    description: 'Create a DexGenerator section from your contracts',
    icon: <GavelIcon fontSize="large" />,
  },
  {
    type: 'asset-section',
    titleId: 'asset',
    titleDefaultMessage: 'Asset',
    category: 'nft',
    description: 'Easily add a nft to a page',
    icon: <Token fontSize="large" />,
  },
  {
    type: 'ranking',
    titleId: 'leaderboard',
    titleDefaultMessage: 'Leaderboard',
    category: 'web3',
    description: 'Create leaderboards from web3 user events on your app',
    icon: <LeaderboardIcon fontSize="large" />,
  },
  {
    type: 'carousel',
    titleId: 'carousel',
    titleDefaultMessage: 'Carousel',
    category: 'resources',
    description: 'Create a carousel section',
    icon: <ViewCarousel fontSize="large" />,
  },
  {
    type: 'showcase',
    titleId: 'showcase.gallery',
    titleDefaultMessage: 'Showcase Gallery',
    category: 'resources',
    description: 'Create a showcase section',
    icon: <CollectionsIcon fontSize="large" />,
  },
] as SectionMetadata[];

export const SECTIONS_TYPE_DATA_ICONS: {
  [key: string]: OverridableComponent<SvgIconTypeMap<{}, 'svg'>> & {
    muiName: string;
  };
} = {
  video: VideocamIcon,
  'token-trade': TokenIcon,
  'call-to-action': CallToActionIcon,
  featured: FeaturedVideoIcon,
  swap: SwapHorizIcon,
  exchange: ShowChartIcon,
  'asset-store': StorefrontIcon,
  collections: CollectionsIcon,
  wallet: WalletIcon,
  contract: GavelIcon,
  'user-contract-form': DynamicFormIcon,
  markdown: TextSnippetIcon,
  'code-page-section': CodeIcon,
  collection: CollectionsIcon,
  'dex-generator-section': GavelIcon,
  'asset-section': Token,
  ranking: LeaderboardIcon,
  carousel: ViewCarousel,
  showcase: CollectionsIcon,
};

export const SectionCategory = [
  {
    value: 'cryptocurrency',
    title: 'Cryptocurrency',
  },
  {
    value: 'nft',
    title: 'NFT',
  },
  {
    value: 'web3',
    title: 'Web3',
  },
  {
    value: 'resources',
    title: 'Resources',
  },
  {
    value: 'low-code',
    title: 'Low code',
  },
];
