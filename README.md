# Desafio Frontend — Marketplace de NFTs

Implemente o **NFT Marketplace** em React e TypeScript, seguindo o [layout no Figma](https://www.figma.com/design/Ff0SksUi7UFtPWUO8kyNtw/Frontend-Challenge?node-id=0-1).

O desafio avalia fidelidade visual, qualidade das interações, integração com APIs, gerenciamento de estado assíncrono, tempo real, acessibilidade e performance.

Aplicação publicada: [Kurio na Vercel](https://frontend-challenge-junglegaming-gamma.vercel.app). A validação pública automatizada de compra, refresh e Socket.IO está registrada em [deployment-smoke.json](docs/deployment-smoke.json).

Código-fonte: [Palhares17/frontend-challenge-junglegaming](https://github.com/Palhares17/frontend-challenge-junglegaming).

## Executando o projeto

As nove telas estão integradas na aplicação principal com TanStack Router, Query, Axios, MSW e Socket.IO. Catálogo, cadastro/login/logout, favoritos, carrinho/cupom, perfil/avatar/senha e carteiras persistem na simulação. A compra usa conexão simulada de carteira, revisão da cotação, pedido idempotente, acompanhamento e recibo confirmado; preço/estoque e pedidos são sincronizados por eventos e reconciliados com REST. Blockchain, pagamento real, login social e recuperação de senha por e-mail não fazem parte desta demonstração.

A referência visual é o [Figma fornecido](https://www.figma.com/design/7jzy1utqt6Et0TTEOYmkcp/Untitled?node-id=1-661), diferente do link original. Contratos e cenários: [MOCK_API](docs/MOCK_API.md). Evidências finais: [conta/carrinho](specs/007-fluxos-conta-carrinho.md), [compra/tempo real](specs/008-compra-tempo-real.md) e [validação/entrega](specs/009-validacao-entrega.md).

Use Node.js 22.19.0 (registrado em `.node-version`) e pnpm 11.23.0. Instale as dependências com `pnpm install --frozen-lockfile` e inicie com `pnpm dev`.

| Comando | Finalidade |
| --- | --- |
| `pnpm dev` | Servidor de desenvolvimento |
| `pnpm typecheck` | Verificação de tipos |
| `pnpm lint` | Análise estática com oxlint |
| `pnpm build` | Verificação de tipos e build otimizado em `dist/` |
| `pnpm preview` | Servir o build otimizado localmente |
| `pnpm test` | Precisão ETH, estado na URL, destinos seguros e contratos REST via MSW/Axios |
| `pnpm test:e2e` | Chromium: catálogo, rotas, sessão, mocks persistentes, Socket.IO, prévia, teclado e regressão visual |
| `pnpm test:e2e:ui` | Interface interativa do Playwright |
| `pnpm assets:prepare` | Gerar originais WebP sem perdas e variantes responsivas com qualidade 90 |
| `pnpm audit:lighthouse` | Três medições por página/perfil; requer build servido em 4184 |
| `pnpm ui add <componente>` | Adicionar um primitivo shadcn em `src/core/components/ui/` |

Os estilos globais e os tokens ficam em `src/index.css`. Consulte `STYLE_GUIDE.md` para valores observados, decisões de implementação e pendências; o guia inclui registros históricos de etapas anteriores. A fonte Roboto Mono é servida localmente pelo build; sua licença acompanha a distribuição em `public/fonts/OFL-Roboto-Mono.txt`. As opções de API e ativação dos mocks estão em `.env.example`; por padrão, a aplicação usa `/api` e ativa MSW, exceto quando `VITE_ENABLE_MOCKS=false`.

Para executar os E2E pela primeira vez, instale o navegador com `pnpm exec playwright install chromium`. O Playwright inicia o Vite na porta 4173 e gera relatório em `playwright-report/`; falhas preservam trace e screenshot em `test-results/`. As referências visuais de 390, 768 e 1440 px estão em `tests/home.spec.ts-snapshots/`, `tests/design.spec.ts-snapshots/` e `tests/product-design.spec.ts-snapshots/` e foram produzidas no Chromium/macOS. Atualize-as intencionalmente com `pnpm test:e2e --update-snapshots` após conferir as imagens. Lighthouse: medianas de Performance 98/96 em mobile e 100/100 em desktop (início/detalhe); demais categorias 100. [Relatórios, metodologia e limites](docs/lighthouse/README.md). As baselines detectam regressões da implementação; não substituem a comparação com os frames do Figma.

A [auditoria de UI e UX](docs/auditoria-ui-ux.md) registra 11 defeitos e seu acompanhamento. As correções e os critérios verificáveis estão na [spec 005](specs/005-correcoes-auditoria-ui-ux.md); os testes de reprodução ficam em `tests/ui-audit.spec.ts` e podem ser executados com `pnpm test:e2e tests/ui-audit.spec.ts`.

### Prévia isolada para revisão visual

Com o Vite iniciado, abra **`/ui-preview.html`** no mesmo servidor e use o seletor de telas: detalhe do NFT, carrinho, pagamento, confirmação, login, cadastro, perfil e carteiras. A home também está disponível no seletor, com histórico em memória para não mudar a URL da prévia. A entrada principal `/` abre o catálogo e seus links navegam pelas rotas de produto.

A prévia usa estado local e espécimes em `src/core/preview/mocks/design.fixtures.ts`. `?screen=nft` seleciona a apresentação inicial; `&capture=1` oculta a barra de revisão para comparar capturas. Esses parâmetros pertencem à ferramenta de revisão e não criam rotas TanStack. O build emite `index.html`, `ui-preview.html`, `spa.html` e HTML inicial dos 239 detalhes públicos. O runtime continua uma SPA estática; páginas privadas e demais rotas usam o fallback `spa.html`.

Galeria, ampliação, abas, quantidade do detalhe, seleções de edição/carteira e visibilidade de senha podem ser inspecionadas. Operações de conta, carrinho, cupom e compra apresentam feedback de indisponibilidade. Os formulários têm labels e validação nativa de preenchimento, sem validar contratos de negócio. Os dados do recibo são ilustrativos; os totais mobile reproduzem o Figma, cuja soma de itens é inconsistente. Não são uma cotação nem um pedido efetivo.

Perfil, carteiras e confirmação em mobile, os layouts intermediários e a continuação do detalhe abaixo do recorte mobile são adaptações propostas, pois não há frames equivalentes. A documentação distingue essas decisões dos valores medidos.

### Cenários locais do catálogo

No console do navegador, execute `localStorage.setItem('kurio:mock-scenario', 'slow')` e recarregue para ver o carregamento. Substitua `slow` por `empty` (sem resultados), `error` (HTTP 503) ou `race` (busca Emerald em 1.500 ms e demais buscas em 100 ms). O cenário padrão responde em 250 ms; `slow` responde em 1.800 ms. Para restaurar o cenário padrão: `localStorage.removeItem('kurio:mock-scenario')` e recarregue. Esses cenários não alteram os dados; os novos controles de inventário descritos na API simulada permitem alterações persistentes de preço/estoque, revertidas pelo reset.

Os E2E usam contextos isolados e passam pelo Service Worker MSW e pelo Axios. O cenário de erro também permite restaurar o cenário padrão e usar **Tentar novamente**, sem recarregar. Na aplicação principal, os controles de negócio estão conectados à API. Para experimentar: abra um NFT, selecione a edição e compre/adicione ao carrinho; altere quantidades e aplique `KURIO10`; entre, cadastre uma carteira Ethereum válida (exemplo fictício: `0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`), conecte-a e use **Revisar compra** antes de **Confirmar compra**. O pedido evolui para confirmado em aproximadamente dois segundos no cenário padrão. Abra **Ver recibo**. Em timeout, use **Recuperar pedido**: a tentativa é preservada por usuário e aba, inclusive após refresh.

Favoritos são acessíveis no detalhe, no catálogo e pelo coração da navegação mobile. Perfil e carteiras permitem edição, com validação da API e persistência. Newsletter, artigos e demais ações auxiliares fora do escopo continuam com feedback de indisponibilidade.

### Rotas e sessão da demonstração

| URL | Acesso e comportamento atual |
| --- | --- |
| `/` | Público; catálogo e parâmetros de busca existentes |
| `/nfts/nft-1` | Público; detalhe por identificador da API; inexistente mostra recuperação |
| `/cart` | Público; edição, remoção e cupom; persistente e transferido ao autenticar |
| `/login`, `/register` | Públicos; cadastro e login integrados, modal desktop e página mobile |
| `/checkout` | Privado; conexão simulada, cotação, revisão e envio idempotente |
| `/account/profile`, `/account/wallets` | Privados; edição persistente de perfil/avatar/senha e até duas carteiras |
| `/orders/:orderId` | Privado; estado do pedido histórico |
| `/orders/:orderId/confirmation` | Privado; recibo somente para resposta `confirmed` da API |

Use `ana@kurio.test` ou `bruno@kurio.test`, ambos com senha fictícia `Kurio123!`. A sessão simulada dura 30 minutos e sobrevive a refresh. Guardas recuperam a sessão antes das telas privadas e preservam a URL interna de retorno, incluindo query/hash; destinos externos e ciclos de autenticação são descartados. **Sair**, na navegação da conta (também disponível em mobile), encerra a sessão e remove consultas privadas do cache. Sessões são reavaliadas ao navegar, focar a janela e recarregar.

Pedidos históricos da Ana: `demo-confirmed`, `demo-pending`, `demo-declined`; do Bruno: `demo-bruno` (confirmado). Por exemplo, abra `/orders/demo-confirmed` e entre como Ana para consultar o estado e seguir para o recibo. O outro usuário recebe 404. Esses registros históricos são cenários de leitura. O botão de compra cria novos pedidos com snapshot imutável. Estados pendente/recusado nunca mostram um recibo confirmado.

Para falhas das novas consultas e da sessão, use `localStorage.setItem('kurio:navigation-scenario', 'slow')` (1.800 ms) ou `'error'` (HTTP 503) e recarregue. Para recuperar, remova essa chave e use **Tentar novamente**; no login, reenvie o formulário. O catálogo continua usando os cenários próprios descritos acima.

Falhas no envio do login aparecem em um toast com `react-hot-toast`, no topo da tela, sem deslocar os campos. A mensagem distingue credenciais inválidas de falha do serviço, desaparece após cinco segundos e é removida ao reenviar ou sair do login. Os campos permanecem preenchidos para nova tentativa. Evidências na [spec do toast de login](specs/004-toast-erro-login.md).

Para expirar deterministicamente a sessão, remova `kurio:mock-session` do localStorage e navegue para uma tela privada ou recarregue. O reset integral agora é `POST /api/mock/reset` com `{preset:"default"}` ou `{preset:"populated"}`, seguido de refresh; confira o comando de console em [MOCK_API](docs/MOCK_API.md). Ele restaura banco, sessão e cenários sem limpar chaves externas. A API simulada persiste os dados dos recursos e digests de senha, sem senhas em claro; essa persistência não é autenticação de produção.

### Dados simulados completos

A [API simulada](docs/MOCK_API.md) documenta todos os endpoints, corpos, erros e controles. O preset `default` mantém a demonstração atual vazia; `populated` oferece itens no carrinho visitante e carteiras dos dois usuários. Login transfere os itens do visitante para a conta. `KURIO10` é o cupom válido e `EXPIRED` está expirado.

Use `localStorage.setItem('kurio:api-scenario', 'payment-declined')` para novos pedidos recusados, `'order-pending'` para manter pendente ou `'timeout-after-create'` para perder a primeira resposta depois da criação. `offline`, `error`, `timeout`, `session-expired`, `validation`, `conflict` e cenários de conexão de carteira também estão disponíveis. Restaure com `'default'` ou reset; detalhes e efeitos em [MOCK_API](docs/MOCK_API.md).

Os eventos usam `socket.io-client` e binding MSW, transporte WebSocket em `/socket.io/kurio`. Testes verificam eventos, duplicatas/antigos, reconexão e isolamento. A aplicação consome os eventos no cache, descarta versões antigas/duplicadas e reconcilia consultas ativas ao reconectar. Pedidos pendentes também são consultados a cada dois segundos, com interrupção ao atingir estado terminal.

### Acesso direto no deploy

O host estático deve servir os arquivos existentes primeiro (`/assets/*`, `/mockServiceWorker.js`, `/ui-preview.html`) e encaminhar as demais URLs da aplicação para `/spa.html`, mantendo o caminho original. No Netlify, a regra de fallback é `/* /spa.html 200` em `public/_redirects` (sem forçar sobrescrita dos arquivos). Na Vercel, configure o equivalente de fallback SPA; em um servidor próprio, use `try_files $uri $uri/ /spa.html`. `/api/*` precisa continuar destinado ao backend quando os mocks estiverem desativados.

Vite dev/preview oferecem fallback local; isso não comprova a configuração de um host publicado. A configuração Vercel está versionada em `vercel.json`. Na publicação, valide uma URL de detalhe e uma URL privada abertas diretamente, seu refresh e a disponibilidade do Service Worker.

Consulte [ARCHITECTURE.md](ARCHITECTURE.md) para composição dos componentes, contrato REST, cache e diferenças visuais adotadas. O enunciado original está mantido abaixo.

Verificação final: **62 testes unitários e 90 E2E passaram**, além de typecheck, lint, build e smoke público. [Relatório e limites](docs/testing/README.md).

## Desenvolvimento com specs curtas

Seguimos um [modelo enxuto de SDD](docs/SDD.md): uma spec por mudança de comportamento, com objetivo, limites, critérios de aceite, tarefas e evidências. Use o [template](specs/_template.md) e consulte o [piloto do catálogo](specs/001-validacao-catalogo.md). Ajustes triviais dispensam spec. As [orientações para agentes](AGENTS.md) aplicam esse fluxo ao trabalho no repositório.

## 1. Escopo

Entregue os fluxos de descoberta, compra e conta do colecionador, com versões desktop e mobile. APIs, autenticação, carteiras e pagamentos devem funcionar com dados simulados. Integrações reais com blockchain, extensões de carteira e gateways de pagamento estão fora do escopo.

O Figma define a identidade visual e a composição das telas. Este enunciado define os comportamentos e os cenários de avaliação. Estados não desenhados devem seguir o mesmo padrão visual.

## 2. Stack obrigatória

| Responsabilidade | Tecnologia |
| --- | --- |
| Interface | React |
| Linguagem | TypeScript |
| Roteamento | TanStack Router |
| Estado remoto | TanStack Query |
| Cliente HTTP | Axios |
| Integração de dados | REST APIs |
| Tempo real | Socket.IO |
| Estilização | Tailwind CSS |
| Componentes | shadcn/ui |
| Mocking | MSW |
| Testes E2E e regressão visual | Playwright |
| Auditoria de performance e qualidade | Lighthouse |

As tecnologias devem participar efetivamente da solução. A ferramenta de build, a organização do projeto e as bibliotecas complementares ficam a critério do candidato.

## 3. Telas e fluxos

| Tela | Funcionalidades obrigatórias |
| --- | --- |
| Início | Destaques, catálogo, busca, filtros, ordenação e navegação para o NFT |
| Detalhes do NFT | Galeria, informações, edição, quantidade, favoritos e compra |
| Carrinho de NFTs | Edição de quantidades, remoção, cupom e resumo de valores |
| Pagamento | Dados do colecionador, seleção de carteira e rede, revisão e envio do pedido |
| Confirmação de pedido | Resultado, identificação da transação, itens, taxas e total |
| Login | Autenticação, validação e retorno ao fluxo anterior |
| Cadastro | Criação de conta, validação e tratamento de conflito |
| Perfil do colecionador | Edição dos dados, avatar e alteração de senha |
| Carteiras | Cadastro e edição de carteiras principal e secundária |

Implemente os frames desktop e mobile disponíveis. Perfil, carteiras e confirmação também devem funcionar em mobile, mesmo sem um frame específico.

Páginas editoriais, suporte, atividade, ofertas e downloads não fazem parte da entrega. Links externos e ações auxiliares devem ter comportamento coerente; ações fora do escopo não devem aparentar sucesso funcional.

### Catálogo e detalhe

- Busca, filtros, ordenação e paginação devem compor o estado da URL e sobreviver a refresh e navegação pelo histórico.
- Filtros devem ser combináveis; mudança de filtro deve reiniciar a paginação.
- As consultas devem refletir os parâmetros enviados à API, com tratamento de resultados vazios, falhas e respostas fora de ordem.
- O detalhe deve suportar acesso direto, NFT inexistente, edição indisponível e limite de quantidade.
- Favoritos devem persistir para o usuário autenticado.

### Carrinho

- Adicionar, alterar e remover itens, respeitando a disponibilidade por NFT e edição.
- Manter o carrinho após refresh e preservar os itens do visitante ao autenticar.
- Aplicar e remover cupom, com tratamento de código inválido ou expirado.
- Exibir subtotal, desconto, taxa de rede e total coerentes com a resposta da API.
- Refletir alterações de preço e disponibilidade recebidas enquanto o carrinho estiver aberto.

Valores em ETH devem trafegar como strings decimais e manter precisão nos cálculos e na apresentação. Quantidades são inteiras. A cotação da API é a referência para finalizar o pedido.

### Pagamento e confirmação

- Validar os campos do layout e permitir revisão antes do envio.
- Utilizar as carteiras cadastradas, com seleção de rede e simulação de conexão, recusa e desconexão.
- Revalidar preço, disponibilidade, cupom e taxas antes de confirmar a compra. Mudanças devem exigir nova confirmação do usuário.
- Impedir pedidos duplicados em cliques repetidos ou reenvios após timeout.
- Representar pedido pendente, confirmado e recusado, com recuperação após refresh ou reconexão.
- Exibir a confirmação somente para pedido efetivamente confirmado na simulação.
- Preservar os itens em falhas; após confirmação, remover do carrinho apenas os itens e quantidades comprados.

O recibo deve reproduzir o snapshot do pedido. Alterações posteriores no catálogo não podem modificar seus valores. Referências de transação e links de exploração são simulados.

### Conta e sessão

Cadastro, login, logout e sessão são obrigatórios, integrados à API simulada. Checkout, perfil, carteiras, favoritos e pedidos exigem autenticação.

A sessão deve ser recuperável após refresh. Trate expiração durante a navegação e durante o checkout, preservando o contexto para retomada. Logout e troca de usuário devem limpar dados privados em cache e subscriptions da sessão anterior.

Valide os formulários de cadastro, perfil, senha e carteiras, incluindo erros retornados pela API. Alterações confirmadas devem permanecer após refresh. Use credenciais fictícias e não armazene senhas em claro.

## 4. Integração e estado

Use TanStack Router nas rotas, parâmetros de busca e proteção dos fluxos privados. Use TanStack Query nas consultas, mutations e sincronização do cache. As chamadas REST devem passar pelo Axios.

A solução deve garantir:

- contratos tipados entre transporte, estado e interface;
- estados de carregamento, vazio, erro, sucesso e atualização em segundo plano;
- invalidação coerente após mutations e eventos;
- cancelamento ou descarte de respostas obsoletas;
- isolamento dos dados por usuário e pelos parâmetros da consulta;
- recuperação de falhas sem duplicar operações;
- tratamento de rotas inexistentes e acesso direto a qualquer tela prevista.

Aplique atualização otimista em pelo menos uma interação, com rollback em caso de falha. A política de cache, retries e sincronização deve ser documentada.

## 5. Contratos REST

Defina e documente os contratos utilizados. Os recursos mínimos são:

| Recurso | Operações |
| --- | --- |
| Sessão e conta | Cadastro, login, consulta da sessão, logout e expiração |
| NFTs | Listagem com busca/filtros/ordenação/paginação e detalhe por identificador |
| Favoritos | Consulta, inclusão e remoção |
| Carrinho | Consulta, inclusão, alteração e remoção de itens |
| Cotação | Validação de cupom, disponibilidade, descontos, taxas e total |
| Pedidos | Criação idempotente e consulta do estado e recibo |
| Perfil | Consulta, atualização de dados/avatar e alteração de senha |
| Carteiras | Consulta, cadastro e atualização |

As respostas devem representar erros de validação, sessão inválida, falta de permissão, recurso inexistente, conflito de disponibilidade e falha transitória.

As mutations de pedido devem aceitar uma chave de idempotência. Na simulação, a mesma tentativa deve recuperar o mesmo pedido; reutilizar a chave com conteúdo diferente deve gerar conflito.

## 6. Mocking com MSW

Implemente os mocks na camada de rede, reutilizando contratos e cenários entre desenvolvimento, demonstração e testes. Componentes, hooks e cliente Axios não devem conter respostas fictícias ou caminhos alternativos de negócio.

Os mocks devem manter estado consistente entre catálogo, favoritos, carrinho, perfil, carteiras e pedidos. Persistência local é permitida para sustentar refresh; o reset deve restaurar integralmente um cenário conhecido.

### Simulating Network Conditions and Failures

Simule condições de rede e falhas com MSW, incluindo lentidão, latência variável, timeouts, indisponibilidade de conexão e respostas HTTP de erro. Os cenários devem ser configuráveis e reproduzíveis, permitindo avaliar o carregamento, o feedback de erro e a recuperação da interface.

Disponibilize fixtures com variedade suficiente para exercitar filtros e paginação, pelo menos dois usuários e cenários determinísticos de:

- sucesso e resultado vazio;
- latência variável e respostas fora de ordem;
- falhas de conexão e respostas HTTP 4xx/5xx;
- sessão expirada e acesso não autorizado;
- conflito de cadastro ou de validação de formulário;
- cupom inválido ou expirado;
- preço alterado ou edição esgotada durante a compra;
- timeout após criação do pedido, com recuperação por idempotência;
- pagamento confirmado e pagamento recusado.

Use MSW também na simulação dos eventos, com uma integração compatível com o protocolo Socket.IO, como [@mswjs/socket.io-binding](https://github.com/mswjs/socket.io-binding). Documente o transporte utilizado e suas limitações no ambiente de mocks.

Os cenários devem exercitar `socket.io-client`. Substituir o socket por chamadas diretas a setters, callbacks ou ao cache não atende ao requisito.

A camada de mocks deve ser ativada por configuração e estar disponível no build de demonstração. Mudanças nos dados simulados devem ser refletidas tanto nas respostas REST quanto nos eventos correspondentes.

## 7. Tempo real com Socket.IO

Implemente, no mínimo, os seguintes eventos:

| Evento | Comportamento esperado |
| --- | --- |
| `nft.updated` | Atualizar preço e disponibilidade no catálogo, detalhe e carrinho |
| `order.updated` | Atualizar o estado do pedido e apresentar confirmação ou recusa |

Os eventos devem carregar identidade estável, recurso afetado e versão. O cliente deve tolerar duplicatas e eventos antigos, sem regredir um estado mais recente nem reaplicar efeitos.

Após reconexão, reconcilie os recursos ativos com a API REST. Eventos de uma sessão anterior não podem atualizar dados de outro usuário. Listeners e subscriptions devem ser liberados ao encerrar seu ciclo de vida.

Implemente o cenário:

1. Um NFT está no carrinho.
2. Seu preço ou disponibilidade muda durante a navegação.
3. A interface informa a alteração e atualiza o resumo.
4. O checkout impede a confirmação com uma cotação desatualizada.

Também deve funcionar uma interrupção de conexão enquanto o pedido está pendente. Após reconectar ou recarregar a página, o usuário deve recuperar seu estado sem criar outra compra. Pedidos confirmados ou recusados são terminais.

## 8. Interface, responsividade e acessibilidade

Preserve tipografia, cores, espaçamentos, hierarquia, imagens, proporções e composição do Figma. Adapte os componentes shadcn/ui à identidade visual do projeto.

Todas as telas devem funcionar em desktop, tablet e mobile, com atenção a filtros, navegação, formulários, carrinho e checkout. Avalie, no mínimo, larguras de 390, 768 e 1440 pixels.

Use **skeletons com shimmer effect** nos componentes dependentes de dados durante o carregamento, incluindo catálogo, detalhe e resumo do carrinho. Preserve as dimensões do conteúdo para evitar deslocamentos de layout e respeite a preferência por movimento reduzido.

São obrigatórios:

- navegação por teclado e foco visível;
- controle de foco em diálogos e drawers;
- semântica adequada, labels e mensagens de erro associadas aos campos;
- alternativas textuais para imagens relevantes;
- contraste legível e estados não dependentes apenas de cor;
- feedback acessível para mutations e alterações em tempo real;
- ausência de overflow horizontal indevido e perda de conteúdo com zoom.

Use os assets do arquivo quando disponíveis e mantenha imagens e fontes necessárias acessíveis à execução local. Documente qualquer substituição de asset ou ajuste de acessibilidade em relação ao layout.

## 9. Testes com Playwright

Entregue testes E2E executáveis com os mocks, cobrindo:

1. Busca, filtros combinados, ordenação, paginação e restauração pelo histórico.
2. Acesso direto ao detalhe e tratamento de recurso inexistente.
3. Cadastro, login, expiração de sessão, logout e troca de usuário.
4. Favoritos, incluindo falha de mutation e recuperação do estado.
5. Carrinho, quantidades, remoção, cupom e persistência após refresh/login.
6. Compra completa, do catálogo ao recibo confirmado.
7. Falha de pagamento, clique repetido e timeout com recuperação do mesmo pedido.
8. Edição de perfil, avatar, senha e carteiras, com erros de validação.
9. Alteração de preço/disponibilidade via Socket.IO durante o checkout.
10. Eventos duplicados ou antigos, desconexão e retomada de pedido pendente.
11. Navegação por teclado, foco de diálogos e validação de formulários.
12. Skeletons durante carregamento lento, feedback de falha e recuperação após nova tentativa.

Execute os fluxos principais em Chromium, nos viewports desktop e mobile. Inclua regressão visual de início, detalhe, carrinho e pagamento, com baselines versionadas e dados estáveis.

Cada teste deve partir de um estado isolado. Controle relógio, latência e disparo dos eventos nos cenários sensíveis a tempo. Entregue relatório HTML e traces das falhas.

As verificações devem observar a interface e os resultados das operações. Os testes de tempo real precisam passar pelo cliente Socket.IO e os de REST pelos handlers MSW.

## 10. Performance e Lighthouse

Audite início e detalhe do NFT com Lighthouse em perfis mobile e desktop, usando build otimizado e o cenário padrão dos mocks.

| Categoria | Meta |
| --- | ---: |
| Performance | ≥ 90 |
| Accessibility | ≥ 95 |
| Best Practices | ≥ 95 |
| SEO | ≥ 90 |

Execute três medições por página e perfil e reporte a mediana de cada categoria. Versione a configuração da auditoria e entregue relatórios HTML/JSON, versões das ferramentas, ambiente e condições de execução.

Registre LCP, CLS e TBT. Justifique resultados abaixo das metas e identifique as causas. A auditoria deve carregar as imagens, fontes e funcionalidades da entrega, sem simplificações exclusivas para melhorar a pontuação.

## 11. Critérios de avaliação

| Critério | Pontos | Evidência esperada |
| --- | ---: | --- |
| Fidelidade visual e responsividade | 20 | Aderência ao Figma e consistência entre tamanhos de tela |
| Fluxos e experiência de uso | 20 | Compra e conta completas, validações e recuperação de erros |
| Integração e estado | 15 | Router, Query, Axios, contratos e cache coerentes |
| Tempo real | 10 | Eventos, reconexão, ordenação e sincronização com REST |
| Mocking | 10 | MSW, cenários determinísticos, persistência e reset |
| Testes | 10 | Cobertura dos fluxos e falhas com Playwright |
| Acessibilidade | 5 | Operação por teclado, semântica, foco e feedback |
| Performance | 5 | Resultados e análise das auditorias Lighthouse |
| Arquitetura e documentação | 5 | Tipagem, responsabilidades e execução reproduzível |
| **Total** | **100** | |

São eliminatórios: ausência de uso efetivo da stack obrigatória, fluxos principais apenas visuais, compra confirmada sem resposta da simulação, exposição de dados entre usuários, eventos simulados diretamente na UI ou ausência de testes E2E executáveis.

## 12. Entrega

Entregue código-fonte, lockfile, assets, mocks, fixtures, testes e configurações de auditoria.

O **deploy é obrigatório**. Envie o link do repositório e uma URL pública da aplicação. Recomenda-se [Vercel](https://vercel.com/docs/frameworks/frontend/vite); [Netlify](https://docs.netlify.com/build/frameworks/framework-setup-guides/vite/) e [Cloudflare Pages](https://developers.cloudflare.com/pages/framework-guides/deploy-a-react-site/) também são aceitos.

A versão publicada deve corresponder ao código entregue e permanecer acessível durante a avaliação, com os mocks e os fluxos de tempo real funcionando. Acesso direto e refresh das rotas devem funcionar no ambiente publicado.

O `README.md` da solução deve conter setup, variáveis de ambiente, credenciais fictícias, seleção e reset dos cenários, comandos de execução e instruções para reproduzir os fluxos de falha.

Documente os contratos REST e eventos, a política de sessão, o estado do carrinho, a estratégia de cache e a reconciliação entre REST e Socket.IO. Registre limitações, decisões de UX e eventuais desvios do Figma em `ARCHITECTURE.md`.

Disponibilize comandos para desenvolvimento com mocks, build, preview, verificação de tipos, lint, testes Playwright e auditoria Lighthouse.

A entrega deve executar a partir de um checkout limpo, sem depender de serviços privados ou do backend de produção.
