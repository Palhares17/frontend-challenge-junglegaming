# Análise dos requisitos e pendências

Data: 23/10/2026. Escopo: comparar o enunciado do README, a documentação e as specs existentes com o código local e executar as verificações disponíveis. Esta análise não implementa novos comportamentos.

> Atualização posterior: a [spec 006](../specs/006-dados-mockados.md) e [API simulada](MOCK_API.md) acrescentam dados persistentes, endpoints e transporte Socket.IO em 24/10/2026. A matriz abaixo é o retrato histórico da análise de 23/10; a integração de UI continua pendente.

## Diagnóstico

A base visual, o catálogo, a navegação e a sessão simulada estão implementados. O marketplace ainda não atende à entrega completa: as operações de compra e de manutenção da conta continuam predominantemente visuais, e tempo real, auditorias Lighthouse e deploy permanecem pendentes.

As quatro specs concluídas comprovam recortes específicos: catálogo, apresentações visuais, navegação/sessão e toast de login. Elas não representam a conclusão de todos os requisitos do desafio.

A suíte E2E também não está inteiramente aprovada no estado atual: duas diferenças visuais desktop persistiram na repetição dos casos. Os detalhes estão na seção de verificação abaixo.

Fontes: [README](../README.md), [arquitetura](../ARCHITECTURE.md), [guia visual](../STYLE_GUIDE.md), [SDD](SDD.md), [orientações locais](../AGENTS.md), specs 001–004, contratos, handlers MSW, containers das features e testes existentes. Não houve nova inspeção do arquivo Figma nem de um ambiente publicado.

## Matriz de atendimento

“Parcial” significa que há código ou evidência para uma parte do requisito; não significa fluxo completo aprovado.

| Área / referência do README | Estado observado | O que falta |
| --- | --- | --- |
| Stack, §2 | Parcial: React, TypeScript, Router, Query, Axios, Tailwind, shadcn/Base UI, MSW e Playwright participam do código | Socket.IO não consta no package.json nem há implementação no código. Lighthouse não tem comando/configuração/relatórios no projeto. |
| Catálogo, §3 | Implementado no recorte atual: busca, filtros combinados, ordenação, paginação, URL/histórico, vazio, erro e cancelamento | Sincronização de preço/disponibilidade por eventos e favoritos autenticados. |
| Detalhe, §3 | Consulta REST por ID, acesso direto/404, galeria, abas e seleção local | Edições e estoque vindos da API, edição indisponível, limite real de quantidade, favorito e adicionar/comprar. O máximo atual é ilustrativo: 99. |
| Favoritos, §3/§5 | Pendente: botões informam indisponibilidade | Consulta, inclusão/remoção autenticadas, persistência por usuário, atualização otimista e rollback. |
| Carrinho, §3 | Parcial: rota e consulta REST de carrinho sempre vazio; composição preenchida disponível na prévia | Adicionar/alterar/remover, persistência, preservação dos itens do visitante no login, cupom aplicado/removido/inválido/expirado, totais da cotação e atualização por eventos. |
| Checkout/cotação, §3 | Parcial: rota privada, consulta vazia e seletores locais | Dados válidos do colecionador, carteiras cadastradas, rede, conexão/recusa/desconexão simuladas, revisão, cotação autoritativa e nova confirmação após mudanças. |
| Pedidos/recibo, §3/§5 | Parcial: leitura de pedidos históricos, isolamento por conta e recibo restrito ao estado confirmed | Criação idempotente, chave reutilizada com payload divergente, duplo clique, timeout após criação, transições de pagamento, retomada/reconexão e baixa apenas das quantidades compradas. |
| Login/logout/sessão, §3 | Implementados no recorte: dois usuários, refresh, expiração ao navegar/focar, retorno interno e limpeza de cache privado | Completar cadastro e provar preservação do contexto de uma compra efetiva quando a sessão expira; liberar subscriptions quando estas existirem. |
| Cadastro, §3/§5 | Pendente funcionalmente: formulário visual com validação nativa | Endpoint/mutation, persistência da conta, regras de senha e confirmação, conflito de usuário/e-mail e erros por campo. |
| Perfil/avatar/senha, §3/§5 | Parcial: rota privada recebe nome/e-mail da sessão | Consulta própria de perfil, salvar dados, upload/remoção de avatar, alteração de senha, validação pela API e persistência após refresh. |
| Carteiras, §3/§5 | Pendente funcionalmente: formulário e estado vazio de carteira secundária | Consulta/cadastro/edição principal e secundária, validação por rede e uso dos mesmos registros no checkout. |
| Query/REST/estado, §4/§5 | Parcial: services Axios, contratos de leitura, cache por busca/usuário, guards e cancelamento | Contratos e mutations dos recursos pendentes; invalidações coerentes; pelo menos uma atualização otimista com rollback. O onMutate do login apenas cancela consulta, não cumpre esse requisito. |
| Mocks, §6 | Parcial: MSW na rede e no bootstrap do build; fixtures variadas; cenários slow/empty/error/race e sessão | Estado compartilhado/persistente entre recursos, reset integral e cenários determinísticos de conexão indisponível, timeout, conflitos, cupons, estoque/preço e pagamento. |
| Tempo real, §7 | Pendente integralmente | Cliente Socket.IO e mock compatível com o protocolo; nft.updated/order.updated com identidade e versão, descarte de duplicatas/antigos, reconciliação REST, isolamento e limpeza de listeners. |
| UI/responsividade/acessibilidade, §8 | Parcial: nove apresentações, assets/fontes locais, tokens, skeleton, foco/teclado e testes em 390/768/1440 px | Validar os novos estados de negócio, erros associados aos campos, feedback de mutations/eventos, contraste e zoom. Conformidade completa não está comprovada. |
| E2E/regressão visual, §9 | Parcial: quatro suítes E2E, testes unitários e 27 imagens de referência locais | Cobrir cadastro, favoritos, carrinho persistente, compra completa e falhas, perfil/carteiras e Socket.IO. As capturas de detalhe/carrinho/pagamento são da prévia, não do fluxo integrado preenchido. Versionar baselines. |
| Lighthouse, §10 | Pendente | Home e detalhe em mobile/desktop, três execuções por combinação: 12 medições; medianas, LCP/CLS/TBT, configuração, ambiente e HTML/JSON. Metas: Performance ≥90, Accessibility ≥95, Best Practices ≥95, SEO ≥90. |
| Entrega pública, §12 | Pendente de comprovação | Código e assets rastreados no Git, checkout limpo reproduzível, URL pública, fallback SPA, refresh/acesso direto, MSW e eventos funcionando no host publicado. |

## Evidências concretas no código

- [Handlers de navegação](../src/core/mocks/navigation.handlers.ts): GET /cart devolve sempre items vazios; GET /checkout devolve items e wallets vazios. Pedidos são quatro registros históricos, consultados por GET; não há criação.
- [Container de autenticação](../src/feature/auth/views/auth-route.page.tsx): login usa mutation; cadastro chama o feedback de indisponibilidade.
- [Container do carrinho](../src/feature/cart/views/cart-route.page.tsx), [perfil](../src/feature/profile/views/profile-route.page.tsx) e [carteiras](../src/feature/wallets/views/wallets-route.page.tsx): salvar/alterar/remover/aplicar cupom não executam operações de negócio.
- [Navegação](../src/core/router/navigation.tsx): comprar, adicionar ao carrinho, favoritar e confirmar compra não possuem casos integrados e chegam ao feedback padrão.
- [Entidade NFT](../src/core/entities/nft.entity.ts) não contém estoque/edições/versionamento; [seletor de edição](../src/feature/nft/views/components/edition-selector.tsx) contém opções fixas e [quantidade](../src/core/components/general/quantity-control.tsx) usa max=99 por padrão.
- [Checkout](../src/feature/checkout/views/checkout.page.tsx): formulário do colecionador e lista detalhada/resumo usam hidden lg:block. Em mobile, o fluxo precisa oferecer coleta/revisão por uma composição ou etapa acessível; hoje aparece apenas o total e os seletores. [CollectorCheckoutForm](../src/feature/checkout/views/components/collector-checkout-form.tsx) é uma section, sem envio/validação integrada ao botão de confirmar.
- [Precisão ETH](../src/core/lib/eth.ts) já usa bigint para conversão/comparação, com testes. Ainda faltam os cálculos e invariantes de cotação/pedido, pois essas operações não existem.
- [Testes visuais](../tests/design.spec.ts) abrem /ui-preview.html; [navegação](../tests/navigation.spec.ts) valida explicitamente checkout vazio e compra indisponível. Passar esses testes não comprova o item de compra completa do README.

## Ordem sugerida de implementação

P0 indica lacunas que bloqueiam os fluxos centrais ou exigências eliminatórias do README. P1 indica complementos obrigatórios de qualidade e entrega; ambos precisam ser concluídos.

| Ordem | Prioridade | Recorte sugerido | Evidência necessária para concluir |
| --- | --- | --- | --- |
| 1 | P0 | Contratos e estado dos mocks: estoque/edições, carrinho visitante/usuário, perfil, carteiras, cotação, pedido e reset | MSW como única origem de negócio; refresh preserva dados; reset restaura cenário conhecido; contas isoladas. Evoluir junto com as features, sem uma reformulação geral. |
| 2 | P0 | Cadastro e manutenção da conta: perfil, avatar, senha e carteiras | E2E de sucesso, validação, conflito e persistência; nova senha funciona; checkout consulta as carteiras salvas. |
| 3 | P0 | Detalhe funcional e carrinho persistente | Catálogo → detalhe → adicionar → editar/remover → refresh → login sem perder itens; estoque/edição respeitados e cupons corretos. |
| 4 | P0 | Cotação e checkout completo em mobile/desktop | Valores ETH coerentes, dados/carteira/rede validados, falhas de conexão simuladas e nova revisão após preço/estoque/cupom/taxa alterados. |
| 5 | P0 | Criação e recuperação idempotente de pedidos | Compra até recibo confirmado; recusa preserva itens; cliques repetidos e timeout recuperam o mesmo pedido; snapshot não muda; baixa parcial correta do carrinho. |
| 6 | P0 | Socket.IO com MSW e reconciliação | Eventos pelo cliente real atualizam catálogo/detalhe/carrinho/pedido; duplicatas/antigos não regredem estado; reconexão recupera pedido; sessão anterior não interfere. Definir versões dos recursos desde o primeiro recorte. |
| 7 | P1 | Favoritos com atualização otimista | Persistência por conta e rollback comprovado por falha de mutation. Pode ser antecipado em relação ao checkout. |
| 8 | P1 | Fechamento de qualidade e entrega | E2E dos 12 grupos do README, baselines revisadas/versionadas, acessibilidade, Lighthouse e deploy validados em checkout limpo. Acrescentar testes em cada recorte, não somente ao final. |

Cada mudança de comportamento deve começar por uma spec curta conforme [SDD](SDD.md). Os recortes acima são propostas de backlog; não alteram o escopo nem criam specs de implementação nesta análise.

O README §11 lista como eliminatórios o uso incompleto da stack e fluxos principais apenas visuais. A ausência de Socket.IO e da compra funcional impede considerar a entrega pronta, independentemente do número de telas e testes existentes.

## Documentação e preparação da entrega

1. **Distinguir histórico de estado atual.** AGENTS.md ainda registra ausência de configuração/suítes/scripts de teste na inspeção inicial; hoje esses arquivos existem. STYLE_GUIDE e ARCHITECTURE preservam registros antigos já superados por seções posteriores. Centralizar um resumo atual ou marcar os trechos históricos reduz ambiguidades.
2. **Não reabrir pendências já resolvidas.** Capturas de login desktop/detalhe mobile, assets, fontes e gradientes aparecem como pendentes no levantamento inicial, mas seções posteriores registram sua obtenção/implementação. Nesta análise, essas pendências históricas não foram tratadas como trabalho ainda ausente.
3. **Manter a referência visual explícita.** README usa Ff0SksUi7UFtPWUO8kyNtw no enunciado e a implementação documenta 7jzy1utqt6Et0TTEOYmkcp. A diferença já é reconhecida; não há evidência nova de equivalência entre os arquivos. Tablet, perfil/carteiras/recibo mobile são adaptações documentadas.
4. **Completar contratos e cenários à medida que forem implementados.** Faltam contratos de escrita, erros de campo/conflito, cotação, idempotência e eventos; registrar também o merge do carrinho visitante, reset completo, cache e reconciliação.
5. **Versionar a solução.** git ls-files retornou somente README.md; src/, tests/, public/, package.json, lockfile e configurações são arquivos não rastreados neste checkout. As 27 baselines existem no disco, mas não estão versionadas. Conferir os arquivos de entrega antes de criar commit; nenhum commit/push foi feito nesta análise.
6. **Rever os arquivos locais antes de versionar.** .pnpm-store/ aparece como não rastreado e não consta no .gitignore. Evitar incluí-lo junto ao código da solução.
7. **Comprovar publicação.** Não foram encontrados configuração de host/fallback, configuração Lighthouse ou URL pública de entrega documentada. O README explica fallback, mas isso não comprova sua execução no host; configurações podem existir externamente e não foram inspecionadas.

## Verificação desta análise

### Inspeção

Leitura dos documentos e código relacionados, inventário de rotas/services/handlers/mutations, configuração de testes, imagens de referência e estado do Git. Conferidos links locais dos dez documentos principais/specs: nenhum destino inexistente.

### Execução automatizada

Ambiente: Node v22.19.0, pnpm 11.23.0, Chromium via Playwright 1.64.1; contextos de navegador isolados conforme configuração do projeto.

| Comando | Resultado nesta análise |
| --- | --- |
| pnpm typecheck | Passou. |
| pnpm lint | Passou. |
| pnpm test | Passou: 30 testes em três arquivos. |
| pnpm build | Passou: index.html e ui-preview.html emitidos, com chunks de rota. Maior chunk JS emitido: MSW/browser, 401,24 kB minificado e 155,31 kB gzip. Não houve aviso de chunk acima de 500 kB nesta execução; os avisos antigos da documentação são históricos. Isso não comprova as metas Lighthouse. |
| pnpm test:e2e | 54 passaram e quatro falharam em 3,1 min: duas diferenças de screenshot e dois erros ENOENT na gravação/fechamento dos traces. |
| Repetição dos quatro casos, com output isolado | Dois passaram: expiração/limpeza do toast e navegação desktop. Carrinho e checkout em 1440 px voltaram a falhar na comparação visual, com 990 pixels divergentes em cada imagem. |

A primeira tentativa E2E no sandbox não conseguiu iniciar o servidor local (EPERM). A execução seguinte foi iniciada com permissão para o servidor local, sem alterar código nem atualizar baselines.

Na inspeção do diff do carrinho, a diferença fica no botão Enviar da newsletter no rodapé. É necessário conferir a aparência pretendida antes de corrigir estilo ou aprovar outra baseline. A mesma contagem de pixels no checkout não basta para concluir uma causa comum sem inspecionar seu diff. Os dois erros ENOENT não comprovam defeito funcional de login/navegação; a causa da indisponibilidade dos artefatos não foi determinada.

Reprodução dos quatro casos: `pnpm test:e2e tests/auth-toast.spec.ts tests/design.spec.ts tests/navigation.spec.ts --grep 'login toast expires|cart renders.*1440px|checkout renders.*1440px|catalog links, return, refresh and history preserve URL state at 1440px' --output=/private/tmp/kurio-requirements-audit-e2e-20261023 --reporter=list`. A repetição levou 17,9 s. Diffs e traces dessa execução estão nessa pasta temporária; o relatório HTML da suíte integral é gerado em playwright-report/index.html. Nenhuma referência visual foi atualizada.

### Execução manual e verificações não executadas

Execução manual interativa: não realizada. Inspeção de capturas/diffs é distinta de interação manual.

Não executados: nova comparação com frames do Figma, leitor de tela, auditoria completa de contraste/zoom, Lighthouse, deploy, instalação em checkout limpo e validação em host público. Fluxos ainda ausentes não podem ser considerados aprovados pelos testes da apresentação visual.
