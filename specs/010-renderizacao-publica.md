# 010 — Renderização inicial das páginas públicas

Status: concluída
Atualização: 2026-10-24
Referências: README §8–12; specs 007–009; docs/SDD.md.

## Objetivo e limites

Reduzir FCP/LCP no mobile sem omitir mocks, imagens ou funcionalidades. O runtime continua uma SPA estática; o build pode gerar HTML inicial de páginas públicas com os mesmos componentes e contratos. Não haverá servidor de aplicação, credenciais nem conteúdo privado no HTML gerado.

## Decisões

- Pré-renderização no build usa React e os handlers MSW reais no Node; hidratação reutiliza o cache público e reconcilia a sessão/dados no navegador.
- Rotas sem HTML próprio recebem a entrada SPA vazia; prévia isolada continua independente.
- Dados públicos iniciais não autorizam compra; cotação e pedidos continuam validados pela API em runtime.

## Critérios de aceite

- **CA-01:** Home/detalhes públicos recebem HTML significativo, hidratam sem erros e preservam rotas, apresentação, eventos e compra completa.
- **CA-02:** HTML gerado não contém sessão privada; uma sessão persistida recupera seu usuário no navegador e guarda URLs privadas.
- **CA-03:** Build limpo, fallback direto/refresh, prévia, checks e testes dos fluxos afetados passam no build e deploy.
- **CA-04:** Três medições por página/perfil do mesmo build comprovam Performance ≥90 e demais metas do README, sem simplificação exclusiva para auditoria.

## Tarefas e evidências

- [x] Gerar HTML/cache público e hidratar com fallback SPA correto.
- [x] Validar build, sessão, compra/eventos e rotas no build/deploy.
- [x] Repetir Lighthouse e registrar medianas, relatórios e limites.

Inspeção: mobile atual 75/77; desktop 98/97; demais categorias 100. Há custo relevante de bootstrap JS/MSW e descoberta tardia de conteúdo na SPA.
Pendências: implementação e comprovação dos quatro critérios.


## Evidências

| Critério | Verificação | Resultado |
| --- | --- | --- |
| CA-01 | Build gera home + 239 detalhes; deployment-smoke.mjs local exercita compra, eventos, busca e recurso inexistente | Passou; HTML e cache vêm dos mesmos componentes/handlers, sem erro de hidratação. |
| CA-02 | prerender-check.mjs local e público, com relógio do navegador +1 h; smoke recupera sessão autenticada | Passou; nenhum dado privado nos HTMLs inspecionados e sessão recuperada pela API no navegador. |
| CA-03 | typecheck/lint/build, 62 unitários; build em cópia temporária com .env.production desativando mocks | Passou; flag produz SPA/fallback sem fixtures. Caches do Vite para dev/prerender foram isolados depois de identificar colisão de JSX runtime; rodada final de 90 E2E passou em 5,4 min durante geração concorrente do build, sem interferência no servidor dev. |
| CA-04 | 12 medições Lighthouse em build com mocks completos | Passou: medianas Performance 98/96 mobile, 100/100 desktop; demais categorias 100. Relatórios em docs/lighthouse. |

Inspeção de código/contratos, fontes instaladas e documentação oficial do Router; execução de UI/transportes automatizada. Manual interativa e leitor de tela não executados.
Smoke final da produção otimizada: passou, incluindo compra completa, Socket.IO, URL com busca, sessão restaurada, NFT inexistente e refresh de recibo; zero pageerror. Evidências em docs/deployment-smoke.json e docs/prerender-public-check.json.
Pendências deste recorte: nenhuma. LCP mobile do detalhe (2,782 s) supera a proposta de 2,5 s do guia; todas as metas de pontuação do README foram atingidas e essa diferença permanece documentada.
