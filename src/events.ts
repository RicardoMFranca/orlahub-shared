import { z } from 'zod';
import { idSchema, isoDateTimeSchema } from './common.js';
import { orderStatusSchema } from './enums.js';

// Payloads que a API empurra via WebSocket. O stream é acelerador;
// a fonte de verdade é sempre o refetch na API.

export const WS_EVENTS = {
  ORDER_STATUS_CHANGED: 'order:status_changed',
} as const;
export type WsEvent = (typeof WS_EVENTS)[keyof typeof WS_EVENTS];

export const orderStatusChangedPayloadSchema = z.object({
  orderId: idSchema,
  restaurantId: idSchema,
  /** Sequência por loja; buraco no seq → refetch. */
  seq: z.number().int(),
  fromStatus: orderStatusSchema.nullable(),
  toStatus: orderStatusSchema,
  occurredAt: isoDateTimeSchema,
});
export type OrderStatusChangedPayload = z.infer<typeof orderStatusChangedPayloadSchema>;
