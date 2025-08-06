import { z } from 'zod';

export const AccordionActionSchema = z.object({
  label: z.string().min(1, 'Action label is required'),
  href: z.string().url().optional().or(z.literal('')),
  onClick: z.function().optional(),
  variant: z.enum(['text', 'outlined', 'contained']).optional(),
  color: z.enum(['inherit', 'primary', 'secondary', 'success', 'error', 'info', 'warning']).optional(),
  size: z.enum(['small', 'medium', 'large']).optional(),
  startIcon: z.string().optional(),
  endIcon: z.string().optional(),
  disabled: z.boolean().optional(),
});

export const AccordionItemSchema = z.object({
  id: z.string().min(1, 'Accordion ID is required'),
  title: z.string().min(1, 'Accordion title is required'),
  content: z.string().min(1, 'Accordion content is required'),
  summary: z.string().optional(),
  expanded: z.boolean().optional(),
  disabled: z.boolean().optional(),
  actions: z.array(AccordionActionSchema).optional(),
  titleVariant: z.enum(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'subtitle1', 'subtitle2', 'body1', 'body2', 'caption', 'button', 'overline']).optional(),
  contentVariant: z.enum(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'subtitle1', 'subtitle2', 'body1', 'body2', 'caption', 'button', 'overline']).optional(),
  ariaControls: z.string().optional(),
  ariaExpanded: z.boolean().optional(),
  sx: z.any().optional(),
  summaryProps: z.any().optional(),
  detailsProps: z.any().optional(),
  expandIcon: z.string().optional(),
  collapseIcon: z.string().optional(),
});

export const AccordionSettingsSchema = z.object({
  variant: z.enum(['elevation', 'outlined']).optional(),
  square: z.boolean().optional(),
  disableGutters: z.boolean().optional(),
  defaultExpanded: z.array(z.string()).optional(),
  expandedIds: z.array(z.string()).optional(),
  allowMultiple: z.boolean().optional(),
  unmountOnExit: z.boolean().optional(),
  headingComponent: z.enum(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div']).optional(),
  transitionDuration: z.union([z.number().min(0), z.literal('auto')]).optional(),
  transitionEasing: z.string().optional(),
  spacing: z.number().min(0).max(10).optional(),
  fullWidth: z.boolean().optional(),
  elevation: z.number().min(0).max(24).optional(),
  borderRadius: z.number().min(0).optional(),
  sx: z.any().optional(),
  actionsPlacement: z.enum(['summary', 'details', 'both']).optional(),
  actionsAlignment: z.enum(['left', 'center', 'right']).optional(),
  defaultExpandIcon: z.string().optional(),
  defaultCollapseIcon: z.string().optional(),
  iconPosition: z.enum(['start', 'end']).optional(),
  hideExpandIcon: z.boolean().optional(),
  defaultTitleVariant: z.enum(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'subtitle1', 'subtitle2', 'body1', 'body2', 'caption', 'button', 'overline']).optional(),
  defaultContentVariant: z.enum(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'subtitle1', 'subtitle2', 'body1', 'body2', 'caption', 'button', 'overline']).optional(),
  disableRipple: z.boolean().optional(),
  focusRipple: z.boolean().optional(),
  className: z.string().optional(),
  onChange: z.function().optional(),
});

export const MultiAccordionConfigSchema = z.object({
  accordions: z.array(AccordionItemSchema).min(1, 'At least one accordion is required'),
  settings: AccordionSettingsSchema,
}).refine(
  (data) => {
    if (data.settings.defaultExpanded) {
      const accordionIds = new Set(data.accordions.map(acc => acc.id));
      return data.settings.defaultExpanded.every(id => accordionIds.has(id));
    }
    return true;
  },
  {
    message: 'Default expanded IDs must exist in the accordions list',
    path: ['settings', 'defaultExpanded'],
  }
).refine(
  (data) => {
    const ids = data.accordions.map(acc => acc.id);
    const uniqueIds = new Set(ids);
    return ids.length === uniqueIds.size;
  },
  {
    message: 'Accordion IDs must be unique',
    path: ['accordions'],
  }
).refine(
  (data) => {
    if (!data.settings.allowMultiple && data.settings.defaultExpanded && data.settings.defaultExpanded.length > 1) {
      return false;
    }
    return true;
  },
  {
    message: 'Cannot have multiple default expanded accordions when allowMultiple is false',
    path: ['settings', 'defaultExpanded'],
  }
);

export const AccordionPageSectionSchema = z.object({
  type: z.literal('accordion'),
  settings: MultiAccordionConfigSchema,
  name: z.string().optional(),
});

export type AccordionActionType = z.infer<typeof AccordionActionSchema>;
export type AccordionItemType = z.infer<typeof AccordionItemSchema>;
export type AccordionSettingsType = z.infer<typeof AccordionSettingsSchema>;
export type MultiAccordionConfigType = z.infer<typeof MultiAccordionConfigSchema>;
export type AccordionPageSectionType = z.infer<typeof AccordionPageSectionSchema>; 