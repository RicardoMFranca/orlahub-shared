import { z } from 'zod';

// Enums como objeto `as const` + tipo derivado (não `enum` do TS).
// Estados do pedido conforme docs/state-machine.md.

export const OrderStatus = {
  DRAFT: 'DRAFT',
  PENDING_ARRIVAL: 'PENDING_ARRIVAL',
  AWAITING_RELEASE: 'AWAITING_RELEASE',
  QUEUED: 'QUEUED',
  CONFIRMED: 'CONFIRMED',
  PREPARING: 'PREPARING',
  READY: 'READY',
  DELIVERED: 'DELIVERED',
  CLOSED: 'CLOSED',
  CANCELLED: 'CANCELLED',
} as const;
export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];
export const orderStatusSchema = z.enum(
  Object.values(OrderStatus) as [OrderStatus, ...OrderStatus[]],
);

/**
 * Posto que prepara o item. A cozinha frita o peixe, o balcão tira a cerveja e
 * bate o suco — gente diferente, telas diferentes, e a bebida sai antes da
 * comida. É por isso que um pedido pertence a UM posto: ver docs/state-machine.md.
 *
 * Não confundir com a categoria do cardápio, que é texto livre de exibição
 * ("Bebidas" hoje, "Geladas" amanhã). O posto é roteamento operacional.
 */
export const Station = {
  KITCHEN: 'KITCHEN',
  BAR: 'BAR',
} as const;
export type Station = (typeof Station)[keyof typeof Station];
export const stationSchema = z.enum(Object.values(Station) as [Station, ...Station[]]);

export const TabStatus = {
  OPEN: 'OPEN',
  CLOSING: 'CLOSING',
  PAID: 'PAID',
} as const;
export type TabStatus = (typeof TabStatus)[keyof typeof TabStatus];
export const tabStatusSchema = z.enum(
  Object.values(TabStatus) as [TabStatus, ...TabStatus[]],
);

export const PaymentStatus = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  EXPIRED: 'EXPIRED',
  FAILED: 'FAILED',
} as const;
export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];
export const paymentStatusSchema = z.enum(
  Object.values(PaymentStatus) as [PaymentStatus, ...PaymentStatus[]],
);

export const PaymentMethod = {
  PIX: 'PIX',
  CARD: 'CARD',
  CASH: 'CASH',
} as const;
export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];
export const paymentMethodSchema = z.enum(
  Object.values(PaymentMethod) as [PaymentMethod, ...PaymentMethod[]],
);

export const MembershipRole = {
  MANAGER: 'MANAGER',
  WAITER: 'WAITER',
  COOK: 'COOK',
} as const;
export type MembershipRole = (typeof MembershipRole)[keyof typeof MembershipRole];
export const membershipRoleSchema = z.enum(
  Object.values(MembershipRole) as [MembershipRole, ...MembershipRole[]],
);

/**
 * Identidade visual da loja. Os quatro primeiros são paletas curadas (o gestor
 * escolhe pelo nome); `CUSTOM` é a cor da marca informada por ele.
 *
 * O enum guarda só a ESCOLHA. A paleta resolvida (cor de hover, tinta sobre a
 * marca) é derivada pela API — o front recebe pronto e não faz conta de cor.
 */
export const ThemePreset = {
  /** Marrom e creme: a paleta original, tirada da logo do quiosque. */
  AREIA: 'AREIA',
  MAR: 'MAR',
  COCO: 'COCO',
  POR_DO_SOL: 'POR_DO_SOL',
  CUSTOM: 'CUSTOM',
} as const;
export type ThemePreset = (typeof ThemePreset)[keyof typeof ThemePreset];
export const themePresetSchema = z.enum(
  Object.values(ThemePreset) as [ThemePreset, ...ThemePreset[]],
);

export const UserRole = {
  ADMIN: 'ADMIN',
  COMPANY_OWNER: 'COMPANY_OWNER',
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];
export const userRoleSchema = z.enum(
  Object.values(UserRole) as [UserRole, ...UserRole[]],
);
