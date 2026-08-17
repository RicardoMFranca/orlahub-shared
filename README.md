# orlahub-shared

O contrato entre a API e o front: enums, DTOs (schemas Zod) e payloads dos
eventos de WebSocket. Publicado como `@quiosque/shared`.

Sem lógica de negócio, sem acesso a banco, sem UI — e sem importar `express`,
`pg` ou `react`.

## Rodar

```bash
pnpm install
pnpm build      # compila para dist/ (api e web dependem disto)
pnpm typecheck
```

Os outros dois repos consomem via `link:` local durante o desenvolvimento; ao
mudar algo aqui, rode `pnpm build` antes de checar os consumidores.

## Convenções

- Todo DTO é um schema Zod; o tipo TS deriva com `z.infer`. Uma definição, dois usos.
- Dinheiro em **centavos** (inteiro). Nunca float.
- Enums são objeto `as const` + tipo derivado, não `enum` do TS.
- IDs são `uuid`; datas viajam como string ISO.

Regras deste repo: `CLAUDE.shared.md`.
