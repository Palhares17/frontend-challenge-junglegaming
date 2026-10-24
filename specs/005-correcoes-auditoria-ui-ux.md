# 005 — Correções dos defeitos confirmados na auditoria de UI e UX

Status: concluída
Atualização: 2026-10-23
Referências: README §8–9; STYLE_GUIDE; docs/auditoria-ui-ux.md (UI-01 a UI-11).

## Objetivo e limites

Corrigir os 11 defeitos confirmados na auditoria autorizada pelo usuário, preservando identidade visual, rotas e integrações existentes.
Inclui modais, fundo do catálogo, foco, contraste, rótulos, espaçamento e metadados. Sugestões S-01–S-05, hipóteses H-01/H-02 e funcionalidades de negócio pendentes não integram este recorte.

## Contexto e decisões

- Observado: autenticação usa um catálogo diferente ao fundo, painel com altura mínima sem rolagem e fechamento sem retorno de foco; outros defeitos têm causas locais documentadas na auditoria.
- Implementado: reutilizar a composição real do catálogo com a seleção lembrada na autenticação de produto; manter os espécimes da prévia isolada. Preservar rolagem nas transições de autenticação e devolver foco ao Entrar após o catálogo montar.
- Implementado: limitar o painel à janela, com área interna rolável e fechamento acessível; reservar espaço para fechar nos títulos; utilizar o token de input já existente e tinta escura sobre cobre com contraste suficiente.
- Contratos/estado: sem mudanças de API, sessão, compra ou persistência. Corrigir apenas estados de apresentação e navegação/foco indicados; uma carteira salva/selecionada não implica conexão real com provedor.
- O conteúdo 1/1 da edição desktop também identifica a mesma opção no mobile. O recibo distribui os metadados sem fragmentar descrições em colunas artificiais de 73 px.

## Critérios de aceite

- **CA-01 (UI-01/UI-04):** Dada uma janela baixa ou título longo, ao abrir um diálogo, todas as ações são alcançáveis por rolagem/teclado, o fechamento permanece acessível e seu alvo não invade o texto do título.
- **CA-02 (UI-02/UI-03):** Dado o catálogo com filtros/ordenação e posição de rolagem, ao abrir, alternar e fechar autenticação desktop, a composição ao fundo preserva conteúdo e geometria; o retorno preserva seleção/rolagem e restaura foco visível no Entrar. Acesso direto continua com catálogo válido como fallback.
- **CA-03 (UI-05/UI-06):** Dados cupom e campos sem foco, os textos de Aplicar mantêm contraste ≥4,5:1 no gradiente; a pista visual necessária para delimitar campos vazios mantém contraste ≥3:1, com foco visível preservado.
- **CA-04 (UI-07/UI-08/UI-11):** Sem carteira salva, o checkout informa o estado vazio; em 390/768/1440 as edições têm identidades distintas/coerentes; rotas da conta não marcam Início como página atual.
- **CA-05 (UI-09/UI-10):** Em 639/640/768/1440 os metadados do recibo permanecem legíveis sem fragmentar “demonstração”; Salvar carteira possui padding horizontal consistente e não causa overflow em 390/768/1440.
- **CA-06:** Login, guards, feedback de indisponibilidade, consulta de pedidos e prévia continuam funcionando sem sucesso fictício de negócio; tipos, lint, build e testes pertinentes aprovam.

## Tarefas

- [x] Implementar as correções mínimas (CA-01–CA-05).
- [x] Exercitar foco/contexto e os limites da auditoria; revisar capturas e atualizar baselines afetadas (CA-01–CA-06).
- [x] Finalizar revisão de evidências e links da documentação (131 destinos locais válidos).

## Evidências

| Critério | Teste ou procedimento reproduzível | Resultado e referência |
| --- | --- | --- |
| CA-01 | Autenticação em 1024/1440 × 600; título editorial longo e teclado | Testes `auth actions remain reachable` e `long dialog title` em [ui-audit.spec.ts](../tests/ui-audit.spec.ts) aprovados. Opções sociais alcançáveis, fechar dentro do viewport e corpo imóvel. Título sem interseção em 390/768/1440. [Janela baixa](../docs/auditoria-ui-ux/correcoes/12-auth-janela-baixa.png), [título/foco](../docs/auditoria-ui-ux/correcoes/04-titulo-modal-1440.png). Execução manual também confirmou scroll interno e foco. |
| CA-02 | Catálogo filtrado/ordenado → login/cadastro → fechamento por botão/Escape; foco e scroll | Teste `auth keeps the filtered catalog` aprovado: igualdade dos retângulos/textos/scroll e URL normalizada; foco no Entrar após os dois fechamentos. Acesso direto validado nos testes de navegação e janela baixa. [Antes](../docs/auditoria-ui-ux/correcoes/10-catalogo-antes-auth.png) / [durante](../docs/auditoria-ui-ux/correcoes/11-catalogo-durante-auth.png). Na execução manual, h1 em x=160/y=168 antes/durante e foco restaurado. |
| CA-03 | Estilos computados, contraste dos extremos do gradiente e campos; capturas | Testes `editions and coupon` e `account controls` aprovados em 390/768/1440. Texto do cupom compacto ≥4,90:1 e contorno do perfil ≈6,72:1 contra o fundo; CSS dos demais formulários inspecionado e capturas revisadas. [Cupom](../docs/auditoria-ui-ux/correcoes/05-cupom-390.png), [perfil](../docs/auditoria-ui-ux/correcoes/06-perfil-1440.png). |
| CA-04 | Checkout vazio, edições e navegação da conta nos três viewports | Testes `editions and coupon` e `account controls` aprovados: rótulos únicos e seleção por teclado; estado vazio explícito em 390/768, sem grupo vazio e com navegação para carteiras; Início inativo no menu desktop da conta. [Checkout vazio](../docs/auditoria-ui-ux/correcoes/08-checkout-vazio-390.png). |
| CA-05 | Recibo em torno de 640 px e botão de carteira; capturas | Testes `receipt wallet description` aprovados em 390/639/640/768/1440: largura disponível comporta demonstração, sem overflow. Padding de Salvar carteira ≥20 px nos três viewports. [Recibo 640](../docs/auditoria-ui-ux/correcoes/09-recibo-640.png), [carteiras 390](../tests/design.spec.ts-snapshots/wallets-390-darwin.png). |
| CA-06 | Typecheck, lint, build, unitários e E2E pertinentes | `pnpm typecheck`, `pnpm lint`, `pnpm build` e `pnpm test` (30 unitários) aprovados. `pnpm test:e2e`: 73 aprovados sem atualizar snapshots, incluindo login, guards, erros, pedidos e prévia. Os 15 testes novos da auditoria foram repetidos para gerar as capturas; não somados como casos diferentes. |

Regressão visual: 22 referências revisadas e atualizadas; cinco preservadas. A referência de carrinho desktop também incorpora a altura da newsletter já corrigida antes deste recorte, registrada no STYLE_GUIDE; o componente não foi alterado novamente. Suíte completa aprovada após a atualização.

Documentação afetada: [relatório e acompanhamento por achado](../docs/auditoria-ui-ux.md), [STYLE_GUIDE](../STYLE_GUIDE.md), [ARCHITECTURE](../ARCHITECTURE.md) e [README](../README.md).

Limites: capturas e navegação manual no navegador integrado; E2E no Chromium/macOS com MSW. Zoom real de 200%, leitores de tela, scrollbars clássicas em outros sistemas, demais navegadores e Lighthouse não verificados. Sugestões/hipóteses da auditoria e integrações de negócio pendentes não foram implementadas. Não há alegação de conformidade WCAG completa.
Pendências deste recorte: nenhuma. A repetição final dos 15 testes da auditoria incluiu título longo nas três larguras e aprovou; conteúdo e links revisados.
