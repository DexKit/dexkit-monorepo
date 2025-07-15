import { z } from 'zod';

export const cardActionSchema = z.object({
  label: z.string().min(1, 'Label is mandatory'),
  onClick: z.function().optional(),
  href: z.string().url().optional(),
});

export const cardSchema = z.object({
  title: z.string().min(1, 'Title is mandatory'),
  description: z.string().optional(),
  image: z.string().url().optional(),
  actions: z.array(cardActionSchema).optional(),
  sx: z.any().optional(),
}); 