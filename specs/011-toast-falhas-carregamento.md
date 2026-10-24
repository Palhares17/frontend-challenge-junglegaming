# 011 — Falhas de carregamento com toast e recuperação

Status: em validação
Atualização: 2026-10-24
Referências: README §3, §8–9; STYLE_GUIDE (tokens e navegação); docs/SDD.md.

## Objetivo e limites

Tratar falhas de carregamento com toast acessível, preservando navegação e nova tentativa. Investigar a URL informada e outras telas que falham, corrigindo dependências indevidas sem mudar contratos de negócio.

## Contexto e decisões

- Observado na aba original do Aside: `chrome-error://chromewebdata/`, `ERR_SOCKET_NOT_CONNECTED`. O navegador não conseguiu obter o documento local; não é erro dos filtros. Recarregar a mesma aba recuperou o catálogo com nove NFTs, sem limpar dados.
- A URL completa também abriu em contexto Chromium limpo. Não é possível interceptar com React uma falha anterior ao carregamento do documento. Não há evidência suficiente para atribuir a desconexão original ao servidor, navegador ou sistema.
- Observado no código: login/cadastro usam uma consulta suspensiva de catálogo só para dados de apresentação. Uma falha do catálogo pode derrubar também o formulário de autenticação.
- Proposto: toast compartilhado, sem duplicação, para erros de catálogo e rotas; controles de recuperação persistentes no layout padrão. Erros de autenticação/validação continuam próprios; 404 mantém identificação de recurso inexistente.
- Login/cadastro deixam de depender do sucesso do catálogo para renderizar. Nenhum dado fictício de sucesso será introduzido.
- Investigação adicional solicitada: modal cortado na Vercel. CSS local computado: `translate: 0px`, topo 96 px. Publicado: `translate: -50% -50%`, topo −204 px (viewport 1280×720). No CSS otimizado, o reset `translate: 0 0` foi incorporado a `transform`, deixando ativos os deslocamentos individuais das classes genéricas. A autenticação deve omitir essas classes e usar seu próprio posicionamento.
- Contratos REST, filtros, persistência, proteção das rotas e dados existentes permanecem. Sem PWA/offline cache, reset automático de dados, mudanças de Figma ou promessa de toast em erro nativo do navegador.

## Critérios de aceite

- **CA-01:** Dada a URL completa informada, abrir e recarregar em 390/768/1440 px carrega o catálogo, preservando filtros e sem erro JavaScript.
- **CA-02:** Dada uma falha de catálogo, a navegação/filtros permanecem, aparece um único toast de carregamento e uma nova tentativa recupera os resultados sem reload; dados válidos de uma atualização que falha permanecem visíveis.
- **CA-03:** Dada falha de carregamento de rota pública ou privada, aparece toast no layout padrão com nova tentativa/retorno, sem título de tela de erro; retry recupera o conteúdo, sem expor dados privados durante falha da sessão. 404 continua distinto.
- **CA-04:** Dado catálogo indisponível, login/cadastro continuam utilizáveis no mobile/desktop e autenticação pode concluir pela API quando o serviço de sessão está disponível.
- **CA-05:** Toasts não acumulam em rerenders/falhas repetidas e são removidos ao recuperar/sair da tela. Navegação entre telas de produto continua no Router, sem novo documento.
- **CA-06:** Dado build de produção, login/cadastro desktop ficam inteiramente dentro da janela, com fechar acessível em alturas reduzidas; diálogos genéricos mantêm sua centralização. Validar o build além do servidor de desenvolvimento.

## Tarefas

- [x] Reproduzir falhas e registrar a causa observada e os limites do diagnóstico.
- [x] Implementar feedback compartilhado e remover dependência bloqueante na autenticação.
- [x] Testar recuperação, URLs diretas, sessão, recursos inexistentes e navegação.
- [x] Executar tipos, lint, build e testes pertinentes; atualizar documentação/evidências.
- [ ] Publicar e verificar a geometria do modal na Vercel.

## Evidências

| Critério | Procedimento | Resultado |
| --- | --- | --- |
| CA-01 | URL original no Aside e Chromium limpo; `tests/page-load-errors.spec.ts`, três larguras | Catálogo/refresh/retorno com nove NFTs, sem erros JS ou overflow; links internos sem novo documento |
| CA-02 | `page-load-errors`: HTTP 503 inicial e refetch por evento Socket.IO | Toast único/assertivo, retry recupera; cache preserva nove cards e a nova consulta obtém o preço efetivamente atualizado |
| CA-03 | `page-load-errors` e `navigation`: falhas de detalhe/carrinho/sessão e retry; 404 | Recuperação sem reload, navegação disponível, sessão indisponível não expõe perfil; inexistentes permanecem distintos |
| CA-04 | `page-load-errors`: catálogo falha no login/cadastro em 390/1440 | Formulários acessíveis; login válido conclui na API e abre perfil sem depender do catálogo |
| CA-05 | `page-load-errors`, `auth-toast`: falhas repetidas/saída/recuperação | Avisos únicos, removidos na saída/sucesso; notificações de credenciais continuam independentes |
| CA-06 | `tests/production/dialog.spec.ts`: build preview em três viewports | Sete testes passaram: login/cadastro dentro das margens, fechar funcional e busca genérica centralizada. Inspeção visual do build em 1280×720: topo 96 px, esquerda 390 px, translate individual `none`. Validação publicada pendente |

Inspeção: código, URL, screenshot enviado e CSS computado local/publicado/build. Execução manual: nenhuma; interações com navegador por automação, capturas inspecionadas visualmente.

Testes automatizados: `pnpm test` — 62 passaram. `pnpm test:e2e tests/page-load-errors.spec.ts tests/home.spec.ts tests/navigation.spec.ts tests/auth-toast.spec.ts --reporter=list` — 42 passaram e um teste antigo capturou o GET de sessão anônima ainda pendente, pois o formulário agora aparece antes do catálogo. Sua espera passou a selecionar a resposta autenticada; reexecução isolada de `expired session redirects` passou. Os dois testes novos de reprodução falharam antes da implementação, confirmando o bloqueio do login e o feedback antigo do catálogo. `pnpm exec playwright test --config playwright.production.config.ts --reporter=list --output=/private/tmp/kurio-production-dialog-tests` — sete passaram. Total: 50 cenários E2E distintos verificados neste recorte.

`pnpm typecheck`, `pnpm lint`, `pnpm build` e `git diff --check` passaram. O build gerou 240 páginas públicas; o sandbox registrou restrição ao socket HMR auxiliar, mas a pré-renderização concluiu com saída zero. A validação de produção utilizou servidor preview fora do sandbox. Não executado: suíte E2E integral, novo Lighthouse, outros navegadores/leitor de tela e reprodução da causa de baixo nível de `ERR_SOCKET_NOT_CONNECTED` (falha transitória já recuperada).

Pendência: publicar e conferir a versão corrigida no endereço público.
