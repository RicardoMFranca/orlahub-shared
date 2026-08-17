import { z } from 'zod';
import { idSchema, isoDateTimeSchema } from '../common.js';
import { themePresetSchema } from '../enums.js';

export const companyResponseSchema = z.object({
  id: idSchema,
  name: z.string(),
  /** CNPJ */
  document: z.string().nullable(),
  createdAt: isoDateTimeSchema,
});
export type CompanyResponse = z.infer<typeof companyResponseSchema>;

/** Cor em hex minúsculo de 6 dígitos — o formato que o CSS recebe direto. */
export const hexColorSchema = z.string().regex(/^#[0-9a-f]{6}$/, 'Cor deve ser #rrggbb');

/**
 * Paleta da loja, já RESOLVIDA pela API.
 *
 * `preset` e `brandColor` são a escolha do gestor (o que a tela de ajustes
 * mostra selecionado); os quatro campos seguintes são o resultado do cálculo
 * de contraste e vão direto para as variáveis CSS. O front não deriva cor:
 * se derivasse, a mesma conta existiria em dois lugares e um dia divergiria.
 *
 * A marca manda só neste quarteto. Fundo, tinta do texto, anel de foco e as
 * cores de estado (pronto, atrasado, erro) continuam sendo do sistema: elas
 * carregam SIGNIFICADO, e significado não é personalizável.
 */
export const restaurantThemeSchema = z.object({
  preset: themePresetSchema,
  /** A cor pedida pelo gestor, quando `preset === 'CUSTOM'`. */
  brandColor: hexColorSchema.nullable(),
  /** Cor da marca de fato aplicada (pode ter sido clareada/escurecida). */
  brand: hexColorSchema,
  /** Variante de hover/pressionado. */
  brandStrong: hexColorSchema,
  /** Fundo tingido de leve, para blocos de destaque. */
  brandWash: hexColorSchema,
  /** Tinta sobre a marca: clara ou escura, a que tiver mais contraste. */
  onBrand: hexColorSchema,
});
export type RestaurantTheme = z.infer<typeof restaurantThemeSchema>;

export const restaurantResponseSchema = z.object({
  id: idSchema,
  companyId: idSchema,
  name: z.string(),
  address: z.string().nullable(),
  timezone: z.string(),
  isOpen: z.boolean(),
  /** URL pública do logotipo; `null` enquanto a loja não subiu nenhum. */
  logoUrl: z.string().nullable(),
  theme: restaurantThemeSchema,
});
export type RestaurantResponse = z.infer<typeof restaurantResponseSchema>;

/** Uma paleta curada, do jeito que a tela de ajustes precisa desenhá-la. */
export const themePresetOptionSchema = z.object({
  preset: themePresetSchema,
  label: z.string(),
  theme: restaurantThemeSchema,
});
export type ThemePresetOption = z.infer<typeof themePresetOptionSchema>;
