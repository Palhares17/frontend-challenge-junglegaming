# Arquitetura — Kurio

## Home e integração atual

A home usa Vite + React + TypeScript, Tailwind v4 e primitivas shadcn/ui sobre Base UI. Foi implementada a partir dos frames [desktop 1:661](https://www.figma.com/design/7jzy1utqt6Et0TTEOYmkcp/Untitled?node-id=1-661) e [mobile 1:1531](https://www.figma.com/design/7jzy1utqt6Et0TTEOYmkcp/Untitled?node-id=1-1531). O arquivo é diferente daquele vinculado no enunciado; não presumimos equivalência das demais telas.

A aplicação principal conecta as nove telas com leitura e mutations REST. Os fluxos atuais estão nas specs [007](specs/007-fluxos-conta-carrinho.md), [008](specs/008-compra-tempo-real.md) e [009](specs/009-validacao-entrega.md). As seções datadas abaixo são registros históricos dos recortes anteriores. A prévia visual continua isolada; os indicadores do hero permanecem decorativos.

## Componentes nucleares e composição

| Camada | Caminho | Responsabilidade |
| --- | --- | --- |
| Primitivos | `src/core/components/ui/` | Button, Input, Select, Dialog, Slider e Skeleton adaptados aos tokens globais |
| Peças compartilhadas | `src/core/components/general/` | Icon, IconButton, Brand, NftArtwork, EthPrice, NftCard, SearchField, CatalogPagination, navegação e footer |
| Infraestrutura | `src/core/{lib,entities,hooks,providers,router,services,mocks}/` | Assets, precisão ETH, contratos comuns, feedback, Router, Axios e bootstrap MSW |
| Feature | `src/feature/home/views/components/` | Hero, filtros, faixa de preço, toolbar, catálogo, feedback, skeleton, destaque, promoções e editoriais |
| Estado e transporte da feature | `src/feature/home/{schemas,entities,hooks,services,mocks}/` | Normalização da URL, contrato da listagem, TanStack Query, operação REST, fixtures e handler |

Uma peça possui uma responsabilidade e recebe dados/callbacks tipados. `NftCard` compõe imagem, preço e botão de ícone; `CatalogFilters` compõe grupos e faixa de preço; a página apenas conecta seções ao estado da rota. Não criamos pastas vazias para features futuras. A organização segue a referência `app-pj/app`, adaptada ao Router e ao build deste projeto.

Componentes compartilhados não importam a feature. Por exemplo, as coleções do footer são recebidas por props. Estilos próprios do card e da navegação acompanham esses componentes; a folha da home contém apenas composição e estilos específicos da tela.

## Estado, REST e cache

O TanStack Router controla `q`, `collections`, `networks`, `min`, `max`, `sort`, `tab` e `page` na URL. O schema sanitiza valores desconhecidos, duplicatas, páginas inválidas e limites invertidos. O filtro inicial é Arte digital, como no frame. Mudar busca/filtro/ordenação/aba reinicia a página; mudar apenas a página preserva a seleção. Refresh e histórico restauram os controles.

`GET /api/nfts` recebe `q`, `collection` e `network` repetidos, `min`/`max` em strings decimais ETH, `sort=recent|price-asc|price-desc`, `tab=all|new|trending` e `page`. A API retorna `{ items: Nft[], total, page, pageSize: 9, facets: { collections, networks } }`; o contrato está em `catalog.entity.ts`. Os valores monetários permanecem strings. Ordenação e comparação no mock usam inteiros `bigint` em wei; apenas o slider representa centésimos inteiros e serializa-os sem aritmética fracionária.

O Axios recebe o AbortSignal da consulta e tem timeout de 10 s. A chave Query contém todo o estado da busca, impedindo mistura de resultados entre seleções. `staleTime=30 s`, retenção padrão do Query de 5 min, refetch padrão ao remontar/focar/reconectar quando obsoleto e `retry=false`. A nova consulta mantém o resultado anterior com indicador **Atualizando catálogo…**; paginação fica desabilitada enquanto os dados forem provisórios. Carga inicial apresenta skeleton, erro permite retry manual e resultado vazio permite limpar filtros. O catálogo continua sem mutations; sessão e consultas privadas acrescentadas na etapa de rotas estão descritas abaixo.

MSW é iniciado antes do React, em desenvolvimento e no build de demonstração. `VITE_ENABLE_MOCKS=false` desativa-o; `VITE_API_URL` muda a base do Axios (padrão `/api`). MSW 3 usa `onUnhandledFrame: 'bypass'`. O mock local intercepta `*/api/nfts`; uma API com outro prefixo requer ajustar esse contrato. Os cenários documentados no README alteram somente a rede; componentes e hooks não contêm fixtures. A ordem `recent` é a ordem estável das fixtures, sem datas de negociação simuladas.

## Fidelidade e decisões de UX

- Assets originais foram extraídos pelo MCP para `public/assets/figma/`. Os quatro PNGs permanecem intactos; as versões WebP preservam os mesmos pixels, verificados pelo script `assets:prepare`. A fonte vem do Fontsource, com licença local. Não há URLs temporárias do Figma em runtime.
- Desktop preserva container de 1.200 px, hero de 450 px, filtros de 310 px, separação de 48 px e grade de três colunas. Os cards suportam composição quadrada e retrato; o quarto slot usa a variação em retrato observada no frame. Contêineres, imagens e raios variam por componente, conforme o guia.
- Mobile preserva margens de 24 px, hero de 190 px, dois cards por linha com coluna direita deslocada 32 px e navegação fixa. O drawer de filtros/ordenação, a composição em 768 px e as seções abaixo do recorte mobile são propostas responsivas: não foram medidas em frames equivalentes.
- As fixtures mantêm os primeiros nomes/preços do desktop. O frame mobile contém nomes repetidos e outra imagem no quarto slot; foi adotado um catálogo único entre larguras. O nome ausente do oitavo item recebeu **Golden Frequency #071**. Há 239 itens determinísticos, com 33 na coleção inicial. Contagens de redes são calculadas desses dados, em vez de copiar números inconsistentes do layout. O badge **6** do carrinho foi omitido por não existir carrinho implementado.
- O filtro selecionado recebe um pequeno marcador de seleção além da cor. Botões de ícone têm alvo de toque ampliado mantendo o desenho original. Diálogos possuem título, descrição, retenção e retorno de foco; slider possui nomes e valores em ETH. Estados novos e foco são propostas, não estados observados no Figma.
- A página pode crescer e rolar; o frame mobile de 896 px e seus cantos externos são apresentação do mockup. Rodapé e cards editoriais acomodam o texto completo, aceitando pequenas diferenças de altura. Não há corte fixo do conteúdo para reproduzir a borda do frame.

## Evidências e limites

Testes unitários verificam precisão ETH e normalização da URL; Playwright verifica REST/MSW, filtros, busca, ordenação, paginação, cancelamento, histórico, estados e teclado. Há referências visuais em 390/768/1440 px. A [spec do catálogo](specs/001-validacao-catalogo.md) registra evidências por critério. Relatórios e traces são locais e não versionados.

As metas propostas são LCP ≤ 2.500 ms, INP ≤ 200 ms, CLS ≤ 0,1 e Lighthouse conforme README; não são resultados medidos. O primeiro build da home emite cerca de 198,5 kB gzip de aplicação e 153,9 kB gzip de MSW em um chunk carregado separadamente no bootstrap da demonstração. As quatro imagens WebP sem perdas somam cerca de 5 MB. O Vite informa chunk de aplicação acima de 500 kB minificado. Divisão de bundle, imagens responsivas e auditorias permanecem pendentes; não afirmamos atingir as metas de performance ou uma auditoria WCAG completa.


## Telas visuais, antes das rotas — 23/10/2026

A [spec 002](specs/002-telas-visuais-figma.md) cobre os 13 frames restantes do arquivo fornecido na conversa. `src/core/preview/main.tsx` e `ui-preview.html` compõem uma entrada de revisão separada; `src/core/router/router.tsx` permanece com a rota existente da home. O seletor da prévia troca componentes com estado React, sem representar navegação de produto.

| Camada | Componentes e responsabilidade |
| --- | --- |
| `core/components/form` | FormField, LabeledInput, PasswordInput, SelectField, EnsInput e CollectorFields; campos rotulados e composição reutilizada em pagamento, perfil e carteiras |
| `core/components/general` | MarketplaceShell, AccountShell, AccountSidebar, MobilePageHeader, Breadcrumbs, QuantityControl, NftItemIdentity, OrderItems, OrderTotals e NftCollectionStrip |
| `feature/nft` | Galeria, ampliação, edição, avaliação, informações, abas e controles de compra |
| `feature/cart` | Linha do carrinho, cupom e resumo de valores |
| `feature/checkout` | Campos do colecionador, carteiras salvas e provedores de carteira |
| `feature/auth` | Formulário, opções sociais, marca Google com SVGs originais, apresentação modal desktop e página mobile |
| `feature/orders` | Recibo e metadados da transação ilustrativa |
| `feature/profile` e `feature/wallets` | Avatar, alteração de senha, cadastro visual de carteira e estado vazio da secundária |

As páginas recebem entidades de apresentação e callbacks tipados. Quantidade, edição, seleção de carteira/provedor e visibilidade de senha são controles locais. As peças compartilhadas não importam features. A prévia faz a composição de exemplos e o fundo de autenticação reutiliza peças de apresentação da home; não há serviço HTTP alternativo nem fixtures embutidas nas views.

Os valores em ETH continuam strings e `OrderTotals` apenas apresenta uma cotação recebida. Não calcula, confirma ou persiste pedidos. O recibo é um espécime estático da prévia, nunca consequência de clicar em comprar. A alteração de quantidade no carrinho, cupons, conta, avatar e operações de carteira aguardam contratos e integração na próxima etapa.

`figma-assets.ts` reúne 243 referências extraídas dos frames, deduplicadas em 116 arquivos locais (112 SVGs e quatro imagens originais). SVGs mantêm suas dimensões nativas; os slots ao redor controlam posicionamento e área de toque. Imagens das entidades usam as versões WebP sem perdas já existentes. A dupla camada com `multiply` do carrinho mobile é aplicada com a mesma imagem fornecida ao componente. A suavização de fonte no body foi ajustada para se aproximar da renderização do Figma, mantendo família e pesos medidos.

A remoção destacada no terceiro item mobile substitui o botão de aumentar naquele estado de apresentação; não sobrepõe dois alvos interativos. O mínimo de quantidade desabilita diminuir. Foco, estados selecionados e diálogos são propostas acessíveis para estados não desenhados. Não há uma simulação completa de sessão, cotação, pagamento ou Socket.IO nesta etapa.

O build inclui um chunk específico da prévia, carregado apenas por `ui-preview.html`; o código das novas telas não entra no módulo da home. O chunk comum permanece acima de 500 kB minificado. Otimização de bundle e Lighthouse continuam pendentes; as metas já documentadas não são resultados medidos.

Na execução final desta etapa, o chunk compartilhado ficou em 201,74 kB gzip e o módulo específico da prévia em 21,02 kB gzip. Tipos, lint, build, 12 testes unitários e 38 E2E passaram. O smoke do build abriu as oito apresentações e a home sem erros de página.


## Navegação por arquivos — 23/10/2026

Rotas em `src/core/router/routes/` são adaptadores pequenos para os containers de cada feature. `routeTree.gen.ts` é gerado pelo plugin, versionado para `pnpm typecheck` em checkout limpo e ignorado pelo lint/formatter; não deve ser editado. O Vite executa o plugin antes de React, com `autoCodeSplitting: true`. O Router instalado é 1.170.45; plugin 1.168.47 tem peer `^1.170.45`, aceita Vite 8 e Node >=20.19. A versão 1.168.48 do plugin exige Router ^1.170.46 e não foi adotada. O projeto permanece SPA React/Vite.

**Escolha:** file-based reduz manutenção manual da árvore e habilita divisão automática de componentes. Code-based suportaria os mesmos recursos e seria válido; migrar uma única rota existente tem custo pequeno diante das oito novas telas. A organização por features permanece: a pasta do Router declara URLs/guards/loaders e as features mantêm views, containers, consultas e services. Os componentes compartilhados consultam um contexto opcional de navegação, sem importar features; fora do contexto mantêm callbacks de apresentação da prévia.

Referências consultadas na web e no Context7 (`/tanstack/router`): [árvore por arquivos](https://tanstack.com/router/latest/docs/routing/file-based-routing), [plugin Vite](https://tanstack.com/router/latest/docs/installation/with-vite), [autenticação](https://tanstack.com/router/latest/docs/guide/authenticated-routes), [coordenação de dados externos](https://tanstack.com/router/latest/docs/guide/external-data-loading). As APIs também foram conferidas no código dos pacotes instalados: Query 5.104.5 dispõe de `queryClient.query`, usado nos loaders, em vez das APIs imperativas depreciadas.

### URLs, apresentação e estado

Públicas: `/`, `/nfts/$nftId`, `/cart`, `/login`, `/register`. O layout sem segmento `_authenticated` protege `/checkout`, `/account/profile`, `/account/wallets`, `/orders/$orderId` e `/orders/$orderId/confirmation`. A raiz oferece 404, skeleton e recuperação de erro. Os containers leem o mesmo cache usado pelos loaders com `useSuspenseQuery`; não criam cópias do estado remoto.

Catálogo mantém `validateSearch`, suas chaves de cache, cancelamento e `keepPreviousData`. Não foi convertido para loader bloqueante, preservando a experiência de atualização existente. A última seleção normalizada é lembrada em sessionStorage (`kurio:catalog-search`) para compor links de volta ao catálogo; quando `/` está aberta, a URL é a fonte de verdade. Atualizar filtros mantém o reset de página existente. Fechar autenticação/recibo e o retorno mobile usam destinos explícitos com fallback, sem depender de histórico anterior.

Login/cadastro reutilizam a apresentação modal desktop e página mobile; a troca entre ambos usa links tipados. A prévia mantém seus callbacks e espécimes isolados, inclusive para autenticação, e sua home usa uma instância do Router com histórico em memória. Nenhuma fixture de `core/preview` é importada pelas rotas de produto.

Na aplicação, a autenticação desktop reutiliza `CatalogHome`, a composição real da home, com a última seleção normalizada do contexto de navegação e a mesma consulta de catálogo. Os loaders redundantes de catálogo padrão foram removidos das rotas de autenticação; acesso direto usa a seleção lembrada ou o padrão validado. Abrir, alternar e fechar essas rotas preserva scroll; depois de montar o catálogo no fechamento, o foco retorna ao link Entrar com `preventScroll`. A área interna do painel pode rolar, enquanto o fechamento permanece fora dela. A prévia isolada continua usando `AuthMarketplaceBackdrop`. Ver [spec 005](specs/005-correcoes-auditoria-ui-ux.md).

Erros do envio de login usam `react-hot-toast` no callback `onError` de cada `mutate`, descartado quando a tela desmonta. `AppToaster`, em `core/components/general`, é montado uma vez pela aplicação e usa portal no body para ficar acima dos portais de diálogo. Sua região viva já existe quando o modal abre, preservando o anúncio acessível. O identificador `login-error` limita o feedback a um toast; reenvio e desmontagem removem a mensagem anterior. Cores vêm dos tokens existentes, com duração de cinco segundos; contratos e erros de outras operações permanecem como antes. Ver [spec 004](specs/004-toast-erro-login.md).

### Contratos acrescentados

| Endpoint | Resposta e limites |
| --- | --- |
| `GET /api/session` | `{ user: { id, name, email } | null }`; sessão expirada retorna null |
| `POST /api/session` | `{ email, password }` → sessão; 401 para credenciais inválidas |
| `DELETE /api/session` | 204 após encerrar; falhas não simulam logout bem-sucedido |
| `GET /api/nfts/:id` | `{ nft: NftPresentation, related: Nft[] }`; 404 quando ausente |
| `GET /api/cart` | `{ items: [], totals: OrderTotals, related: Nft[] }`; valores zerados, sem mutations |
| `GET /api/checkout` | `{ items: [], totals: OrderTotals, wallets: [] }`; exige sessão, 401 quando inválida |
| `GET /api/orders/:id` | `{ id, status: pending|declined }` ou `{ id, status: confirmed, receipt }`; 401 sem sessão, 404 ausente ou de outra conta |

Handlers de rede usam o catálogo simulado como origem dos detalhes e pedidos históricos próprios. O recibo é um snapshot separado, com totais ETH em strings, anterior às consultas de catálogo. A renderização de confirmação verifica o discriminante `confirmed`; pendente/recusado mostram estado e links de recuperação, inclusive ao acessar diretamente a URL de confirmação. Não há endpoint de criação de pedido neste recorte, nem compra simulada na UI.

### Sessão, cache e recuperação

`RouterContext` recebe o mesmo QueryClient do QueryClientProvider. `beforeLoad` do layout privado consulta a sessão com freshness zero antes de liberar seus filhos. A API simulada também autoriza checkout/pedidos. A sessão possui dois usuários fictícios e validade de 30 minutos; o mock persiste somente identidade/expiração. A senha de demonstração é comparada por digest SHA-256, sem armazenamento em claro. A simulação não implementa cookies HttpOnly nem um backend de autenticação real.

`redirect` é validado por uma lista de rotas internas, rejeitando origens externas, caminhos malformados e destinos de login/cadastro que criariam ciclos. Query/hash internos são preservados. Antes de login cancela-se a consulta anterior da sessão para descartar respostas atrasadas. A consulta compartilhada de sessão não consome AbortSignal automaticamente: a desmontagem temporária do observador no StrictMode não pode cancelar a promise aguardada pelo guard. Demais consultas de dados continuam encaminhando o sinal ao Axios.

Chaves privadas começam com `['private', userId, ...]`. Logout navega para o catálogo e cancela/remove essas consultas; login limpa o cache anterior antes da retomada. Guard sem sessão e respostas 401 também revogam dados privados. O observador da raiz revalida ao focar; guards revalidam ao navegar e refresh cria um cliente novo. Não há subscriptions Socket.IO nesta etapa.

Política: cache remoto de 30 s por padrão, retries automáticos desativados e retenção padrão Query de 5 min. Sessão e carrinho têm freshness zero. `defaultPreload='intent'` e `defaultPreloadStaleTime=0` delegam freshness ao Query; links privados desativam preload para não iniciar recuperação de sessão/dados privados apenas ao passar o ponteiro. Skeleton aparece em cargas de rota demoradas; 404 separa inexistência de falha transitória, e o botão de recuperação reseta o error boundary do Query e invalida os loaders. Os cenários `kurio:navigation-scenario=slow|error` operam na camada MSW e são independentes dos cenários do catálogo.

### Entrega e limites

O README registra URLs, credenciais, pedidos históricos, reset e fallback SPA para acesso direto no host estático. Build inclui chunks separados para as páginas. Deploy público, Lighthouse, compra completa, persistência de mutations e tempo real não foram executados neste recorte. Evidências automatizadas e eventuais pendências constam na spec 003; registros das etapas anteriores acima permanecem históricos.

Validação final da navegação: tipos, lint, build, 30 testes unitários e 52 E2E passaram. As 27 referências visuais existentes foram preservadas; o smoke Chromium sobre o build confirmou acesso direto/refresh, sessão, pedidos e prévia sem erros de página. Execução manual interativa, deploy e Lighthouse não foram realizados.


## Dados simulados consistentes — 24/10/2026

A [spec 006](specs/006-dados-mockados.md) e [MOCK_API](docs/MOCK_API.md) registram o estado atual da camada de dados, posterior aos recortes históricos acima. `core/mocks/database.ts` é a persistência versionada; `accounts.ts`, `cart.ts` e `orders.ts` concentram as invariantes da simulação. Handlers das features usam essas transações e contratos compartilhados em `core/entities/marketplace.entity.ts`. `handlers.ts` compõe HTTP, controles e WebSocket para browser e testes Node. Views, hooks e Axios não contêm fixtures ou simulação alternativa de sucesso.

O banco preserva o catálogo original e os pedidos históricos e acrescenta estoque/edições, perfis, digests de senha, carteiras, favoritos, carrinhos, cotações, reservas e tentativas idempotentes. Cada operação relê o estado e só persiste depois de validar. Valores ETH usam bigint internamente e strings no transporte; estoque é reservado na criação e liberado em recusa. Snapshot e resultado terminal não mudam em reenvios. Prazos de pedidos ficam no banco, permitindo avanço pela API após refresh; a simulação não depende de callbacks da UI. Concorrência distribuída entre abas/processos não é uma garantia do localStorage.

Carrinho visitante é transferido uma única vez no login. Como a consulta de carrinho passa a conter dados da conta, `clearPrivateCache` também cancela/remove `['cart']` na troca de sessão, além do prefixo privado existente. A política anterior de cache/retry permanece. Conexões de carteira são encerradas ao sair ou iniciar nova sessão; registros das carteiras persistem.

`core/realtime/socket.ts` cria cliente tipado com conexão explícita; a UI futura deverá subscrever, descartar versões antigas/duplicadas, reconciliar REST ao reconectar e liberar listeners. O mock usa o binding publicado 0.2.0 (API `toSocketIo`), default namespace, WebSocket e texto, com heartbeat Engine.IO. MSW 3 remove o prefixo `/socket.io/` no matching; path de rede `/socket.io/kurio` corresponde ao handler lógico `/kurio`. Um token de sessão recebido pela API vincula cada conexão autenticada; revogação encerra o namespace antigo. Mutações e eventos partem do mesmo estado; replays não alteram REST.

O binding declara peer MSW ^2.10.2; o projeto mantém MSW 3.0.3 e documenta a compatibilidade exercitada pelos testes, sem ocultar o aviso de peer. Não há polling, anexos binários, acknowledgements ou namespaces customizados neste recorte. Endpoints de controle só existem com MSW ativado. Consulte MOCK_API para presets/reset, cenários e limitações.

O escopo entrega a camada de dados: botões/formulários continuam aguardando integração de mutations. Não foi implementado consumo global dos eventos no Query, atualização otimista da UI, compra completa pelos botões, Lighthouse ou deploy.


## Integração final — 24/10/2026

Services das features encapsulam as mutations Axios. Query coordena cache e pending/error; formulários usam os nomes dos controles para associar erros de validação da API. Perfil e senha têm envios separados para evitar sucesso parcial silencioso. Avatar valida MIME/tamanho antes da API e aceita remoção explícita. Carteiras expõem apelido, endereço, rede e papel principal/secundário conforme o contrato; campos ilustrativos sem uso no contrato foram substituídos no fluxo funcional, mantendo a prévia para comparação do desenho original. Checkout mostra os campos necessários e carteiras em desktop e mobile, com revisão de itens/total antes do envio.

Favoritos usam atualização otimista: cancelar consulta, guardar snapshot, aplicar toggle, reverter na falha e reconciliar com REST. Botões aguardam a mutation; erros não aparentam persistência confirmada. Carrinho usa respostas autoritativas para itens/totais e invalida checkout. O badge representa a quantidade real. Sessão e carrinho compartilhados com loaders não abortam o transporte no unmount temporário do StrictMode; cancelamentos explícitos de cache ainda descartam respostas ao trocar de usuário. Queries de catálogo/detalhe/perfil/carteiras preservam AbortSignal. As chaves privadas incluem userId e callbacks verificam a sessão que iniciou a operação.

A interface pode montar enquanto o MSW inicia; uma barreira de infraestrutura segura todas as requisições Axios até o adaptador estar pronto. Não há fixtures/atalhos de negócio no cliente HTTP. O cliente Socket.IO é importado depois dessa barreira, pois captura WebSocket no carregamento do módulo. Cada sessão possui uma conexão/listeners próprios. Eventos com versão menor ou igual à já recebida são descartados; eventos aceitos invalidam recursos ativos para ler REST autoritativo. Reconexão reconcilia catálogo, carrinho e consultas privadas. Logout/expiração/troca removem cache e subscriptions anteriores. Pedidos pendentes têm polling REST de dois segundos como recuperação adicional; estados terminais não fazem polling.

Checkout mantém cotação e revisão separadas. Mudança nos itens/totais/cupom exige nova revisão; expiração/taxa/estoque também são validados atomicamente na API. Uma tentativa grava chave de idempotência e payload imutável em sessionStorage antes de enviar; se o armazenamento falhar, não envia. Timeout/refresh oferecem recuperação da mesma tentativa. Respostas 4xx definitivas liberam nova revisão; 401 conserva o contexto para login. Uma trava síncrona e botão pending impedem envios repetidos; a API garante idempotência mesmo em reenvios. O acompanhamento limpa a tentativa ao observar resultado terminal. Só a resposta confirmed renderiza recibo.

Os PNGs e WebP originais sem perdas permanecem disponíveis. Variantes de 320/640/960 px usam WebP qualidade 90 e srcset/sizes conforme a apresentação; a ampliação pode carregar o original. Essas variantes reduzem tráfego sem remover assets do fluxo auditado. Lighthouse mede o mesmo build e os mocks completos, servido por HTTP com gzip. Metodologia, relatórios e desvios em docs/lighthouse/README.md.


## HTML público inicial e runtime SPA

A spec 010 acrescenta pré-renderização estática no build, usando os mesmos componentes React, loaders Query/Axios e handlers MSW em Node. Cada render recebe seu próprio QueryClient anônimo; somente home e os 239 detalhes públicos são gerados. Não há backend de SSR em produção. `spa.html` preserva uma entrada vazia para rotas privadas, carrinho, autenticação e recursos desconhecidos; a prévia mantém sua própria entrada.

O fluxo usa as APIs oficiais de SSR/hidratação do TanStack Router, incluindo a transferência serializada do cache Query. A hidratação só é usada quando caminho e busca correspondem ao HTML; buscas diferentes usam a montagem SPA e a URL como fonte de verdade. CSS das telas é agrupado no build para evitar conteúdo sem estilo antes da hidratação. A raiz pré-renderizada fica inert até a montagem dos controles, evitando cliques antes dos listeners.

Um HTML estático pode ser mais antigo que o staleTime. As datas de atualização do cache inicial são renovadas na hidratação para não acrescentar indicadores de refetch durante a comparação do DOM; após a montagem, o fluxo normal revalida sessão/carrinho e a primeira conexão Socket.IO reconcilia os recursos com REST. O preço inicial público não autoriza uma compra: cotação, estoque, carteira, idempotência e confirmação continuam exclusivamente na API da simulação.

`prerender-check.mjs` inspeciona ausência de dados privados no HTML e adianta o relógio do navegador em uma hora para provar que um snapshot antigo hidrata sem erros. `deployment-smoke.mjs` aguarda a recuperação real da sessão no carregamento/refresh e exercita compra, eventos, URLs com busca e fallback, sem importar módulos privados ou injetar clientes no build. A flag de mocks desativados mantém o fallback SPA e dispensa a geração de dados simulados.


Evidências finais de performance: medianas Lighthouse mobile 98 (início) e 96 (detalhe); desktop 100/100, demais categorias 100. Relatórios de três medições por página/perfil em docs/lighthouse. A configuração conserva o perfil mobile padrão da ferramenta e usa os assets e funcionalidades normais. O cache público e a sessão foram testados após refresh e com relógio adiantado, sem erro de hidratação. O build com `.env.production` desativando mocks também foi verificado numa cópia temporária: somente SPA/fallback, sem HTML de fixtures.

Referências de implementação: [SSR do TanStack Router](https://tanstack.com/router/latest/docs/framework/react/guide/ssr) e [integração de dados/cache](https://tanstack.com/router/latest/docs/framework/react/guide/external-data-loading), conferidas também nas fontes instaladas.
