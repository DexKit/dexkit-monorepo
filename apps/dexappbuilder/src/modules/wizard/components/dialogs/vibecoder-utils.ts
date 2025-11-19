import { ChainId } from '@dexkit/core/constants/enums';
import { AppConfig } from '@dexkit/ui/modules/wizard/types/config';
import { AppPageSection } from '@dexkit/ui/modules/wizard/types/section';
import { getTheme } from '../../../../theme';

export enum AppType {
  SWAP = 'swap',
  EXCHANGE = 'exchange',
  WALLET = 'wallet',
  NFT_STORE = 'nft-store',
  NFT_COLLECTION = 'nft-collection',
  COMMERCE = 'commerce',
  REFERRAL = 'referral',
  LEADERBOARD = 'leaderboard',
  TOKEN_TRADE = 'token-trade',
  GATED_CONTENT = 'gated-content',
  GENERAL = 'general',
}

export enum VibecoderIntent {
  GENERATE_SECTIONS = 'generate-sections',
  GENERATE_LOGO = 'generate-logo',
  GENERATE_SEO = 'generate-seo',
}

export interface AppTypeRequirements {
  requiredSections: string[];
  optionalSections?: string[];
  requiresGatedContent?: boolean;
  description: string;
}

export const APP_TYPE_REQUIREMENTS: Record<AppType, AppTypeRequirements> = {
  [AppType.SWAP]: {
    requiredSections: ['swap'],
    optionalSections: ['call-to-action', 'markdown', 'video'],
    description: 'A cryptocurrency swap application using the 0x protocol',
  },
  [AppType.EXCHANGE]: {
    requiredSections: ['exchange'],
    optionalSections: ['call-to-action', 'markdown', 'video'],
    description: 'A decentralized exchange with limit orders using 0x',
  },
  [AppType.WALLET]: {
    requiredSections: ['wallet'],
    optionalSections: ['call-to-action', 'markdown', 'video'],
    description: 'A digital wallet to securely store and manage cryptocurrencies',
  },
  [AppType.NFT_STORE]: {
    requiredSections: ['asset-store'],
    optionalSections: ['collections', 'featured', 'call-to-action', 'markdown'],
    description: 'A Shopify-style NFT store for selling NFTs',
  },
  [AppType.NFT_COLLECTION]: {
    requiredSections: ['collections', 'collection'],
    optionalSections: ['featured', 'asset-section', 'call-to-action'],
    description: 'An NFT collection showcase and gallery',
  },
  [AppType.COMMERCE]: {
    requiredSections: ['commerce'],
    optionalSections: ['call-to-action', 'markdown', 'carousel'],
    description: 'E-commerce functionality with crypto payments',
  },
  [AppType.REFERRAL]: {
    requiredSections: ['referral'],
    optionalSections: ['call-to-action', 'markdown'],
    description: 'A referral program for users to share links and track statistics',
  },
  [AppType.LEADERBOARD]: {
    requiredSections: ['ranking'],
    optionalSections: ['call-to-action', 'markdown'],
    description: 'Leaderboards from web3 user events',
  },
  [AppType.TOKEN_TRADE]: {
    requiredSections: ['token-trade'],
    optionalSections: ['call-to-action', 'markdown'],
    description: 'Token trading and display actions',
  },
  [AppType.GATED_CONTENT]: {
    requiredSections: [],
    optionalSections: ['call-to-action', 'markdown', 'video'],
    requiresGatedContent: true,
    description: 'Protected content with gated conditions (requires tokens/NFTs)',
  },
  [AppType.GENERAL]: {
    requiredSections: [],
    optionalSections: [
      'call-to-action',
      'markdown',
      'video',
      'carousel',
      'showcase',
      'card',
      'accordion',
      'stepper',
      'tabs',
    ],
    description: 'General purpose page with various components',
  },
};

const NETWORK_NAME_TO_CHAIN_ID: Record<string, number> = {
  ethereum: ChainId.Ethereum,
  eth: ChainId.Ethereum,
  polygon: ChainId.Polygon,
  matic: ChainId.Polygon,
  bsc: ChainId.BSC,
  'binance smart chain': ChainId.BSC,
  'binance': ChainId.BSC,
  avalanche: ChainId.Avax,
  avax: ChainId.Avax,
  optimism: ChainId.Optimism,
  base: ChainId.Base,
  arbitrum: ChainId.Arbitrum,
  celo: ChainId.Celo,
  cronos: ChainId.Cronos,
  blast: ChainId.Blast,
  linea: ChainId.Linea,
  scroll: ChainId.Scroll,
  mantle: ChainId.Mantle,
  mode: ChainId.Mode,
  pulse: ChainId.Pulse,
};

const COMMON_TOKENS = [
  'BTC', 'ETH', 'USDT', 'USDC', 'DAI', 'MATIC', 'BNB', 'AVAX', 'OP', 'ARB',
  'BASE', 'CELO', 'CRONOS', 'BLAST', 'LINEA', 'SCROLL', 'MANTLE', 'MODE',
  'WETH', 'WBTC', 'UNI', 'LINK', 'AAVE', 'COMP', 'MKR', 'SNX', 'SUSHI',
];

export function extractTokensFromPrompt(prompt: string): string[] {
  const upperPrompt = prompt.toUpperCase();
  const tokens: string[] = [];

  COMMON_TOKENS.forEach((token) => {
    const regex = new RegExp(`\\b${token}\\b`, 'i');
    if (regex.test(prompt)) {
      tokens.push(token);
    }
  });

  const tokenPattern = /\b([A-Z]{2,10})\s+(?:token|coin)\b|\b(?:token|coin)\s+([A-Z]{2,10})\b/gi;
  const matches = prompt.matchAll(tokenPattern);
  for (const match of matches) {
    const token = match[1] || match[2];
    if (token && !tokens.includes(token.toUpperCase())) {
      tokens.push(token.toUpperCase());
    }
  }

  return [...new Set(tokens)];
}

export function extractNetworkFromPrompt(prompt: string): number | null {
  const lowerPrompt = prompt.toLowerCase();

  for (const [networkName, chainId] of Object.entries(NETWORK_NAME_TO_CHAIN_ID)) {
    if (lowerPrompt.includes(networkName)) {
      return chainId;
    }
  }

  return null;
}

function rgbToHex(rgb: string): string | null {
  try {
    const match = rgb.match(/\d+/g);
    if (match && match.length >= 3) {
      const r = parseInt(match[0], 10);
      const g = parseInt(match[1], 10);
      const b = parseInt(match[2], 10);
      return `#${[r, g, b].map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? `0${hex}` : hex;
      }).join('').toUpperCase()}`;
    }
  } catch (e) {
  }
  return null;
}

export function extractColorsFromPrompt(prompt: string): string[] {
  const colors: string[] = [];

  const hexPattern = /#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})(?![0-9A-Fa-f])/g;
  const hexMatches = prompt.matchAll(hexPattern);
  for (const match of hexMatches) {
    let hex = match[0];
    if (hex.length === 4) {
      hex = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
    }
    const normalizedHex = hex.toUpperCase();
    if (!colors.includes(normalizedHex)) {
      colors.push(normalizedHex);
    }
  }

  const rgbPattern = /rgba?\([^)]+\)/gi;
  const rgbMatches = prompt.matchAll(rgbPattern);
  for (const match of rgbMatches) {
    const hex = rgbToHex(match[0]);
    if (hex && !colors.includes(hex)) {
      colors.push(hex);
    }
  }

  return [...new Set(colors)];
}

export function getThemeInfo(appConfig?: AppConfig): {
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  themeName?: string;
} {
  if (!appConfig) {
    return {};
  }

  const themeInfo: {
    primaryColor?: string;
    secondaryColor?: string;
    backgroundColor?: string;
    textColor?: string;
    themeName?: string;
  } = {
    themeName: appConfig.theme,
  };

  try {
    if (appConfig.theme === 'custom') {
      const customTheme = appConfig.customTheme
        ? JSON.parse(appConfig.customTheme)
        : appConfig.customThemeDark
          ? JSON.parse(appConfig.customThemeDark)
          : appConfig.customThemeLight
            ? JSON.parse(appConfig.customThemeLight)
            : null;

      if (customTheme?.palette) {
        themeInfo.primaryColor = customTheme.palette.primary?.main;
        themeInfo.secondaryColor = customTheme.palette.secondary?.main;
        themeInfo.backgroundColor = customTheme.palette.background?.default;
        themeInfo.textColor = customTheme.palette.text?.primary;
      }
    } else if (appConfig.theme) {
      try {
        const theme = getTheme({ name: appConfig.theme });
        if (theme?.theme?.palette) {
          themeInfo.primaryColor = theme.theme.palette.primary?.main;
          themeInfo.secondaryColor = theme.theme.palette.secondary?.main;
          themeInfo.backgroundColor = theme.theme.palette.background?.default;
          themeInfo.textColor = theme.theme.palette.text?.primary;
        }
      } catch (e) {
      }
    }
  } catch (e) {
  }

  return themeInfo;
}

export function detectVibecoderIntent(prompt: string): VibecoderIntent {
  const lowerPrompt = prompt.toLowerCase();

  if (
    /\b(logo|logos|generate.*logo|create.*logo|make.*logo|design.*logo|logo.*for|logo.*app)\b/.test(
      lowerPrompt,
    )
  ) {
    return VibecoderIntent.GENERATE_LOGO;
  }

  if (
    /\b(seo|meta|description|title|search.*engine|optimize.*search|generate.*seo|create.*seo|seo.*for|seo.*page)\b/.test(
      lowerPrompt,
    )
  ) {
    return VibecoderIntent.GENERATE_SEO;
  }

  return VibecoderIntent.GENERATE_SECTIONS;
}

export function detectAppType(prompt: string): AppType {
  const lowerPrompt = prompt.toLowerCase();

  if (
    /\bswap\b|\bswapping\b|\bswap app\b|\bswap tool\b|\bswap interface\b|\bcreate.*swap\b|\bswap.*app\b/.test(
      lowerPrompt,
    )
  ) {
    return AppType.SWAP;
  }

  if (
    /\bexchange\b|\bdex\b|\bdecentralized exchange\b|\blimit order\b|\border book\b|\bcreate.*exchange\b|\bexchange.*app\b/.test(
      lowerPrompt,
    )
  ) {
    return AppType.EXCHANGE;
  }

  if (
    /\bwallet\b|\bcrypto wallet\b|\bdigital wallet\b|\bwallet app\b|\bcreate.*wallet\b/.test(
      lowerPrompt,
    )
  ) {
    return AppType.WALLET;
  }

  if (
    /\bnft store\b|\bnft marketplace\b|\bsell nft\b|\bnft shop\b|\bmarketplace\b|\bcreate.*nft.*store\b|\bcreate.*marketplace\b/.test(
      lowerPrompt,
    )
  ) {
    return AppType.NFT_STORE;
  }

  if (
    /\bnft collection\b|\bcollection\b|\bgallery\b|\bshowcase\b|\bdisplay nft\b|\bcreate.*collection\b/.test(
      lowerPrompt,
    ) && !/\bstore\b|\bmarketplace\b|\bsell\b/.test(lowerPrompt)
  ) {
    return AppType.NFT_COLLECTION;
  }

  if (
    /\bcommerce\b|\be-commerce\b|\bshop\b|\bstore\b|\bsell\b|\bproduct\b|\bcreate.*shop\b/.test(
      lowerPrompt,
    ) && !/\bnft\b/.test(lowerPrompt)
  ) {
    return AppType.COMMERCE;
  }

  if (
    /\breferral\b|\brefer\b|\breferral program\b|\breferral link\b/.test(
      lowerPrompt,
    )
  ) {
    return AppType.REFERRAL;
  }

  if (
    /\bleaderboard\b|\branking\b|\brank\b|\btop users\b|\bcompetition\b/.test(
      lowerPrompt,
    )
  ) {
    return AppType.LEADERBOARD;
  }

  if (
    /\btoken trade\b|\btrade token\b|\btoken swap\b|\btoken exchange\b/.test(
      lowerPrompt,
    )
  ) {
    return AppType.TOKEN_TRADE;
  }

  if (
    /\bgated\b|\bprotected\b|\brequire\b|\baccess\b|\bhold\b|\bown\b|\bcondition\b|\bexclusive\b|\bmembers only\b/.test(
      lowerPrompt,
    )
  ) {
    return AppType.GATED_CONTENT;
  }

  return AppType.GENERAL;
}

export function buildEnhancedPrompt(
  userPrompt: string,
  appType: AppType,
  appConfig?: AppConfig,
): string {
  const requirements = APP_TYPE_REQUIREMENTS[appType];
  const requiredSectionsList = requirements.requiredSections.join(', ');
  const optionalSectionsList = requirements.optionalSections?.join(', ') || '';
  const tokens = extractTokensFromPrompt(userPrompt);
  const networkChainId = extractNetworkFromPrompt(userPrompt);
  const themeInfo = getThemeInfo(appConfig);
  const detectedColors = extractColorsFromPrompt(userPrompt);

  let enhancedPrompt = `You are an expert in DexAppBuilder, a no-code Web3 CMS platform. The user wants to create: ${userPrompt}\n\n`;

  enhancedPrompt += `Based on the request, this appears to be a ${appType} application.\n\n`;

  if (tokens.length > 0) {
    enhancedPrompt += `DETECTED TOKENS:\n`;
    tokens.forEach((token) => {
      enhancedPrompt += `- ${token}\n`;
    });
    enhancedPrompt += `\nIMPORTANT: When configuring swap/exchange sections, use these tokens as default input/output tokens if specified by the user.\n\n`;
  }

  if (networkChainId) {
    const networkNames: Record<number, string> = {
      [ChainId.Ethereum]: 'Ethereum',
      [ChainId.Polygon]: 'Polygon',
      [ChainId.BSC]: 'Binance Smart Chain',
      [ChainId.Avax]: 'Avalanche',
      [ChainId.Optimism]: 'Optimism',
      [ChainId.Base]: 'Base',
      [ChainId.Arbitrum]: 'Arbitrum',
      [ChainId.Celo]: 'Celo',
      [ChainId.Cronos]: 'Cronos',
      [ChainId.Blast]: 'Blast',
      [ChainId.Linea]: 'Linea',
      [ChainId.Scroll]: 'Scroll',
      [ChainId.Mantle]: 'Mantle',
      [ChainId.Mode]: 'Mode',
      [ChainId.Pulse]: 'Pulse',
    };
    enhancedPrompt += `DETECTED NETWORK:\n`;
    enhancedPrompt += `- Network: ${networkNames[networkChainId] || 'Unknown'} (ChainId: ${networkChainId})\n`;
    enhancedPrompt += `\nIMPORTANT: When configuring swap/exchange/wallet sections, set defaultChainId to ${networkChainId}.\n\n`;
  }

  if (detectedColors.length > 0) {
    enhancedPrompt += `DETECTED COLORS FROM PROMPT (hexadecimal/RGB codes):\n`;
    detectedColors.forEach((color) => {
      enhancedPrompt += `- ${color}\n`;
    });
    enhancedPrompt += `\nIMPORTANT: These colors have HIGHEST PRIORITY. Use these exact colors when configuring swap/exchange glassSettings backgroundColor and other color properties.\n\n`;
  }

  enhancedPrompt += `COLOR DETECTION INSTRUCTIONS:\n`;
  enhancedPrompt += `- The user may mention colors by name in any language (e.g., "red", "roja", "rouge", "vermelho", etc.).\n`;
  enhancedPrompt += `- You MUST detect any color mentioned in the user's prompt and convert it to a hexadecimal code (e.g., #FF0000 for red).\n`;
  enhancedPrompt += `- When you generate sections, include a "detectedColors" array in your response with all colors you detected from the prompt, converted to hexadecimal format.\n`;
  enhancedPrompt += `- Use these detected colors (from prompt or from your detection) with HIGHEST PRIORITY when configuring glassSettings.backgroundColor and other color properties.\n`;
  enhancedPrompt += `- If no colors are explicitly mentioned, use the theme colors provided below as fallback.\n\n`;

  if (themeInfo.themeName || themeInfo.primaryColor) {
    enhancedPrompt += `THEME CONFIGURATION:\n`;
    if (themeInfo.themeName) {
      enhancedPrompt += `- Theme: ${themeInfo.themeName}\n`;
    }
    if (themeInfo.primaryColor) {
      enhancedPrompt += `- Primary Color: ${themeInfo.primaryColor}\n`;
    }
    if (themeInfo.secondaryColor) {
      enhancedPrompt += `- Secondary Color: ${themeInfo.secondaryColor}\n`;
    }
    if (themeInfo.backgroundColor) {
      enhancedPrompt += `- Background Color: ${themeInfo.backgroundColor}\n`;
    }
    if (themeInfo.textColor) {
      enhancedPrompt += `- Text Color: ${themeInfo.textColor}\n`;
    }
    enhancedPrompt += `\nIMPORTANT: When configuring sections with color settings (like swap glassSettings), use detected colors from prompt first, then fallback to these theme colors.\n\n`;
  }

  if (requirements.requiredSections.length > 0) {
    enhancedPrompt += `REQUIRED SECTIONS (must include):\n`;
    requirements.requiredSections.forEach((section) => {
      enhancedPrompt += `- ${section}: This section is MANDATORY and must be included in the generated sections.\n`;
    });
    enhancedPrompt += `\n`;
  }

  if (requirements.optionalSections && requirements.optionalSections.length > 0) {
    enhancedPrompt += `OPTIONAL SECTIONS (can include if relevant):\n`;
    requirements.optionalSections.forEach((section) => {
      enhancedPrompt += `- ${section}\n`;
    });
    enhancedPrompt += `\n`;
  }

  if (requirements.requiresGatedContent) {
    enhancedPrompt += `IMPORTANT: This page requires GATED CONTENT functionality. The page must have gatedConditions enabled.\n\n`;
  }

  enhancedPrompt += `AVAILABLE SECTION TYPES in DexAppBuilder:\n`;
  enhancedPrompt += `- swap: Cryptocurrency swap tool using 0x protocol\n`;
  enhancedPrompt += `- exchange: Decentralized exchange with limit orders\n`;
  enhancedPrompt += `- wallet: Digital wallet for managing cryptocurrencies\n`;
  enhancedPrompt += `- asset-store: NFT store/marketplace for selling NFTs\n`;
  enhancedPrompt += `- collections: List of NFT collections\n`;
  enhancedPrompt += `- collection: Single NFT collection display\n`;
  enhancedPrompt += `- commerce: E-commerce functionality\n`;
  enhancedPrompt += `- referral: Referral program section\n`;
  enhancedPrompt += `- ranking: Leaderboard from web3 events\n`;
  enhancedPrompt += `- token-trade: Token trading interface\n`;
  enhancedPrompt += `- call-to-action: CTA buttons and prompts\n`;
  enhancedPrompt += `- markdown: Text content with markdown formatting\n`;
  enhancedPrompt += `- video: Video display section\n`;
  enhancedPrompt += `- carousel: Image/content carousel\n`;
  enhancedPrompt += `- showcase: Showcase gallery\n`;
  enhancedPrompt += `- featured: Featured NFTs section\n`;
  enhancedPrompt += `- card: Card component grid\n`;
  enhancedPrompt += `- accordion: Expandable accordion sections\n`;
  enhancedPrompt += `- stepper: Step-by-step navigation\n`;
  enhancedPrompt += `- tabs: Tabbed content organization\n`;
  enhancedPrompt += `- contract: Smart contract interaction form\n`;
  enhancedPrompt += `- user-contract-form: Custom contract form\n`;
  enhancedPrompt += `- dex-generator-section: DexContracts generator\n`;
  enhancedPrompt += `- asset-section: Single NFT asset display\n`;
  enhancedPrompt += `- code-page-section: Custom code section\n`;
  enhancedPrompt += `- widget: Embeddable widget\n\n`;

  enhancedPrompt += `OUTPUT FORMAT:\n`;
  enhancedPrompt += `Return a JSON object with the following structure:\n`;
  enhancedPrompt += `{\n`;
  enhancedPrompt += `  "sections": [\n`;
  enhancedPrompt += `    {\n`;
  enhancedPrompt += `      "type": "swap",\n`;
  enhancedPrompt += `      "title": "Swap Section",\n`;
  enhancedPrompt += `      "name": "Swap",\n`;
  enhancedPrompt += `      "config": { ... } // section-specific configuration\n`;
  enhancedPrompt += `    }\n`;
  enhancedPrompt += `  ],\n`;
  enhancedPrompt += `  "detectedColors": ["#FF0000", "#00FF00"] // Array of hexadecimal color codes you detected from the user's prompt\n`;
  enhancedPrompt += `}\n\n`;
  enhancedPrompt += `Each section must have:\n`;
  enhancedPrompt += `- type: string (one of the section types listed above)\n`;
  enhancedPrompt += `- title: string (descriptive title for the section)\n`;
  enhancedPrompt += `- name: string (optional, custom name for the section)\n`;
  enhancedPrompt += `- config/settings: object (section-specific configuration, including glassSettings with colors)\n\n`;

  enhancedPrompt += `CRITICAL RULES:\n`;
  if (requirements.requiredSections.length > 0) {
    enhancedPrompt += `1. You MUST include at least one section of type "${requirements.requiredSections[0]}" in your response.\n`;
    enhancedPrompt += `2. If the user asks for a "${appType}" app, the "${requirements.requiredSections[0]}" section is REQUIRED.\n`;
  }
  enhancedPrompt += `3. Only use section types that exist in DexAppBuilder (listed above).\n`;
  enhancedPrompt += `4. Generate 2-5 sections that make sense for the user's request.\n`;
  enhancedPrompt += `5. Include supporting sections like call-to-action, markdown, or video if they enhance the user experience.\n`;
  enhancedPrompt += `6. Do NOT create sections that don't exist in DexAppBuilder.\n\n`;

  enhancedPrompt += `Now generate the sections based on the user's request: "${userPrompt}"\n`;
  enhancedPrompt += `Remember: ${requirements.description}\n`;

  return enhancedPrompt;
}

export function validateGeneratedSections(
  sections: AppPageSection[],
  appType: AppType,
): { valid: boolean; errors: string[] } {
  const requirements = APP_TYPE_REQUIREMENTS[appType];
  const errors: string[] = [];

  if (requirements.requiredSections.length > 0) {
    const hasRequiredSection = requirements.requiredSections.some(
      (requiredType) =>
        sections.some((section) => section.type === requiredType),
    );

    if (!hasRequiredSection) {
      errors.push(
        `Missing required section type: ${requirements.requiredSections.join(' or ')}`,
      );
    }
  }

  const validSectionTypes = [
    'swap',
    'exchange',
    'wallet',
    'asset-store',
    'collections',
    'collection',
    'commerce',
    'referral',
    'ranking',
    'token-trade',
    'call-to-action',
    'markdown',
    'video',
    'carousel',
    'showcase',
    'featured',
    'card',
    'accordion',
    'stepper',
    'tabs',
    'contract',
    'user-contract-form',
    'dex-generator-section',
    'asset-section',
    'code-page-section',
    'widget',
    'custom',
  ];

  sections.forEach((section, index) => {
    if (!validSectionTypes.includes(section.type)) {
      errors.push(
        `Section ${index + 1} has invalid type: ${section.type}`,
      );
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

