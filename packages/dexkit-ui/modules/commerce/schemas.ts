import Decimal from "decimal.js";
import { z } from "zod";

export const ProductCategorySchema = z.object({
  id: z.string().optional(),
  name: z.string(),
});

export const CartOrderItemSchema = z.object({
  productId: z.string(),
  quantity: z.number(),
});

export const CartOrderSchema = z.object({
  siteId: z.number(),
  email: z.string().email().nullable().optional(),
  sender: z.string(),
  chainId: z.number(),
  hash: z.string(),
  tokenAddress: z.string(),
  items: z.array(CartOrderItemSchema),
});

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
    { message: "Must be greater than zero" }
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

export const CheckoutSchema = z
  .object({
    id: z.string().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    requireEmail: z.boolean().optional(),
    requireAddress: z.boolean().optional(),
    items: z.array(CheckoutSchemaItem).min(1).max(50).optional(),
    editable: z.boolean().default(false).optional(),
  })
  .superRefine((args, ctx) => {
    if (args.id !== undefined) {
      if (!args.title) {
        ctx.addIssue({ code: "custom", message: "Required", path: ["title"] });
      }

      if (!args.description) {
        ctx.addIssue({
          code: "custom",
          message: "Required",
          path: ["description"],
        });
      }

      if (!args.items || args.items?.length === 0) {
        ctx.addIssue({ code: "custom", message: "Required", path: ["items"] });
      }
    } else {
      if (!args.title) {
        ctx.addIssue({ code: "custom", message: "Required", path: ["title"] });
      }

      if (!args.description) {
        ctx.addIssue({
          code: "custom",
          message: "Required",
          path: ["description"],
        });
      }
    }
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
    })
  ),
});

export const CategoryFormSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
});

export const CollectionItemSchema = z.object({
  id: z.string().optional(),
  productId: z.string(),
});

export const ProductCollectionSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  items: z.array(CollectionItemSchema).optional(),
});
