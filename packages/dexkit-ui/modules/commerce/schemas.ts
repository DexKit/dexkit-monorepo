import { z } from "zod";

export const ProductCategorySchema = z.object({
  id: z.string().optional(),
  name: z.string(),
});
