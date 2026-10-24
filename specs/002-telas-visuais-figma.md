# 002 — Telas visuais do Figma, antes das rotas

Status: concluída
Atualização: 2026-10-23
Referências: README §3/§8, STYLE_GUIDE §2/§9, skill local kurio-figma-to-code.

## Objetivo e limites

Concluir os componentes visuais dos 15 frames do arquivo Figma fornecido pelo usuário, preservando a home existente. Inclui detalhe, carrinho, pagamento, recibo, login, cadastro, perfil e carteiras, com as variantes responsivas verificadas.
Não criar novas rotas TanStack, conexões de navegação, endpoints, autenticação, persistência, compras ou eventos. Esses fluxos serão implementados na etapa posterior solicitada pelo usuário.

## Contexto e decisões

- Figma verificado: contexto detalhado e screenshots dos 13 frames restantes, registrados no inventário do STYLE_GUIDE. As capturas pendentes de login desktop e detalhe mobile foram obtidas nesta etapa.
- Componentes nucleares com props/callbacks tipados; peças comuns de formulários, conta, galeria, quantidades e resumo financeiro permanecem compartilhadas quando houver consumidores reais.
- Dados ilustrativos ficam em mocks de apresentação, fora das views; não representam cotação, sessão ou pedido confirmado. O recibo é somente um espécime visual fornecido explicitamente à prévia.
- Prévia separada em `ui-preview.html`, com seletor de telas para revisão e testes; não altera o Router nem integra fluxos de negócio. A aplicação principal permanece na home.
- Perfil, carteiras e recibo mobile não possuem frames próprios: a adaptação será identificada como proposta. Controles locais podem alternar edição, quantidade, abas, visibilidade de senha e seleções, sem simular operações de negócio.

## Critérios de aceite

- **CA-01:** As oito novas composições e suas variantes desktop/mobile representam os respectivos frames com assets locais e tokens existentes; o código mantém core/feature e componentes reutilizáveis.
- **CA-02:** A prévia permite inspecionar todas as telas sem criar rotas de negócio; ações pendentes informam indisponibilidade e não simulam sucesso.
- **CA-03:** Em 390/768/1440 px, não há overflow horizontal ou conteúdo cortado; inputs têm labels, controles operam por teclado e diálogos gerenciam foco.
- **CA-04:** Comparações renderizadas, verificação de assets, tipos, lint, build e regressões pertinentes da home são executadas e registradas; adaptações sem frame e limitações ficam explícitas.

## Tarefas

- [x] Obter contexto completo e screenshots dos frames restantes.
- [x] Extrair assets e compor peças compartilhadas e telas.
- [x] Preparar prévia isolada com dados ilustrativos e ações honestas.
- [x] Conferir responsividade/fidelidade e executar verificações.
- [x] Registrar evidências e atualizar documentação.

## Evidências

| Critério | Verificação | Resultado |
| --- | --- | --- |
| CA-01 | Contexto e screenshot MCP dos 13 frames; comparação das oito apresentações desktop em 1440 px e das cinco variantes mobile em 414 px; manifesto local e inspeção core/feature | Concluído por inspeção e execução no Chromium |
| CA-02 | `ui-preview.html`, inspeção de `core/router/router.tsx` e testes de compra/autenticação com feedback explícito | Concluído; sem rotas novas ou endpoints |
| CA-03 | 24 combinações de tela/largura sem overflow, assets quebrados ou mídia externa; inspeção de adaptações mobile/tablet; teclado, senha, foco e validação nativa | Concluído; retenção de foco conferida aguardando o redirecionamento assíncrono do Base UI |
| CA-04 | `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build`, `pnpm test:e2e`; smoke do build em 4175 | Tipos/lint/build aprovados; 12 unitários e 38 E2E aprovados; oito telas + home abertas no build sem page errors |

## Registro de comparação e decisões

- Capturas renderizadas em `/private/tmp/kurio-ui-review/` comparadas aos screenshots MCP. São artefatos locais temporários, não arquivos de produto. Referências de regressão duráveis em `tests/design.spec.ts-snapshots/` (24 imagens) e `tests/home.spec.ts-snapshots/` (três imagens).
- Conferidos desktop de detalhe, carrinho, pagamento, confirmação, login, cadastro, perfil e carteiras; mobile de detalhe, carrinho, pagamento, login e cadastro em 414 px, como nos frames. Em 390/768/1440 px, as capturas representam a aplicação adaptada. Baselines da própria aplicação detectam regressão; não demonstram por si só fidelidade ao Figma.
- O manifesto contém 243 referências, 116 caminhos únicos, 112 SVGs e quatro imagens originais. Inspeção XML confirmou existência e dimensões nativas de todos os SVGs, sem divergências. Busca por URLs temporárias no código não encontrou ocorrências. E2E confirmou que imagens/fontes carregam localmente.
- Corrigidos por comparação: margens de breadcrumbs, espaçamento específico dos formulários, proporção dos cards, metadados do recibo, camadas multiply dos cards mobile, gradientes de ações, posição da barra mobile e suavização da Roboto Mono. As três baselines da home foram atualizadas intencionalmente pela suavização global, mantendo suas dimensões e dados.
- Limite mínimo de quantidade desabilita diminuir. A remoção destacada mobile substitui aumentar, evitando sobreposição de alvos. O foco amplia o alvo sem ampliar o SVG. Estados de foco/seleção não desenhados são propostas.
- Perfil, carteiras e recibo mobile, tablet, continuação do detalhe e estados interativos locais são propostas. Mobile do Figma repete o primeiro rótulo `1/10`; a prévia preserva o texto. Quantidade máxima 99 é um limite ilustrativo a substituir pela disponibilidade. Totais mobile de 8,92/8,936 ETH reproduzem o espécime inconsistente; não são uma cotação calculada.
- Não houve auditoria Lighthouse, leitor de tela ou conformidade WCAG completa, nem comparação automática pixel a pixel com o Figma. Permanecem as metas e premissas registradas no STYLE_GUIDE §14: mobile 4G como referência, LCP ≤ 2500 ms, INP ≤ 200 ms, CLS ≤ 0,1 no p75, orçamento proposto de 200 KB gzip, Lighthouse Performance ≥ 90/Accessibility ≥ 95, WCAG AA sob responsabilidade de cada implementador. Não são resultados alcançados nesta etapa.

Pendências de produto fora desta entrega: rotas, proteção de sessão, contratos, autenticação, validações de negócio, carrinho persistente, cotação, pedido e Socket.IO. As composições já têm props e callbacks para essas conexões.


## Execuções finais

- `pnpm typecheck` e `pnpm lint`: aprovados após a última alteração de código.
- `pnpm test`: 12 testes aprovados em dois arquivos; precisão ETH e schema da home preservados.
- `pnpm test:e2e`: 38 testes aprovados em 44,5 s, sem atualizar snapshots nessa execução final. Inclui 24 combinações das novas telas, três capturas da home, interações locais, teclado, galeria, retorno de foco, validação nativa e regressão dos fluxos REST/MSW existentes.
- `pnpm build`: aprovado; emite `index.html` e `ui-preview.html`. Aviso de chunk compartilhado de 616,99 kB minificado / 201,74 kB gzip; chunk específico da prévia 70,03 kB / 21,02 kB gzip. MSW permanece em chunk separado de 153,90 kB gzip. Otimização e Lighthouse permanecem pendentes, fora do recorte visual.
- Smoke no build otimizado em `127.0.0.1:4175`: oito telas novas retornaram HTTP 200, decodificaram imagens/fontes locais e abriram sem erros de página; catálogo da home também carregou pelo MSW.
- Inspeção do Router: somente a rota `/` existente. Busca de imports de features em `core/components/`: nenhuma ocorrência. Não foram feitos commit, push ou deploy.
