# Validação final — 24/10/2026

- `pnpm typecheck`, `pnpm lint` e `pnpm build`: passaram.
- `pnpm test`: 62 testes em quatro arquivos, passaram.
- `pnpm test:e2e --output=/private/tmp/kurio-final-isolated --reporter=list,html`: 90 passaram em 5,4 min, Chromium 156.0.8078.4/macOS. Não houve atualização de baselines nessa rodada.
- [Relatório HTML final](e2e/index.html). As 39 referências visuais estão nas pastas `tests/*spec.ts-snapshots`: 27 anteriores revistas pela otimização das imagens e 12 capturas das telas funcionais.
- [Smoke público](../deployment-smoke.json): navegador sem sessão da Vercel; detalhe/refresh, evento Socket.IO observado na UI, compra completa até recibo, refresh privado, carrinho vazio e prévia. Zero pageerror.

Os E2E novos observam ações/resultados da UI. Controles MSW são usados para presets/falhas/eventos; o fluxo de negócio passa por Router, Query e Axios. Os testes de Socket.IO passam pelo cliente e WebSocket interceptado pelo MSW.

Inspeção: código, contratos, capturas 390/768/1440 e links locais. Execução manual interativa independente, leitor de tela e outros navegadores não realizados. Lighthouse tem metodologia e relatórios próprios em ../lighthouse/README.md.


Após a otimização da spec 010: os 62 unitários e os 90 E2E passaram novamente; typecheck, lint e build completos passaram. O build foi gerado enquanto o servidor de desenvolvimento e a suíte estavam ativos, comprovando a separação dos caches Vite. Uma execução anterior detectou colisão de JSX runtime; a causa foi corrigida com cache próprio da pré-renderização e o servidor reiniciado com dependências reconstruídas.

`prerender-check.mjs` local e público comprovou HTML público sem dados privados, hidratação sem erro com relógio +1 h e ausência de overflow. `deployment-smoke.mjs` foi repetido na produção otimizada, incluindo busca, NFT inexistente e recuperação da sessão após HTML público, zero pageerror. O build também foi executado numa cópia temporária com mocks desativados por `.env.production`: SPA e fallback presentes, sem pré-renderização de fixtures.

## Correções de carregamento e modal de produção (spec 011)

A [spec 011](../../specs/011-toast-falhas-carregamento.md) registra a investigação da aba local com `ERR_SOCKET_NOT_CONNECTED`, o bloqueio indevido da autenticação por falha do catálogo e o corte do modal na Vercel. A geometria deve ser testada também no build otimizado: `pnpm test:production` gera o build e executa `tests/production/dialog.spec.ts` em 1024×650, 1440×720 e 1920×1080, incluindo um diálogo genérico. Para o deploy existente, use `PRODUCTION_BASE_URL=https://frontend-challenge-junglegaming-gamma.vercel.app pnpm exec playwright test --config playwright.production.config.ts` (sem rebuild/servidor local). As capturas são gravadas na pasta de saída de cada teste.

Neste recorte, os 62 testes unitários passaram. Foram verificados 43 cenários E2E de catálogo/navegação/auth/falhas (42 na rodada conjunta e o caso de expiração após ajustar uma espera por resposta autenticada), além dos sete cenários do build otimizado. Tipos, lint e build passaram. A suíte E2E integral e o Lighthouse não foram repetidos; os relatórios anteriores acima mantêm sua data/escopo, sem serem apresentados como evidência destas correções.

Após a publicação do commit `78bf9dc`, os sete testes de produção passaram também na Vercel (16 s), com capturas em `/private/tmp/kurio-modal-live`. CSS computado publicado confirmado em 1280×720: modal com topo 96 px e esquerda 390 px, sem o deslocamento individual duplicado. Endereço público e identificação do deploy na spec.
