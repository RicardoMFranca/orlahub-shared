import { z } from 'zod';

/** Dinheiro sempre em centavos (inteiro). Nunca float. */
export type Cents = number;

export const centsSchema = z.number().int().nonnegative();
export const positiveCentsSchema = z.number().int().positive();
export const idSchema = z.uuid();
export const isoDateTimeSchema = z.iso.datetime();
