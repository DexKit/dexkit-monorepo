import { isAddress } from 'viem';
import { z } from 'zod';

// Create a custom Zod schema
const EthAddressSchema = z.string().refine((val) => isAddress(val), {
  message: 'Invalid Ethereum address',
});

export const CommerceStoreFormSchema = z.object({
  type: z.literal('store'),
  address: EthAddressSchema,
});

export const CommerceCheckoutFormSchema = z.object({
  type: z.literal('checkout'),
  address: EthAddressSchema,
});

export const CommerceCollectionFormSchema = z.object({
  type: z.literal('collection'),
  address: EthAddressSchema,
});

export const CommerceFormSchema = z.union([
  CommerceStoreFormSchema,
  CommerceCheckoutFormSchema,
  CommerceCollectionFormSchema,
]);
