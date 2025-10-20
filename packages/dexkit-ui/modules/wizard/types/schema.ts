import { ThemeMode } from "@dexkit/ui/constants/enum";
import { z } from "zod";

const socialMediaSchema = z.object({
  type: z.enum([
    "instagram",
    "facebook",
    "twitter",
    "youtube",
    "linkedin",
    "pinterest",
    "reddit",
  ]),
  handle: z.string(),
});

const socialMediaCustomSchema = z.object({
  link: z.string(),
  iconUrl: z.string(),
  label: z.string(),
});

type MenuTreeSchema = z.ZodObject<{
  name: z.ZodString;
  type: z.ZodEnum<["Page", "Menu", "External"]>;
  href: z.ZodOptional<z.ZodString>;
  data: z.ZodOptional<z.ZodAny>;
  children: z.ZodOptional<z.ZodArray<z.ZodLazy<any>>>;
}>;

const menuTreeSchema: MenuTreeSchema = z.object({
  name: z.string(),
  type: z.enum(["Page", "Menu", "External"]),
  href: z.string().optional(),
  data: z.any().optional(),
  children: z.array(z.lazy((): MenuTreeSchema => menuTreeSchema)).optional(),
});

const logoSchema = z.object({
  width: z.number().optional(),
  height: z.number().optional(),
  widthMobile: z.number().optional(),
  heightMobile: z.number().optional(),
  url: z.string(),
});

const searchbarConfigSchema = z.object({
  enabled: z.boolean().optional(),
  hideCollections: z.boolean().optional(),
  hideTokens: z.boolean().optional(),
});

const formatSchema = z.object({
  date: z.string(),
  datetime: z.string(),
});

const menuSettingsSchema = z.object({
  layout: z
    .object({
      type: z.string().optional(),
      variant: z.string().optional(),
    })
    .optional(),
});

const feeSchema = z.object({
  amount_percentage: z.number(),
  recipient: z.string(),
});

const swapFeeSchema = z.object({
  recipient: z.string(),
  amount_percentage: z.number(),
});

const fontSchema = z.object({
  family: z.string(),
  category: z.string().optional(),
});

const seoImageSchema = z.object({
  url: z.string(),
  width: z.number().optional(),
  height: z.number().optional(),
  alt: z.string().optional(),
  type: z.string().optional(),
});

const pageSeoSchema = z.object({
  title: z.string(),
  description: z.string(),
  images: z.array(seoImageSchema),
});

const appCollectionSchema = z.object({
  image: z.string(),
  name: z.string(),
  backgroundImage: z.string(),
  chainId: z.number(),
  contractAddress: z.string(),
  description: z.string().optional(),
  uri: z.string().optional(),
  disableSecondarySells: z.boolean().optional(),
});

const appTokenSchema = z.object({
  name: z.string().optional(),
  logoURI: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  tags: z
    .record(
      z.object({
        name: z.string(),
        description: z.string(),
      })
    )
    .optional(),
  timestamp: z.string().optional(),
  tokens: z.array(
    z.object({
      address: z.string(),
      chainId: z.number(),
      decimals: z.number(),
      logoURI: z.string().optional(),
      name: z.string(),
      symbol: z.string(),
    })
  ),
});

const commerceConfigSchema = z.object({
  enabled: z.boolean().optional(),
});

const analyticsSchema = z.object({
  gtag: z.string().optional(),
});

const sectionItemSchema = z.union([
  z.object({
    type: z.literal('asset'),
    title: z.string(),
    chainId: z.number(),
    contractAddress: z.string(),
    tokenId: z.string()
  }),
  z.object({
    type: z.literal('collection'),
    variant: z.enum(['default', 'simple']),
    featured: z.boolean().optional(),
    title: z.string(),
    subtitle: z.string(),
    backgroundImageUrl: z.string(),
    chainId: z.number(),
    contractAddress: z.string()
  })
]);

const callToActionSectionSchema = z.object({
  type: z.literal('call-to-action'),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  button: z.object({
    title: z.string(),
    url: z.string(),
    openInNewPage: z.boolean().optional()
  }),
  items: z.array(sectionItemSchema).optional(),
  variant: z.enum(['light', 'dark']).optional(),
  name: z.string().optional()
});

const appPageSectionSchema = z.union([
  z.object({
    type: z.string(),
    name: z.string().optional(),
    data: z.string().optional(),
    config: z.any().optional(),
    contract: z.any().optional(),
  }),
  callToActionSectionSchema
]);

const gatedConditionSchema = z.object({
  type: z.enum(["collection", "coin", "multiCollection"]).optional(),
  condition: z.enum(["and", "or"]).optional(),
  protocol: z.enum(["ERC20", "ERC721", "ERC1155"]).optional(),
  decimals: z.number().optional(),
  address: z.string().optional(),
  symbol: z.string().optional(),
  chainId: z.number().optional(),
  amount: z.string(),
  tokenId: z.string().optional(),
});

const pageSectionsLayoutSchema = z.union([
  z.object({
    type: z.literal("list"),
  }),
  z.object({
    type: z.literal("tabs"),
    layout: z
      .object({
        desktop: z.object({
          position: z.enum(["top", "bottom", "side"]),
        }),
        mobile: z.object({
          position: z.enum(["top", "bottom"]),
        }),
      })
      .optional(),
  }),
]);

const appPageSchema = z.object({
  key: z.string().optional(),
  title: z.string().optional(),
  clonedPageKey: z.string().optional(),
  uri: z.string().optional(),
  layout: pageSectionsLayoutSchema.optional(),
  isEditGatedConditions: z.boolean().optional(),
  enableGatedConditions: z.boolean().optional(),
  gatedConditions: z.array(gatedConditionSchema).optional(),
  gatedPageLayout: z.any().optional(),
  sections: z.array(appPageSectionSchema),
});

export const appConfigSchema = z.object({
  name: z.string(),
  locale: z.string().optional(),
  hide_powered_by: z.boolean().optional(),
  activeChainIds: z.array(z.number()).optional(),
  font: fontSchema.optional(),
  defaultThemeMode: z.nativeEnum(ThemeMode).optional(),
  theme: z.string(),
  customTheme: z.string().optional(),
  customThemeLight: z.string().optional(),
  customThemeDark: z.string().optional(),
  domain: z.string(),
  email: z.string(),
  currency: z.string(),
  logo: logoSchema.optional(),
  logoDark: logoSchema.optional(),
  favicon_url: z.string().optional(),
  social: z.array(socialMediaSchema).optional(),
  social_custom: z.array(socialMediaCustomSchema).optional(),
  pages: z.record(appPageSchema),
  transak: z.object({ enabled: z.boolean() }).optional(),
  fees: z.array(feeSchema).optional(),
  swapFees: swapFeeSchema.optional(),
  searchbar: searchbarConfigSchema.optional(),
  format: formatSchema.optional(),
  menuSettings: menuSettingsSchema.optional(),
  menuTree: z.array(menuTreeSchema).optional(),
  footerMenuTree: z.array(menuTreeSchema).optional(),
  collections: z.array(appCollectionSchema).optional(),
  seo: z.record(pageSeoSchema).optional(),
  analytics: analyticsSchema.optional(),
  tokens: z.array(appTokenSchema).optional(),
  commerce: commerceConfigSchema.optional(),
  themeMode: z.nativeEnum(ThemeMode).optional(),

});

export const widgetConfigSchema = z.object({
  name: z.string(),
  locale: z.string().optional(),
  hide_powered_by: z.boolean().optional(),
  activeChainIds: z.array(z.number()).optional(),
  font: fontSchema.optional(),
  defaultThemeMode: z.nativeEnum(ThemeMode).optional(),
  theme: z.string(),
  customTheme: z.string().optional(),
  customThemeLight: z.string().optional(),
  customThemeDark: z.string().optional(),
  currency: z.string(),
  page: appPageSchema,
  transak: z.object({ enabled: z.boolean() }).optional(),
  fees: z.array(feeSchema).optional(),
  swapFees: swapFeeSchema.optional(),
  format: formatSchema.optional(),
  collections: z.array(appCollectionSchema).optional(),
  tokens: z.array(appTokenSchema).optional(),
  commerce: commerceConfigSchema.optional(),
  themeMode: z.nativeEnum(ThemeMode).optional(),
});

export type AppConfigSchema = z.infer<typeof appConfigSchema>;

export type WidgetConfigSchema = z.infer<typeof widgetConfigSchema>;

export const CallToActionSectionSchema = callToActionSectionSchema;
export const SectionItemSchema = sectionItemSchema; 