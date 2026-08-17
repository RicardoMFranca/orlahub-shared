import { z } from 'zod';
import { centsSchema, idSchema, isoDateTimeSchema } from '../common.js';
import { tabStatusSchema } from '../enums.js';

export const openTabInputSchema = z.object({
  tableId: idSchema,
  /** Nome amigável da comanda ("João", "galera do guarda-sol azul"). Não precisa ser único. */
  name: z.string().min(1).max(80),
});
export type OpenTabInput = z.infer<typeof openTabInputSchema>;

export const tabResponseSchema = z.object({
  id: idSchema,
  restaurantId: idSchema,
  tableId: idSchema,
  name: z.string(),
  status: tabStatusSchema,
  /** Soma dos pedidos da comanda. */
  totalCents: centsSchema,
  /** Soma dos pagamentos confirmados. */
  paidCents: centsSchema,
  createdAt: isoDateTimeSchema,
});
export type TabResponse = z.infer<typeof tabResponseSchema>;
