# Auditorias Lighthouse

O comando `pnpm audit:lighthouse` mede início (`/`) e detalhe (`/nfts/nft-1`) em mobile e desktop, três vezes por combinação, com perfis novos de Chromium e cenário padrão completo dos mocks. O mesmo build de demonstração mantém imagens, fontes, MSW, estado e Socket.IO. Não há modo especial de UI para a auditoria.

## Reproduzir

```sh
pnpm build
node scripts/serve-build.mjs
```

Em outro terminal:

```sh
pnpm audit:lighthouse
```

O servidor estático usa a porta 4184, tipos MIME, gzip e fallback SPA. Ele serve diretamente `dist/`; a instrumentação externa do Console Ninja observada no Vite preview não participa da medição. `LIGHTHOUSE_URL` permite outro endereço com o mesmo build. Instale antes o Chromium com `pnpm exec playwright install chromium`.

A configuração está em `scripts/lighthouse.mjs`. Throttling simulado padrão do Lighthouse no mobile; desktop usa 1440 × 1000, RTT 40 ms, 10.240 Kbps e CPU 1×. O mobile usa o perfil padrão da ferramenta, distinto dos viewports dos E2E. Cada execução grava HTML/JSON; `results.json` registra ambiente/versões e todas as execuções, `medians.json` contém as medianas de cada categoria e LCP/CLS/TBT.

As metas do README são Performance ≥90, Accessibility ≥95, Best Practices ≥95 e SEO ≥90. Pontuações de acessibilidade automatizada não equivalem a auditoria WCAG completa nem teste com leitor de tela.

## Resultado final

Medianas de três execuções por página/perfil, em 24/10/2026:

| Página | Perfil | Performance | Accessibility | Best Practices | SEO | LCP | CLS | TBT |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Início | mobile | 98 | 100 | 100 | 100 | 2.413 s | 0.00000 | 0.0 ms |
| Início | desktop | 100 | 100 | 100 | 100 | 0.613 s | 0.00000 | 0.0 ms |
| Detalhe | mobile | 96 | 100 | 100 | 100 | 2.782 s | 0.00000 | 0.0 ms |
| Detalhe | desktop | 100 | 100 | 100 | 100 | 0.621 s | 0.00000 | 0.0 ms |

As quatro metas de pontuação do README foram atingidas. Node 22.19.0, Lighthouse 13.5.0, Chromium 156.0.8078.4, Darwin 27 arm64; versões e condições completas em results.json. HTML/JSON individuais usam nomes página-perfil-execução.

A renderização inicial passou a usar HTML público gerado no build pelos mesmos componentes e APIs MSW, com cache transferido pelo Router e reconciliação no navegador. Fonte e imagens recebem prioridade sobre os downloads de hidratação nas páginas públicas; o fallback SPA mantém a prioridade normal de scripts. Os mesmos assets, mocks e eventos continuam carregados; não existe flag de auditoria na interface.

O LCP mobile do detalhe, 2,782 s, ainda supera a proposta de 2,5 s do STYLE_GUIDE, embora a nota Performance seja 96 e satisfaça o README. As execuções variam, especialmente a primeira, e estes números são de laboratório, não p75 de usuários reais. INP de campo não foi medido. Leitor de tela, auditoria WCAG completa e outros navegadores permanecem fora desta medição.

