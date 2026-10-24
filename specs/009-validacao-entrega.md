# 009 — Validação e entrega pública

Status: concluída
Atualização: 2026-10-24
Referências: README §8–12; docs/SDD.md.

## Objetivo e limites

Validar a aplicação final, executar auditorias Lighthouse reproduzíveis e preparar/publicar o build com fallback SPA. Preservar alterações locais existentes.

## Critérios de aceite

- **CA-01:** Typecheck, lint, build, testes unitários e E2E dos fluxos finais passam com evidências.
- **CA-02:** Início/detalhe, mobile/desktop, têm três medições Lighthouse, medianas, LCP/CLS/TBT e relatórios HTML/JSON; desvios são analisados.
- **CA-03:** Build público corresponde ao código entregue; rotas diretas, refresh, MSW e Socket.IO funcionam no host publicado.

## Tarefas

- [x] Verificações e regressão visual.
- [x] Configuração e relatórios Lighthouse.
- [x] Deploy e revisão da documentação.

## Evidências

| Critério | Verificação | Resultado |
| --- | --- | --- |
| CA-01 | typecheck/lint/build, pnpm test, pnpm test:e2e --output=/private/tmp/kurio-final-isolated --reporter=list,html | Passou: 62 unitários, 90 E2E em 5,4 min, 39 baselines sem atualização na rodada final. Relatório HTML em docs/testing/e2e/index.html. |
| CA-02 | pnpm audit:lighthouse, 12 execuções do build otimizado, mesmas imagens/fontes/mocks/eventos | Passou: medianas Performance 98/96 mobile, 100/100 desktop; Accessibility/Best Practices/SEO 100. Configuração, HTML/JSON, versões, LCP/CLS/TBT e análise em docs/lighthouse. |
| CA-03 | Deploy Vercel READY; scripts deployment-smoke e prerender-check na URL pública, sem sessão da Vercel | Passou: detalhe direto/refresh, preço via Socket.IO, compra pela UI até recibo/refresh privado, busca na URL, sessão restaurada, ausência de dados privados no HTML e prévia. Zero pageerror. |

Produção: https://frontend-challenge-junglegaming-gamma.vercel.app
Deployment validado: dpl_5UWR5w3p5LS9siMyc3a9dwuVa41H. Código de runtime e configuração no workspace correspondem ao build publicado; o isolamento posterior de cache afeta somente o processo de build/dev, sem mudança do runtime.

Inspeção: código, contratos, capturas, configuração do host e links locais. Execução automatizada: checks, unitários, E2E/visuais, smoke local/público, hidratação com cache antigo e build com mocks desativados por arquivo de ambiente. Execução manual interativa independente: não realizada. Não executados: leitor de tela, auditoria WCAG completa, outros navegadores e métricas de campo.

A spec 010 documenta a otimização que permitiu atingir as metas mantendo a SPA estática. Limitação: LCP mobile do detalhe 2,782 s supera a proposta de 2,5 s do STYLE_GUIDE; a nota obrigatória de Performance foi atingida. Relatórios não representam p75 de usuários reais nem teste com leitor de tela.
Pendências deste recorte: nenhuma.
