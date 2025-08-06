import { z } from 'zod';

export const cardActionSchema = z.object({
  label: z.string().optional(),
  onClick: z.function().optional(),
  href: z.string().optional().refine((val) => !val || val === '' || /^https?:\/\/.+/.test(val), {
    message: 'Must be a valid URL if provided'
  }),
});

export const cardSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  image: z.string().optional().refine((val) => !val || val === '' || /^https?:\/\/.+/.test(val), {
    message: 'Must be a valid URL if provided'
  }),
  imageFile: z.instanceof(File).optional(),
  actions: z.array(cardActionSchema).optional(),
  sx: z.any().optional(),
});

export const cardLayoutSchema = z.object({
  x: z.number().min(0),
  y: z.number().min(0),
  w: z.number().min(1),
  h: z.number().min(1),
  minW: z.number().min(1).optional(),
  maxW: z.number().min(1).optional(),
  minH: z.number().min(1).optional(),
  maxH: z.number().min(1).optional(),
  static: z.boolean().optional(),
  isDraggable: z.boolean().optional(),
  isResizable: z.boolean().optional(),
});

export const cardGridItemSchema = cardSchema.extend({
  layout: cardLayoutSchema,
});

export const gridSettingsSchema = z.object({
  cols: z.number().min(1).max(24).default(12),
  rowHeight: z.number().min(10).default(150),
  margin: z.tuple([z.number().min(0), z.number().min(0)]).default([10, 10]),
  containerPadding: z.tuple([z.number().min(0), z.number().min(0)]).default([10, 10]),
  compactType: z.enum(['vertical', 'horizontal']).nullable().default('vertical'),
  allowOverlap: z.boolean().optional().default(false),
  preventCollision: z.boolean().optional().default(false),
  isDraggable: z.boolean().optional().default(true),
  isResizable: z.boolean().optional().default(true),
});

export const responsiveSettingsSchema = z.object({
  breakpoints: z.record(z.string(), z.number()).default({
    lg: 1200,
    md: 996,
    sm: 768,
    xs: 480,
    xxs: 0,
  }),
  cols: z.record(z.string(), z.number()).default({
    lg: 12,
    md: 10,
    sm: 6,
    xs: 4,
    xxs: 2,
  }),
}).optional();

export const multiCardConfigSchema = z.object({
  cards: z.array(cardGridItemSchema).min(1, 'At least one card is required'),
  gridSettings: gridSettingsSchema,
  responsive: responsiveSettingsSchema,
}); 