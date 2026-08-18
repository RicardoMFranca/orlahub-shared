import { z } from 'zod';
import { idSchema, isoDateTimeSchema } from '../common.js';
import { userRoleSchema } from '../enums.js';
import { companyResponseSchema } from './company.js';

/**
 * Contrato da PLATAFORMA — o que o admin do sistema vê e faz.
 *
 * É a única parte do contrato que atravessa empresas: todo o resto é sempre de
 * uma empresa só. Por isso mora num arquivo separado, e não em `company.ts`:
 * quem lê `CompanySummary` precisa saber que aquilo veio de uma leitura
 * cross-tenant, feita por quem administra o sistema inteiro.
 */

/** A empresa na listagem: identidade + o tamanho dela em números. */
export const companySummarySchema = companyResponseSchema.extend({
  restaurantCount: z.number().int().nonnegative(),
  /** Quantas dessas estão abertas AGORA — é o sinal de que a empresa opera. */
  openRestaurantCount: z.number().int().nonnegative(),
  userCount: z.number().int().nonnegative(),
});
export type CompanySummary = z.infer<typeof companySummarySchema>;

/**
 * Uma pessoa da empresa, do jeito que a plataforma precisa listar.
 *
 * `role` é o papel GLOBAL: `COMPANY_OWNER` para dono, `null` para funcionário
 * comum (o poder dele vem das memberships, que são por loja e não cabem aqui).
 */
export const companyUserSchema = z.object({
  id: idSchema,
  name: z.string(),
  email: z.email(),
  role: userRoleSchema.nullable(),
  createdAt: isoDateTimeSchema,
});
export type CompanyUser = z.infer<typeof companyUserSchema>;

/**
 * A loja como a plataforma a mostra: nome e se está aberta, nada mais.
 *
 * Deliberadamente NÃO é `RestaurantResponse`. O admin aqui está conferindo o
 * cadastro, não operando a loja — tema, logotipo e fuso pertencem à Gestão,
 * que é onde ele entra depois.
 */
export const companyRestaurantSchema = z.object({
  id: idSchema,
  name: z.string(),
  isOpen: z.boolean(),
});
export type CompanyRestaurant = z.infer<typeof companyRestaurantSchema>;

export const companyDetailSchema = companySummarySchema.extend({
  users: z.array(companyUserSchema),
  restaurants: z.array(companyRestaurantSchema),
  /**
   * Pedidos já registrados na empresa. Não é métrica de venda — é a resposta
   * para "dá para excluir?", que a tela precisa saber ANTES de oferecer o
   * botão. Empresa que já vendeu não se apaga.
   */
  orderCount: z.number().int().nonnegative(),
});
export type CompanyDetail = z.infer<typeof companyDetailSchema>;

/** Senha de acesso criado pelo admin: o mesmo mínimo do login. */
const passwordSchema = z.string().min(8, 'A senha precisa de pelo menos 8 caracteres');

export const createCompanyInputSchema = z.object({
  name: z.string().min(1),
  /** CNPJ. Opcional: o quiosque pode começar antes de ter o papel na mão. */
  document: z.string().min(1).nullable().default(null),
  owner: z.object({
    name: z.string().min(1),
    email: z.email(),
    password: passwordSchema,
  }),
});
export type CreateCompanyInput = z.infer<typeof createCompanyInputSchema>;

/**
 * O acesso recém-criado. Sem `createdAt` de propósito: quem acabou de criar
 * precisa do id e do e-mail para conferir, e a data está na listagem seguinte.
 */
export const createdUserSchema = companyUserSchema.pick({ id: true, name: true, email: true });
export type CreatedUser = z.infer<typeof createdUserSchema>;

/** Empresa e dono nascem juntos, numa transação — a resposta traz os dois. */
export const createCompanyResponseSchema = z.object({
  company: companyResponseSchema,
  owner: createdUserSchema,
});
export type CreateCompanyResponse = z.infer<typeof createCompanyResponseSchema>;

export const updateCompanyInputSchema = z.object({
  name: z.string().min(1).optional(),
  document: z.string().min(1).nullable().optional(),
});
export type UpdateCompanyInput = z.infer<typeof updateCompanyInputSchema>;

export const createCompanyOwnerInputSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  password: passwordSchema,
});
export type CreateCompanyOwnerInput = z.infer<typeof createCompanyOwnerInputSchema>;

export const resetPasswordInputSchema = z.object({ password: passwordSchema });
export type ResetPasswordInput = z.infer<typeof resetPasswordInputSchema>;
