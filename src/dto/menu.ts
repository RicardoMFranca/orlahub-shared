import { z } from 'zod';
import { centsSchema, idSchema } from '../common.js';
import { stationSchema } from '../enums.js';
import { restaurantResponseSchema } from './company.js';

export const menuItemResponseSchema = z.object({
  id: idSchema,
  restaurantId: idSchema,
  /** Item de estoque vinculado (baixa automática); null para item sem controle. */
  inventoryItemId: idSchema.nullable(),
  name: z.string(),
  priceCents: centsSchema,
  isAvailable: z.boolean(),
  /** Agrupamento livre do cardápio ("Bebidas", "Porções"); null = sem seção. */
  category: z.string().nullable(),
  /** Quem prepara: cozinha ou balcão. Roteia o pedido, não é exibição. */
  station: stationSchema,
  description: z.string().nullable(),
  /** URL de foto do prato; upload fica para depois, hoje é colada pelo gestor. */
  imageUrl: z.string().nullable(),
});
export type MenuItemResponse = z.infer<typeof menuItemResponseSchema>;

/** Cardápio público (via QR de mesa/ponto). */
export const menuResponseSchema = z.object({
  restaurant: restaurantResponseSchema,
  items: z.array(menuItemResponseSchema),
});
export type MenuResponse = z.infer<typeof menuResponseSchema>;
