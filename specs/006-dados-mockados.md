# 006 — Dados e APIs simuladas consistentes

Status: concluída
Atualização: 2026-10-24
Referências: README §3–7 e §9; STYLE_GUIDE §12–13; docs/SDD.md.

## Objetivo e limites

Entregar dados e endpoints MSW persistentes para os recursos do marketplace, com cenários reproduzíveis e eventos Socket.IO sobre o mesmo estado.
Inclui contratos, fixtures, sessão/cadastro, perfil/avatar/senha, carteiras, favoritos, carrinho, cotação, pedidos, reset e controles de demonstração na rede.
Fora: conectar mutations às telas, atualização otimista da UI, consumo global dos eventos pelo cache, novas páginas, blockchain/pagamento reais, Lighthouse e deploy.

## Contexto e decisões

- Preservar catálogo, IDs, preços, credenciais e pedidos históricos existentes; cenário inicial mantém carrinho/carteiras vazios. Preset populated oferece itens e carteiras para demonstração.
- Estado versionado em localStorage; armazenamento em memória nos testes Node. Reset remove estado, sessão, cenários e seleção lembrada, sem limpar chaves de outros aplicativos.
- Contratos compartilhados em core/entities e contratos de leitura nos services das features; estado/transações e infraestrutura compartilhada em core/mocks. Handlers e fixtures das features reutilizam essa origem, sem respostas de negócio nas views/Axios.
- Cada transação síncrona relê o estado; persistência local pertence à API simulada. Não representa backend concorrente entre abas/processos. Falha/corrupção de armazenamento deve ser explícita, sem sucesso fictício.
- ETH em strings com até 18 casas; cálculos em bigint; cupom KURIO10 dá 10% com arredondamento para baixo em wei; taxa 0.01 ETH para carrinho não vazio.
- Cadastro exige username/email/password/confirmPassword; senha ≥8 com letra e número. ENS opcional validado; indicação não participa do contrato de negócio deste recorte. Carteiras validam endereços EVM ou Solana por rede; ENS não substitui endereço no contrato.
- Cotação vinculada ao usuário, versão do carrinho, preço/estoque/cupom/taxa e expiração de cinco minutos; compra exige carteira/rede e conexão simulada. Chave de idempotência é por usuário, mesma entrada recupera o pedido e entrada diferente retorna 409, inclusive após timeout.
- Pedidos novos começam pending e avançam por tempo determinístico persistido ou comando de cenário. Confirmed/declined são terminais; reserva impede sobrecompra; confirmação remove só quantidades compradas e usa snapshot imutável; recusa libera reserva.
- Eventos têm eventId/resourceId/version e destinatário privado quando aplicável. Transporte WebSocket/default namespace/texto via binding MSW; testes usam socket.io-client. Reconciliação/ordenamento no cache da aplicação permanecem pendentes da integração de UI.

## Critérios de aceite

- **CA-01:** Dado reset/default/populated, consultas e mutations usam o mesmo estado, persistem após refresh e reset restaura fixtures conhecidas sem alterar dados externos.
- **CA-02:** Dadas duas contas/visitante, autenticação/cadastro e recursos privados validam entradas, negam acesso alheio, não persistem senhas em claro e preservam carrinho visitante no login uma única vez.
- **CA-03:** Dado carrinho por edição, alterações/cupom/cotação respeitam estoque e precisão; preço/estoque/cupom/taxa alterados ou cotação expirada exigem nova cotação, sem criar pedido.
- **CA-04:** Dada compra válida, repetição/timeout recuperam o mesmo pedido; payload divergente conflita; confirmação/recusa persistem e preservam snapshot, estoque e quantidades não compradas, sem aplicar efeitos duas vezes.
- **CA-05:** Dados cenários configurados, MSW representa lentidão, vazio, race, 4xx/5xx, conexão indisponível, sessão expirada, conflitos e pagamentos; restauração permite nova tentativa.
- **CA-06:** Dada conexão socket.io-client, mutações e controles de rede emitem eventos coerentes com REST, permitem duplicação/obsolescência/desconexão determinísticas e não enviam pedidos de outra sessão/conta.

## Tarefas

- [x] Definir contratos, fixtures e store persistente (CA-01/02).
- [x] Implementar handlers e regras de conta, carrinho, cotação/pedidos (CA-02/03/04).
- [x] Implementar cenários e eventos sobre a rede (CA-05/06).
- [x] Testar contratos/transportes, executar verificações e atualizar docs/evidências.

## Evidências

| Critério | Verificação | Resultado |
| --- | --- | --- |
| CA-01 | marketplace.test.ts: default/populated/reset, corrupção/erro de gravação; mocks.spec.ts: carrinho nas rotas e refresh | Passou; estado persistido e chaves externas preservadas. |
| CA-02 | marketplace.test.ts: contas, digests, validações, perfil/avatar/senha/carteiras, merge e falha de persistência do login; navigation.spec.ts | Passou; conta alheia não lê pedido, merge ocorre uma vez e erros não consomem carrinho visitante. |
| CA-03 | marketplace.test.ts: quantidades/estoque, desconto com 18 casas, cupom inválido/expirado e cotação alterada por preço/estoque/taxa/cupom/carrinho/prazo | Passou; 409/422 conforme contrato, sem criação de tentativa inválida. |
| CA-04 | marketplace.test.ts: criação concorrente, payload divergente, prazo persistido, terminalidade, snapshot e baixa parcial; mocks.spec.ts: timeout Axios e recibo após refresh | Passou; mesma tentativa recupera pedido, sem duplicar reserva/baixa. |
| CA-05 | marketplace.test.ts: HTTP 403/409/422/503, erro de conexão, timeout, vazio, sessão/carteira e pagamento recusado; home.spec.ts: slow/empty/race/retry | Passou; cenários passam pelos handlers MSW e recuperação por controle/default. |
| CA-06 | mocks.spec.ts: handshake, NFT/REST coerentes, replay duplicado/antigo, desconexão/reconexão, order.updated e revogação da sessão antiga | Passou com socket.io-client 4.8.4 no Chromium; nenhum setter/cache usado para substituir transporte. |

Inspeção: documentos, contratos/handlers e suites atuais lidos antes de implementar.

### Execução automatizada

- `pnpm typecheck`, `pnpm lint`, `pnpm build`: passaram. Build emite as duas entradas; chunk de mocks/browser 442,95 kB minificado / 168,58 kB gzip. Não há medição Lighthouse.
- `pnpm test`: 62 testes (32 de contratos MSW/Axios e 30 de ETH/URL/redirect) passaram. A revisão final também passou (31,92 s), comprovando recusa pelo prazo/outcome persistido, sem escolher explicitamente o resultado pelo controle.
- `pnpm test:e2e --output=/private/tmp/kurio-mocks-full-e2e --reporter=list,html`: 78 passaram em 3,3 min. Inclui cinco casos novos de dados/Socket.IO e as 27 baselines existentes, sem atualização.
- Depois dos ajustes finais de persistência de login, desconexão da carteira e identidade do replay antigo, `pnpm test:e2e tests/mocks.spec.ts tests/navigation.spec.ts --output=/private/tmp/kurio-mocks-final-e2e --reporter=list,html`: 19 passaram em 1,6 min. As demais suítes visuais não foram repetidas após esses ajustes sem mudança de layout.
- Smoke Chromium sobre `pnpm preview` em 4182: injetados os clientes Axios/Socket.IO locais apenas no harness de teste; preset populated → login → alteração de preço/evento → carteira/conexão → cotação → pedido pending → liquidação → recibo e carrinho vazio. Total 2.41 ETH, ordem order-3; acesso direto/refresh do recibo e prévia funcionaram, zero pageerror. Servidor temporário encerrado. Esse é um teste da API e do recibo, não da compra pelos botões ainda indisponíveis.
- A execução no sandbox não iniciou o Vite (EPERM); os testes Chromium e o smoke foram executados com permissão para servidor local. O primeiro E2E identificou a normalização de path Socket.IO do MSW 3; corrigida e revalidada. Também foi corrigida a espera pelo bootstrap MSW no teste após refresh e usada largura mobile para o seletor de carteiras mobile existente.

### Inspeção, manual e limites

Inspeção de contratos, invariantes, isolamento, fontes instaladas do binding/MSW e links locais da documentação. Não foram alteradas referências visuais nem os fluxos de UI.
Execução manual interativa: não realizada. Não executados: deploy, Lighthouse, leitor de tela, backend real e coordenação simultânea entre abas/processos.
O binding 0.2.0 declara peer MSW 2; a combinação instalada com MSW 3.0.3 foi validada em dev e build e permanece documentada com aviso de peer, sem afirmar suporte oficial do pacote. Transporte limitado a WebSocket/default namespace/texto; consumo dos eventos no cache/UI é trabalho futuro.
Pendências deste recorte: nenhuma. Demais pendências de produto: mutations/UI, atualização otimista, descarte/reconciliação no cache, compra completa pelos botões, Lighthouse e deploy.

Revisão final de documentação: README, ARCHITECTURE, MOCK_API, análise histórica e esta spec com links locais válidos; lint e typecheck reexecutados após os ajustes finais.
