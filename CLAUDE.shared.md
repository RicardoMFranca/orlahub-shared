# CLAUDE.md — quiosque-shared

O **contrato** entre a API e o front. Fonte única de verdade para tudo que atravessa a rede: tipos, enums e schemas de request/response. Não tem lógica de negócio, não acessa banco, não tem UI.

Este repositório é consumido por `quiosque-api` e `quiosque-web`. Ele não depende de nenhum dos dois.

## Comandos

```
pnpm build      # compila TS para dist/
pnpm typecheck  # tsc --noEmit
pnpm lint
```

## A regra de fronteira (a mais importante deste repo)

**Entra:** o formato dos dados que cruzam HTTP/WS entre front e back.
**NÃO entra:** regra de negócio, máquina de estados, acesso a dados, lógica de estoque/pagamento, componentes de UI.

Teste mental antes de adicionar algo: "o front precisa disto para renderizar uma tela ou montar uma requisição?" Se sim, entra. Se é "como a API decide X", NÃO entra — isso é privado da API.

## Estrutura

```
src/
├── enums.ts        → OrderStatus, TabStatus, PaymentStatus, PaymentMethod, UserRole, MembershipRole
├── dto/
│   ├── auth.ts     → LoginInput, SessionResponse
│   ├── company.ts  → CompanyResponse, RestaurantResponse
│   ├── menu.ts     → MenuItemResponse, MenuResponse
│   ├── tab.ts      → OpenTabInput, TabResponse
│   ├── order.ts    → CreateOrderInput, OrderResponse, OrderItemResponse
│   └── payment.ts  → CreatePaymentInput, PaymentResponse
├── events.ts       → tipos dos eventos WebSocket (payloads que a API empurra)
└── index.ts        → re-exporta tudo
```

## Convenções

- Todo DTO é um **schema Zod**; o tipo TS deriva com `z.infer`. Uma definição, dois usos (a API valida input, o front usa o tipo). Nunca declare a interface separada do schema.
- Dinheiro sempre em **centavos** (inteiro). Nunca float. Há um tipo `Cents = number`.
- Enums como objeto `as const` + tipo derivado, não `enum` do TS (melhor tree-shaking e serialização).
- IDs são `string` com `.uuid()` no schema.
- Datas viajam como string ISO (`z.string().datetime()`), não `Date`.

## Enums que devem existir (alinhados ao domínio)

- `OrderStatus`: DRAFT, PENDING_ARRIVAL, QUEUED, CONFIRMED, PREPARING, READY, DELIVERED, CANCELLED
- `TabStatus`: OPEN, CLOSING, PAID
- `PaymentStatus`: PENDING, PAID, EXPIRED, FAILED
- `PaymentMethod`: PIX, CARD, CASH
- `MembershipRole`: MANAGER, WAITER, COOK
- `UserRole` (global): ADMIN, COMPANY_OWNER

## Versionamento

No começo, `api` e `web` consomem via referência git direta (`github:USER/quiosque-shared#main`). Uma mudança que quebra o contrato quebra os dois consumidores no typecheck — isso é desejado, é a proteção que este repo existe para dar. Quando amadurecer, migrar para GitHub Packages com semver.

## O que NÃO fazer

- Não importar nada de `express`, `pg`, `react` ou qualquer runtime aqui. Este repo é tipos puros.
- Não colocar lógica de transição de estado (ela vive em `quiosque-api/domain`).
- Não colocar helpers de formatação de UI (isso é do `web`).
