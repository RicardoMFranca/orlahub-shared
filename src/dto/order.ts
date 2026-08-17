import { z } from 'zod';
import { centsSchema, idSchema, isoDateTimeSchema } from '../common.js';
import { orderStatusSchema, stationSchema } from '../enums.js';

export const createOrderItemInputSchema = z.object({
  menuItemId: idSchema,
  quantity: z.number().int().positive(),
});
export type CreateOrderItemInput = z.infer<typeof createOrderItemInputSchema>;

export const createOrderInputSchema = z.object({
  /** null para pedido remoto (a comanda é vinculada na chegada). */
  tabId: idSchema.nullable(),
  items: z.array(createOrderItemInputSchema).min(1),
});
export type CreateOrderInput = z.infer<typeof createOrderInputSchema>;

export const orderItemResponseSchema = z.object({
  id: idSchema,
  menuItemId: idSchema,
  name: z.string(),
  quantity: z.number().int(),
  /** Preço copiado no momento do pedido — histórico não se corrompe se o preço mudar. */
  unitPriceCents: centsSchema,
});
export type OrderItemResponse = z.infer<typeof orderItemResponseSchema>;

export const orderResponseSchema = z.object({
  id: idSchema,
  tabId: idSchema.nullable(),
  restaurantId: idSchema,
  /** null = pedido remoto ainda sem mesa. */
  tableId: idSchema.nullable(),
  status: orderStatusSchema,
  /** Posto que prepara este pedido. Um pedido = um posto. */
  station: stationSchema,
  /** Sequência por loja — o front detecta buracos e refaz o fetch. */
  seq: z.number().int(),
  totalCents: centsSchema,
  items: z.array(orderItemResponseSchema),
  createdAt: isoDateTimeSchema,
});
export type OrderResponse = z.infer<typeof orderResponseSchema>;

/**
 * Um envio do cliente pode virar MAIS DE UM pedido: comida vai para a cozinha,
 * bebida para o balcão, cada um com seu ciclo de vida. Quem junta a conta é a
 * comanda.
 */
export const placedOrdersResponseSchema = z.object({
  orders: z.array(orderResponseSchema).min(1),
});
export type PlacedOrdersResponse = z.infer<typeof placedOrdersResponseSchema>;
