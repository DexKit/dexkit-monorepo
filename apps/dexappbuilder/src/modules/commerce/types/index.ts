import { z } from 'zod';
import {
  CategoryFormSchema,
  CheckoutNetworksUpdateSchema,
  CheckoutSchema,
  CheckoutSchemaItem,
  CheckoutSettingsSchema,
  ProductSchema,
} from '../schemas';

export type ProductFormType = z.infer<typeof ProductSchema>;

export type CheckoutFormType = z.infer<typeof CheckoutSchema>;
export type CheckoutItemType = z.infer<typeof CheckoutSchemaItem>;

export type CheckoutNetworksUpdateType = z.infer<
  typeof CheckoutNetworksUpdateSchema
>;

export type CheckoutSettingsType = z.infer<typeof CheckoutSettingsSchema>;

export type Product = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  price: string;
  imageUrl: string | null;
  owner: string;
};

export type CheckoutItem = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  checkoutId: string;
  productId: string;
  product?: Product;
  price: string;
  quantity: number;
  description: string;
  active: boolean;
};

export type Checkout = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  description: string;
  requireEmail: boolean;
  requireAddress: boolean;
  owner: string;
  editable: boolean;
  items: CheckoutItem[];
};

export type Order = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  metadata: any;
  chainId: number;
  contractAddress: string;
  amount: string;
  hash: string;
  receiver: string;
  receiverEmail: string;
  notificationEmail: string;
  senderAddress: string;
  email: string | null;
  owner: string;
  status: string;
};

export type OrderItem = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  orderId: string;
  quantity: number;
  price: string;
  productId: string;
  metadata: any;
} & {
  product: { content?: string; digital: boolean; imageUrl: string | null };
};

export type CategoryType = z.infer<typeof CategoryFormSchema>;
