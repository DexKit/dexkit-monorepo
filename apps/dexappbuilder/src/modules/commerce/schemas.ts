import { ProductCollectionSchema } from '@dexkit/ui/modules/commerce/schemas';
import Decimal from 'decimal.js';
import { z } from 'zod';

export const ProductSchema = z.object({
  id: z.string().optional(),
  name: z.string().max(30),
  description: z.string().optional(),
  price: z.string().refine(
    (args) => {
      try {
        const value = new Decimal(args);

        return value.gt(0);
      } catch (err) {}

      return false;
    },
    { message: 'Must be greater than zero' },
  ),
  category: z
    .custom<z.infer<typeof CategoryFormSchema>>()
    .nullable()
    .optional(),
  collections: z
    .custom<z.infer<typeof ProductCollectionSchema>[]>()
    .default([]),
  imageUrl: z.string().url().optional().nullable(),
  publishedAt: z.coerce.date().nullable().optional(),
  digital: z.boolean(),
  content: z.string().nullable().optional(),
});

export const CheckoutSchemaItem = z.object({
  id: z.string().optional(),
  productId: z.string(),
  quantity: z.number(),
});

export const CheckoutSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  description: z.string(),
  requireEmail: z.boolean(),
  requireAddress: z.boolean(),
  items: z.array(CheckoutSchemaItem).min(1).max(50),
  editable: z.boolean().default(false),
});

export const CheckoutNetworksUpdateSchema = z.object({
  chainIds: z.array(z.number()),
});

export const CheckoutSettingsSchema = z.object({
  receiverAccount: z.string(),
  receiverEmail: z.string().email(),
});

export const UserCheckoutItemsFormSchema = z.object({
  items: z.record(
    z.object({
      quantity: z.number().min(1).max(100),
      price: z.string(),
    }),
  ),
});

export const CategoryFormSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
});
