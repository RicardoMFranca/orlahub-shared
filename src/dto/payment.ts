import { z } from 'zod';
import { idSchema, isoDateTimeSchema, positiveCentsSchema } from '../common.js';
import { paymentMethodSchema, paymentStatusSchema } from '../enums.js';

export const createPaymentInputSchema = z.object({
  tabId: idSchema,
  method: paymentMethodSchema,
  amountCents: positiveCentsSchema,
});
export type CreatePaymentInput = z.infer<typeof createPaymentInputSchema>;

export const paymentResponseSchema = z.object({
  id: idSchema,
  tabId: idSchema,
  method: paymentMethodSchema,
  status: paymentStatusSchema,
  amountCents: positiveCentsSchema,
  createdAt: isoDateTimeSchema,
});
export type PaymentResponse = z.infer<typeof paymentResponseSchema>;
