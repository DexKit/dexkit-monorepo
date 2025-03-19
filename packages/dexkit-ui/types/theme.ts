import z from "zod";
import { ReferenceSchema, ThemeSchema } from "../constants/theme";

export type ThemeType = z.infer<typeof ThemeSchema>;

export type ReferenceType = z.infer<typeof ReferenceSchema>;
