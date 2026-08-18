# CLAUDE.md — quiosque-shared

O **contrato** entre a API e o front. Fonte única de verdade para tudo que atravessa a rede: tipos, enums e schemas de request/response. Não tem lógica de negócio, não acessa banco, não tem UI.

Este repositório é consumido por `quiosque-api` e `quiosque-web`. Ele não depende de nenhum dos dois.

## Comandos

```
pnpm build      # compila TS para dist/
pnpm typecheck  # tsc --noEmit
pnpm lint
```

O script **`prepare`** roda o mesmo build. Não é enfeite: `api` e `web` instalam
este pacote por git, o `dist/` não está versionado, e é o `prepare` que o
compila na máquina de quem instala. Sem ele, o pacote chega sem `dist/` e o
`main` aponta para um arquivo inexistente.

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

- `OrderStatus`: DRAFT, PENDING_ARRIVAL, AWAITING_RELEASE, QUEUED, CONFIRMED, PREPARING, READY, DELIVERED, CLOSED, CANCELLED
- `Station`: KITCHEN, BAR — o posto que prepara. É propriedade do PEDIDO (vem do item do cardápio), e também aparece no vínculo, dizendo de qual fila a pessoa cuida
- `TabStatus`: OPEN, CLOSING, PAID
- `PaymentStatus`: PENDING, PAID, EXPIRED, FAILED
- `PaymentMethod`: PIX, CARD, CASH
- `MembershipRole`: MANAGER, WAITER, COOK
- `ThemePreset`: AREIA, MAR, COCO, POR_DO_SOL, CUSTOM — a identidade visual da loja
- `UserRole` (global): ADMIN, COMPANY_OWNER

`SessionResponse.memberships[]` carrega `role` **e** `station`: é de lá que o
front decide quais áreas mostrar. `RestaurantResponse` carrega `logoUrl` e um
`theme` já resolvido (o front não faz conta de cor).

## Versionamento e consumo

`api` e `web` consomem por **referência git direta**
(`github:RicardoMFranca/orlahub-shared#main`). Uma mudança que quebra o contrato
quebra os dois consumidores no typecheck seguinte — é desejado, é a proteção que
este repo existe para dar. Quando amadurecer, migrar para GitHub Packages com
semver.

Três coisas que essa escolha exige, e que já custaram build quebrado:

1. **O repositório precisa ser público** (ou haveria token em quatro ambientes de
   build: dois Actions, o servidor e o Pages). Ele só tem contrato — sem segredo,
   sem regra de negócio —, e os enums e schemas já viajam no bundle do front,
   ao alcance de qualquer visitante. Fechá-lo não esconderia nada.
2. **O consumidor precisa autorizar o `prepare`.** O pnpm bloqueia script de
   pacote vindo de git; sem `"pnpm": { "onlyBuiltDependencies": ["@quiosque/shared"] }`
   no `package.json` do consumidor, o install falha com
   `ERR_PNPM_GIT_DEP_PREPARE_NOT_ALLOWED`. Com npm passa direto — foi assim que
   a diferença apareceu.
3. **O `pnpm-lock.yaml` do consumidor precisa ser commitado junto.** O CI usa
   `--frozen-lockfile`; lock desatualizado derruba o build com uma mensagem que
   não aponta para a causa.

Para trabalhar no contrato vendo o efeito na hora, o consumidor tem
`pnpm shared:local` (aponta para `../orlahub-shared`) e `pnpm shared:git` (volta
para a `main`). **O que se commita é sempre o `shared:git`.**

## O que NÃO fazer

- Não importar nada de `express`, `pg`, `react` ou qualquer runtime aqui. Este repo é tipos puros.
- Não colocar lógica de transição de estado (ela vive em `quiosque-api/domain`).
- Não colocar helpers de formatação de UI (isso é do `web`).
