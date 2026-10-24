# 003 — Navegação entre telas

Status: concluída
Atualização: 2026-10-23
Referências: README §§3–6, 8–9, 12; STYLE_GUIDE §3; docs/SDD.md.

## Objetivo e limites
Conectar as nove telas existentes por TanStack Router, preservando catálogo e prévia isolada.
Inclui: URLs, links, consulta de detalhe/carrinho/pedido, sessão simulada mínima, guards e retomada.
Fora: cadastro efetivo, mutations de perfil/carteiras/carrinho, compra, cupons, favoritos, Socket.IO, SSR e deploy.

## Contexto e decisões
- Observado: somente `/` está no roteador por código; demais views recebem espécimes na prévia.
- Adotar file-based routing em `src/core/router/routes/`, árvore gerada e plugin Vite antes de React, com autoCodeSplitting. Plugin 1.168.47 aceita Router 1.170.45 e Vite 8 sem atualização ampla. Custo: migrar uma rota. Code-based é válido, mas exige manter manualmente a árvore e divisão de código.
- Arquivos de rota configuram contexto/guards/loaders; containers nas features conectam views e contratos. Mesmo QueryClient para Router e React; Axios/MSW para dados. Catálogo mantém seu schema, cancelamento e atualização em segundo plano.
- URLs públicas: `/`, `/nfts/$nftId`, `/cart`, `/login`, `/register`. Privadas sob layout sem segmento: `/checkout`, `/account/profile`, `/account/wallets`, `/orders/$orderId` e `/orders/$orderId/confirmation`.
- Login/cadastro mantêm aparência modal desktop e página mobile. Fechar retorna ao catálogo salvo; não usa history.back sem fallback. Parâmetros do catálogo ficam na URL; último catálogo é lembrado por aba para links de retorno, inclusive após refresh de outra tela.
- `redirect` do login aceita somente URLs internas do produto validadas. Guards recuperam sessão via API antes de renderizar privados; API também autoriza recursos privados. Logout limpa cache privado. Expiração é reavaliada ao navegar, focar e recarregar.
- Contratos novos: GET/POST/DELETE `/session`; GET `/nfts/:id`, `/cart`, `/checkout`, `/orders/:id`. Carrinho inicial vazio; pedidos históricos determinísticos permitem consultar estados sem criar compra. Somente resposta confirmada pode renderizar recibo. Perfis usam identidade da sessão, carteiras sem persistência nesta etapa.
- Login aceita dois usuários fictícios; mock persiste apenas identidade/expiração, nunca senha. Cadastro e demais mutations exibem indisponibilidade. Prévia continua isolada, sem importar seus espécimes para produção.
- Fontes: [file-based](https://tanstack.com/router/latest/docs/routing/file-based-routing), [Vite](https://tanstack.com/router/latest/docs/installation/with-vite), [guards](https://tanstack.com/router/latest/docs/guide/authenticated-routes), Context7 `/tanstack/router`. Conferir APIs nos pacotes instalados; sem atualização ampla de versões.

## Critérios de aceite
- **CA-01:** Dado o catálogo filtrado, ao abrir um NFT por link e retornar, os parâmetros e controles são preservados; refresh e histórico funcionam. Links de header/mobile/breadcrumbs/conta conectam destinos tipados.
- **CA-02:** Dada qualquer URL prevista, acesso direto e refresh renderizam a tela/estado correspondente; URL/NFT/pedido inexistente mostram recuperação. Prévia mantém as nove apresentações.
- **CA-03:** Dado visitante, acesso privado aguarda sessão e leva ao login; credenciais válidas retomam URL interna com query/hash. Inválidas não autenticam; refresh recupera sessão; expiração/logout removem acesso e cache privado; outro usuário não lê recibo alheio.
- **CA-04:** Dado pedido pendente/recusado/inexistente, nenhum recibo confirmado aparece; pedido histórico confirmado usa snapshot da API. Operações não implementadas exibem indisponibilidade, sem criar pedidos.
- **CA-05:** Dados conectados passam por Axios/MSW e Query, com skeleton, falha/retry e vazio. Layouts não têm overflow em 390/768/1440; links e diálogos operam por teclado, com foco visível e fechamento previsível.
- **CA-06:** Build gera árvore e chunks de rota; tipos/lint/build/unitários/E2E pertinentes passam; documentação informa contratos, limites e fallback SPA.

## Tarefas
- [x] Configurar roteamento, contexto, links e containers (CA-01/02/06).
- [x] Implementar contratos de leitura e sessão mínima com falhas (CA-03/04/05).
- [x] Cobrir navegação e regressões com testes; atualizar evidências e documentação.

## Evidências
| Critério | Teste ou procedimento reproduzível | Resultado e referência |
| --- | --- | --- |
| CA-01 | `pnpm test:e2e`: casos `catalog links...` e `direct routes...` em 390/768/1440 px; regressões de filtros/histórico em [home.spec.ts](../tests/home.spec.ts) | Passou. Cards, header/mobile, breadcrumbs e conta navegam; query normalizada é preservada independentemente da ordem dos parâmetros. |
| CA-02 | [navigation.spec.ts](../tests/navigation.spec.ts): acesso direto/refresh de detalhe, carrinho, login/cadastro, checkout, perfil, carteiras e pedidos; 404; nove apresentações da prévia | Passou. Smoke Chromium do build também confirmou URLs públicas/privadas e home da prévia sem mudar sua URL externa. |
| CA-03 | [navigation.spec.ts](../tests/navigation.spec.ts): login inválido/válido, query/hash, refresh, expiração, logout, destino externo e troca Ana/Bruno; inspeção de `clearPrivateCache` e guards | Passou. Retomada interna preservada; sessão persistida sem senha; recibo alheio retorna 404. Guard aguarda API, chaves privadas incluem usuário e logout cancela/remove esse cache. |
| CA-04 | Caso `confirmed historical orders...`; checkout indisponível nas três larguras; feedback honesto existente de compra | Passou. Somente snapshot confirmado renderiza recibo; pendente/recusado/ausente não renderizam. Não existe mutation de pedido neste recorte. |
| CA-05 | `route loading...`, `session API outage...`, `links work by keyboard...`; suítes de home e prévia; inspeção do CSS de foco | Passou. Skeleton, HTTP 503/retry, vazio, teclado/trap de foco e fechamento; 27 referências visuais existentes preservadas, sem atualizar snapshots. Ausência de overflow nos casos parametrizados. |
| CA-06 | `pnpm typecheck`, `pnpm lint`, `pnpm build`, `pnpm test`, `pnpm test:e2e`; inspeção de `dist/assets/`; revisão de links/documentação | Passou: tipos/lint/build, 30 testes unitários e 52 E2E (2,7 min na execução final). Árvore gerada e chunks separados para as páginas; README/arquitetura/guia atualizados. |

### Inspeção
- Plugin 1.168.47 compatível com Router 1.170.45, Node 22.19.0 e Vite 8.3.5; configuração antes de React; árvore gerada ignorada pelo formatter/lint.
- Nenhuma importação de espécimes da prévia no Router/containers de produto. Cache compartilhado, services Axios e handlers MSW; sem sucesso de negócio embutido na UI.
- O diff visual revelou classes de botão não normalizadas nos links do header. A composição com `cn` foi restaurada; a referência original da home desktop voltou a passar sem alteração de baseline.
- StrictMode cancelava a consulta de sessão compartilhada com o guard. A consulta agora completa durante a desmontagem temporária do observador; cancelamento explícito antes do login descarta respostas anteriores. Refresh, expiração e retomada passaram depois da correção.

### Execução automatizada
- Comandos acima executados com sucesso; relatório HTML em `playwright-report/index.html` (local/ignorado pelo Git).
- Smoke adicional com Node/Playwright sobre `pnpm preview --host 127.0.0.1 --port 4181 --strictPort`: acessar `/`, `/nfts/nft-1`, `/cart`, `/register`; abrir perfil privado, autenticar pela UI; abrir carteiras, checkout, pedidos pendente/recusado/confirmado e recibo; recarregar recibo e abrir prévia da home. Passou, sem `pageerror` e com fallback HTTP 200 nas URLs do produto. Servidor temporário encerrado após a verificação.
- Links locais de README, ARCHITECTURE, STYLE_GUIDE e desta spec conferidos e válidos.

### Execução manual e verificações não executadas
Execução manual interativa: não realizada. A inspeção do diff de screenshot é separada da execução automatizada do navegador.
Não executados: deploy público/fallback em host publicado, Lighthouse, auditoria WCAG completa, integração com API real e comportamentos de negócio fora do recorte.
Pendências deste recorte: nenhuma. Compra, cadastro efetivo, persistência de mutations, favoritos e Socket.IO permanecem explicitamente fora desta entrega; o checkout/carrinho da API começam vazios.
