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
