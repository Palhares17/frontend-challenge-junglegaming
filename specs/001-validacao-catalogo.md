# 001 — Validação do catálogo

Status: concluída
Atualização: 2026-10-23
Referências: [README §3, §4, §6, §8 e §9](../README.md), [guia visual](../STYLE_GUIDE.md).

## Objetivo e limites

Comprovar busca, filtros, ordenação, paginação e recuperação do catálogo já implementado, corrigindo divergências encontradas nesse recorte.
Inclui: estado de URL, consulta REST e feedback do catálogo. Fora deste recorte: detalhe, favoritos, compra e Socket.IO, que continuam exigidos pelo desafio em entregas futuras.

## Contexto e decisões

- Observado por leitura: [schema](../src/feature/home/schemas/catalog-search.schema.ts), [home](../src/feature/home/views/home.page.tsx), [hook](../src/feature/home/hooks/use-catalog.ts), [service](../src/feature/home/services/list-nfts/list-nfts.service.ts) e [handler MSW](../src/feature/home/mocks/catalog.handlers.ts).
- Contrato existente: `GET /api/nfts`, com `q`, `collection`/`network` repetidos, `min`/`max` em strings ETH, `sort`, `tab` e `page`; resposta tipada em [CatalogResponse](../src/feature/home/entities/catalog.entity.ts).
- Observado na criação do piloto: cenários MSW `default`, `slow`, `empty` e `error` via `localStorage['kurio:mock-scenario']`, sem configuração/suíte Playwright. Durante a implementação da home foram adicionados configuração e testes; as evidências finais serão registradas abaixo.
- Em validação: preservar os cenários e incluir `race`, com busca Emerald em 1.500 ms e demais buscas em 100 ms, para comprovar cancelamento de consulta obsoleta pelo transporte Axios. Cada teste usa contexto isolado do navegador; não há respostas simuladas na UI.
- Suposição do piloto: preservar os valores padrão do schema; critérios novos não redefinem os filtros iniciais. A validação acompanha o pedido atual de componentes funcionais da home; não amplia a entrega para os demais fluxos.

## Critérios de aceite

- **CA-01:** Dada uma combinação com resultados conhecidos nas fixtures, ao buscar, combinar coleção/rede, ordenar e paginar, a URL e os parâmetros REST representam a seleção e a UI exibe os itens e a ordem esperados. Ao alterar um filtro na página 2, a paginação volta a 1.
- **CA-02:** Dada uma URL de catálogo, ao acessar diretamente, recarregar e usar voltar/avançar, os controles e resultados correspondem aos parâmetros restaurados; parâmetros inválidos seguem a normalização do schema sem quebrar a tela.
- **CA-03:** Dadas as buscas A e B disparadas nessa ordem, com A mais lenta, ao B finalizar e A ser cancelada ou finalizar depois, a URL e os resultados permanecem em B. Conteúdo anterior durante atualização tem feedback visível.
- **CA-04:** Dado carregamento lento ou zero resultados, a UI apresenta skeleton na carga inicial ou mensagem de vazio; limpar busca/filtros permite recuperar resultados. Com movimento reduzido, o skeleton fica estático.
- **CA-05:** Dada falha HTTP, a UI informa o erro; ao restaurar o cenário de sucesso e tentar novamente, o catálogo se recupera sem perder a seleção vigente.
- **CA-06:** Em 390, 768 e 1440 px, busca, filtros, ordenação e paginação permanecem utilizáveis sem overflow horizontal; no drawer mobile, teclado permite abrir, operar, fechar e retornar o foco ao acionador.

## Tarefas

- [x] Configurar execução Playwright com servidor e mocks, comando no package.json e isolamento de cenário por teste.
- [x] Preparar fixtures/latência determinísticas e cobrir URL, integração REST e respostas obsoletas (CA-01 a CA-03).
- [x] Cobrir carregamento, vazio, movimento reduzido, erro e recuperação (CA-04 e CA-05).
- [x] Conferir viewports/teclado e adicionar verificações pertinentes (CA-06); corrigir os problemas comprovados.
- [x] Registrar evidências, executar typecheck/lint/build e atualizar documentação de execução.

## Evidências

| Critério | Verificação planejada | Resultado |
| --- | --- | --- |
| CA-01 | `tests/home.spec.ts`: pagination, combined filters, sort, refresh and history; desktop/mobile search | Passou. Confere parâmetros repetidos, rede dos itens, ordem e reset da página. Asserção do menor preço corrigida para 0,99 ETH: os itens de 0,39 ETH não pertencem à rede Ethereum nas fixtures. |
| CA-02 | `tests/home.spec.ts`: direct URL is normalized and desktop search restores after refresh; teste de histórico combinado; testes do schema | Passou. Acesso direto inválido, refresh e voltar/avançar preservam a seleção normalizada. |
| CA-03 | `tests/home.spec.ts`: a newer search cancels the stale Axios request | Passou. Cenário `race`, Emerald lento e Sage rápido; requisição Emerald termina com `ERR_ABORTED`, URL e todos os itens permanecem em Sage. Há feedback de atualização. |
| CA-04 | `tests/home.spec.ts`: mobile search can return empty results; slow loading respects reduced motion | Passou. Busca inexistente retorna vazio pelo MSW; limpar recupera itens; o relógio Playwright pausa a latência durante a inspeção do skeleton estático sob movimento reduzido e depois retoma a resposta. Isso impede que o nó seja removido entre a seleção e a leitura do estilo. |
| CA-05 | `tests/home.spec.ts`: slow loading respects reduced motion and 503 can recover without a reload | Passou. Erro 503 real do handler, restauração para cenário padrão e retry pela UI. |
| CA-06 | `tests/home.spec.ts`: home loads original artwork and fits 390/768/1440px; mobile drawer traps focus | Passou. Todos os assets de imagem decodificados, nenhuma exceção de página/overflow; comparação com baselines locais; Tab permanece no drawer, slider responde ao teclado, Escape retorna o foco ao acionador e Aplicar fecha o drawer e atualiza a URL. |

**Teste automatizado:** `pnpm test:e2e` — 10 testes passaram em Chromium/macOS, incluindo comparação visual sem atualização de baselines. A execução usa um worker e limite de 60 s por teste composto para acomodar a disputa de recursos do ambiente local; esse limite não é uma medição de performance da aplicação. `pnpm test` — 12 casos de precisão monetária e normalização passaram. Relatório HTML em `playwright-report/`, com traces de falhas habilitados. As referências visuais são da home, não das demais telas exigidas para a entrega completa.

**Inspeção e execução local:** contextos e screenshots desktop/mobile foram obtidos pelo MCP; a renderização local foi comparada e refinada. Chromium também abriu o build otimizado: 9 cards, `GET /api/nfts` com HTTP 200, zero exceções de página e nenhum overflow adicional em 320 px. Os testes de interação foram automatizados; não se declara uma sessão manual independente de QA.

**Verificações gerais:** `pnpm typecheck`, `pnpm lint` e `pnpm build` passaram. O build alerta para chunk de aplicação acima de 500 kB minificado; limites de performance e demais recortes estão em `ARCHITECTURE.md`.

**Não executado:** auditoria WCAG completa, Lighthouse e testes de outras telas, autenticação, compra ou Socket.IO. Não são critérios deste piloto.

Pendências deste piloto: nenhuma. Os demais requisitos do desafio permanecem pendentes e não são declarados concluídos por esta spec.
