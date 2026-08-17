import { z } from 'zod';
import { idSchema } from '../common.js';
import { membershipRoleSchema, stationSchema, userRoleSchema } from '../enums.js';

export const loginInputSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});
export type LoginInput = z.infer<typeof loginInputSchema>;

export const sessionMembershipSchema = z.object({
  restaurantId: idSchema,
  role: membershipRoleSchema,
  /**
   * Posto de quem prepara: `KITCHEN`, `BAR` ou `null` para os dois.
   *
   * Só faz sentido com `role: COOK` — garçom e gerente não têm posto. Fica
   * vazio num quiosque pequeno, onde a mesma pessoa cobre bar e cozinha numa
   * tarde fraca; num quiosque grande, separa as duas filas.
   */
  station: stationSchema.nullable(),
});
export type SessionMembership = z.infer<typeof sessionMembershipSchema>;

export const sessionResponseSchema = z.object({
  userId: idSchema,
  email: z.email(),
  /** Papel global (ADMIN, COMPANY_OWNER); null para funcionário comum. */
  role: userRoleSchema.nullable(),
  /** null apenas para o ADMIN global. */
  companyId: idSchema.nullable(),
  /** Papéis por loja (gerente/garçom/cozinheiro). */
  memberships: z.array(sessionMembershipSchema),
});
export type SessionResponse = z.infer<typeof sessionResponseSchema>;
