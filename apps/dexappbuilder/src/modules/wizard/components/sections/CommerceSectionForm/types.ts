import { z } from 'zod';
import { CommerceFormSchema } from './schemas';

export type CommerceFormType = z.infer<typeof CommerceFormSchema>;
