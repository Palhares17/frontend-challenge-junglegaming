# 008 — Compra completa e sincronização em tempo real

Status: concluída
Atualização: 2026-10-24
Referências: README §3–9; docs/SDD.md; docs/MOCK_API.md.

## Objetivo e limites

Concluir checkout e retomada de pedidos pela UI, consumindo REST e Socket.IO existentes. Nenhum pagamento/blockchain real.

## Contexto e decisões

- Cotação e pedido são autoritativos na API; revisão explícita antecede envio.
- Tentativa idempotente preservada em sessionStorage por usuário, sem senha, para retomada após timeout/refresh. Payload permanece imutável até resultado conhecido.
- Eventos versionados invalidam recursos ativos; duplicatas/antigos são descartados. Reconexão reconcilia via REST; sessão antiga perde subscriptions.

## Critérios de aceite

- **CA-01:** Dado carrinho/carteira, conexão e formulário válidos geram cotação para revisão e pedido; apenas confirmed permite recibo imutável.
- **CA-02:** Dada cotação alterada/expirada, compra exige nova revisão; recusa preserva carrinho; cliques repetidos/timeout recuperam o mesmo pedido.
- **CA-03:** Dado evento nft.updated, catálogo/detalhe/carrinho/checkout atualizam com aviso; duplicatas/antigos não regridem estado.
- **CA-04:** Dada interrupção/refresh/sessão expirada, reconexão recupera recursos/pedido sem nova compra e sem dados de outra conta.

## Tarefas

- [x] Checkout, revisão, idempotência e retomada.
- [x] Subscriptions e reconciliação Query/REST.
- [x] E2E pelos botões, falhas e transportes; documentação.

## Evidências

| Critério | Verificação automatizada | Resultado |
| --- | --- | --- |
| CA-01 | flows.spec.ts: compra de catálogo até recibo em 390/1440; deployment-smoke.mjs sobre build em 4184 | Passou; carteira criada/conectada pela UI, cotação/revisão/envio, confirmação e recibo após refresh. |
| CA-02 | flows.spec.ts: preço/estoque alterados, taxa alterada na API, recusa, dblclick, timeout/refresh | Passou; nova revisão exigida, recusa preserva itens e chave recupera o mesmo pedido sem baixa duplicada. |
| CA-03 | flows.spec.ts: preço/estoque/replay; mocks.spec.ts: Socket.IO e REST | Passou; interface informa mudanças e lê REST, replays antigos/duplicados não regridem a revisão. |
| CA-04 | flows.spec.ts: reconexão/pedido pending/refresh e expiração no checkout; navigation.spec.ts: sessão/troca/isolamento | Passou nos casos afetados; recuperação sem nova compra e recursos de outra conta não são exibidos. |

Inspeção: cotação, tentativa persistida, callbacks por sessão, limpeza de listeners e reconciliação. Descoberta e correção do carregamento prematuro de socket.io-client antes do MSW; o import agora ocorre após bootstrap. O carrinho compartilhado com loader mantém sua promise durante o unmount temporário do StrictMode.
Execução manual interativa independente: não realizada. Testes de UI, REST e Socket.IO foram automatizados em Chromium.
Checks: typecheck, lint, build e 62 testes unitários passaram. Smoke do build completo, sem módulos de teste injetados, confirmou compra/UI/eventos e zero pageerror.
Rodada integral final: 90 E2E passaram em 5,4 min, incluindo 39 referências visuais. Smoke público passou na Vercel sem autenticação do host, zero pageerror; evidência em docs/deployment-smoke.json.
Pendências deste recorte: nenhuma.
