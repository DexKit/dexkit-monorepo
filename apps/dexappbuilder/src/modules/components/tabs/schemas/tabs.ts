import { z } from 'zod';

export const tabConfigSchema = z.object({
  id: z.string().min(1, 'Tab ID is required'),
  label: z.string().min(1, 'Tab label is required'),
  content: z.string().min(1, 'Tab content is required'),
  icon: z.string().optional(),
  iconPosition: z.enum(['start', 'end', 'top', 'bottom']).optional().default('top'),
  disabled: z.boolean().optional().default(false),
  wrapped: z.boolean().optional().default(false),
  sx: z.any().optional(),
  tabProps: z.any().optional(),
});

export const tabsConfigSchema = z.object({
  id: z.string().min(1, 'Tabs ID is required'),
  tabs: z.array(tabConfigSchema).min(1, 'At least one tab is required'),
  orientation: z.enum(['horizontal', 'vertical']).optional().default('horizontal'),
  variant: z.enum(['standard', 'scrollable', 'fullWidth']).optional().default('standard'),
  indicatorColor: z.enum(['primary', 'secondary']).optional().default('primary'),
  textColor: z.enum(['primary', 'secondary', 'inherit']).optional().default('primary'),
  centered: z.boolean().optional().default(false),
  allowScrollButtonsMobile: z.boolean().optional().default(false),
  scrollButtons: z.union([z.boolean(), z.literal('auto')]).optional().default('auto'),
  selectionFollowsFocus: z.boolean().optional().default(false),
  visibleScrollbar: z.boolean().optional().default(false),

  fullWidth: z.boolean().optional().default(false),
  borderRadius: z.number().min(0).max(50).optional().default(4),
  elevation: z.number().min(0).max(24).optional().default(0),
  padding: z.number().min(0).max(50).optional().default(16),
  backgroundColor: z.string().optional(),
  tabFontSize: z.number().min(8).max(24).optional().default(14),
  contentFontSize: z.number().min(10).max(32).optional().default(16),
  tabFontColor: z.string().optional(),
  contentFontColor: z.string().optional(),
  indicatorCustomColor: z.string().optional(),
  className: z.string().optional(),
  sx: z.any().optional(),
  tabsProps: z.any().optional(),
});

export const tabsFormValuesSchema = tabsConfigSchema.omit({ id: true }).extend({
  tabs: z.array(tabConfigSchema.omit({ id: true }).extend({
    tempId: z.string().optional(),
  })),
});

export const tabsSectionSchema = z.object({
  id: z.string().min(1, 'Section ID is required'),
  type: z.literal('tabs'),
  title: z.string().min(1, 'Section title is required'),
  settings: tabsConfigSchema,
});

export const tabPanelSchema = z.object({
  index: z.number().min(0),
  value: z.number().min(0),
  orientation: z.enum(['horizontal', 'vertical']).optional(),
});

export type TabConfigSchema = z.infer<typeof tabConfigSchema>;
export type TabsConfigSchema = z.infer<typeof tabsConfigSchema>;
export type TabsFormValuesSchema = z.infer<typeof tabsFormValuesSchema>;
export type TabsSectionSchema = z.infer<typeof tabsSectionSchema>;
export type TabPanelSchema = z.infer<typeof tabPanelSchema>; 