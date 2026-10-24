# 007 — Conta, favoritos e carrinho pela interface

Status: concluída
Atualização: 2026-10-24
Referências: README §3–6, §8–9; docs/SDD.md; contratos em docs/MOCK_API.md.

## Objetivo e limites

Conectar as telas existentes aos contratos REST/MSW de conta, favoritos e carrinho. Preservar a composição visual e a prévia isolada. Integrações reais permanecem fora do desafio.

## Contexto e decisões

- A API persistente já existe; as ações de negócio das telas ainda informam indisponibilidade.
- Services tipados e Query coordenam mutations, invalidação e isolamento por sessão; favoritos usam atualização otimista com rollback.
- Erros da API aparecem associados aos campos; formulários preservam entradas na falha. Avatar aceita PNG/JPEG/WebP até o limite do contrato.

## Critérios de aceite

- **CA-01:** Dado visitante, cadastro valida/conflita, autentica e retorna ao fluxo; troca de sessão limpa dados privados.
- **CA-02:** Dado usuário, perfil/avatar/senha e até duas carteiras podem ser alterados e persistem após refresh; erros não aparentam sucesso.
- **CA-03:** Dado NFT/edição, carrinho adiciona/altera/remove e aplica/remove cupom com totais da API, limites e persistência; login preserva itens visitantes.
- **CA-04:** Dado favorito autenticado, toggle persiste; falha reverte a mudança otimista e informa recuperação.

## Tarefas

- [x] Conectar services, hooks e formulários (CA-01/02/03/04).
- [x] Cobrir fluxos e falhas na UI com Playwright.
- [x] Executar checks e atualizar documentação/evidências.

## Evidências

| Critério | Verificação automatizada | Resultado |
| --- | --- | --- |
| CA-01 | flows.spec.ts: registration associates validation errors; navigation.spec.ts: login/expiração/logout/troca | Cadastro/confirmação de senha/conflito, login e retorno exercitados por MSW/Axios e UI. |
| CA-02 | flows.spec.ts: cadastro → perfil/ENS/avatar/senha → duas carteiras → edição/refresh/novo login | Passou; persistência e erros associados aos campos. |
| CA-03 | flows.spec.ts: catálogo → carrinho/cupom/refresh/login → recibo, 390 e 1440; remoção mobile; mocks.spec.ts | Passou; totais autoritativos, merge, remoção de cupom/itens e estado vazio. |
| CA-04 | flows.spec.ts: favorites persist/rollback/privacy e lista mobile | Passou no caso final após corrigir a espera pela recuperação de sessão antes de abrir a lista. |

Inspeção: contratos, handlers, services, hooks e views. Capturas de produto em 390/768/1440 conferidas; 12 baselines novas em product-design.spec.ts-snapshots. Variantes responsivas revisadas e baselines afetadas atualizadas intencionalmente.
Execução manual interativa independente: não realizada. Testes de interface foram automatizados em Chromium.
Checks: typecheck, lint, build e 62 testes unitários passaram. Rodada integral final: `pnpm test:e2e --output=/private/tmp/kurio-final-isolated --reporter=list,html`, 90 passaram em 5,4 min. Relatório em docs/testing/e2e/index.html.
Pendências deste recorte: nenhuma.
