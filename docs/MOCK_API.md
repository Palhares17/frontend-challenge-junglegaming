# Dados e API simulada do marketplace

Implementação: [spec 006](../specs/006-dados-mockados.md). MSW é a camada de rede, ativada antes do React quando `VITE_ENABLE_MOCKS` não é `false`, inclusive no build de demonstração. Os mesmos [handlers](../src/core/mocks/handlers.ts) são usados no navegador e no MSW Node dos testes. Não existe servidor REST separado: curl contra o Vite não passa pelo Service Worker do navegador.

As telas ainda não enviam as novas mutations. Este documento descreve a base de dados/API disponível para sua integração. O catálogo, detalhe, carrinho, checkout, sessão e recibos existentes já leem essa origem. A integração de favoritos, formulários e compra pela UI, assim como invalidação otimista e consumo global dos eventos pelo Query, continuam para os próximos recortes.

## Estado, fixtures e reset

- Os 239 NFTs preservam IDs, assets e preços do catálogo original. Cada NFT tem `version` e edições `single`, `ten`, `fifty`, `open`, com estoque inteiro; parte das edições únicas já começa esgotada para exercitar indisponibilidade. Disponibilidade é estoque livre, descontadas as reservas de pedidos pendentes.
- `ana@kurio.test` e `bruno@kurio.test` usam a senha fictícia `Kurio123!`. Cadastro cria outras contas. Cada conta possui perfil, favoritos, carteiras, conexão simulada, carrinho, cotações e pedidos próprios.
- O preset `default` mantém carrinho e carteiras vazios. `populated` prepara duas unidades de `nft-1`/`ten` no carrinho visitante, carteira Ethereum da Ana e carteira Solana do Bruno. Eles continuam sem conexão até a operação correspondente. Nova autenticação e logout encerram a conexão de carteira; refresh da mesma sessão a preserva.
- Os pedidos históricos `demo-confirmed`, `demo-pending`, `demo-declined` são da Ana; `demo-bruno` é do Bruno. São apenas registros de leitura e não reservam estoque.
- Dados ficam em `localStorage['kurio:mock-database:v1']`; identidade/expiração/token da sessão em `kurio:mock-session`. Nenhuma senha é persistida em claro. Contas novas/alterações usam digest SHA-256 com salt por senha; usuários fictícios preservam o digest de demonstração existente. Isso é simulação local de autenticação.
- Transações releem e salvam o estado inteiro sincronamente; uma operação inválida não persiste mudanças parciais. Serialização e idempotência valem dentro do runtime da demonstração. localStorage não oferece coordenação transacional entre abas/processos; esta camada não representa um backend concorrente distribuído.
- JSON corrompido ou falha de gravação produzem `503 MOCK_STORAGE_ERROR`, sem alegar sucesso. Use reset para recuperar dados corrompidos; indisponibilidade do armazenamento precisa ser resolvida para persistir novamente.

No console de uma página da aplicação, o controle abaixo funciona em desenvolvimento e no build:

```js
await fetch('/api/mock/reset', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ preset: 'populated' }), // ou default
});
location.reload();
```

Esse é um comando de administração da demonstração. As chamadas de negócio da aplicação continuam no cliente Axios. O reset substitui o banco, desconecta sockets, limpa histórico de eventos, sessão, cenários e `sessionStorage['kurio:catalog-search']`. Chaves de outros aplicativos são preservadas. Recarregue depois do reset para descartar também o cache Query da página aberta.

## Convenções e erros

Base `/api`, configurável pelo cliente Axios com `VITE_API_URL`. Os handlers atuais reconhecem o prefixo `/api`; um backend com outro prefixo exige alinhar os handlers. APIs privadas retornam 401 sem sessão válida. Recursos alheios retornam 404. Não são aceitos IDs de usuário no corpo para selecionar outro dono.

Erros têm `{ code, message, fields? }`. `fields` associa erros aos nomes dos campos. Estados principais: 400 JSON inválido; 401 credenciais/sessão; 403 cenário sem permissão; 404 recurso ausente/alheio; 409 conflito; 422 validação; 503 falha transitória/armazenamento. Nenhum controle de mock é registrado com os mocks desativados.

Valores ETH são strings decimais de até 18 casas, sem notação exponencial; contas usam bigint em wei. Quantidades são inteiras positivas. `KURIO10` aplica desconto de 10%, arredondado para baixo em wei; `EXPIRED` está expirado. Taxa padrão: `0.01` ETH para carrinho não vazio, zero para vazio. Totais vêm da API, independentemente dos espécimes visuais do Figma.

## Contratos REST

Tipos compartilhados: [marketplace.entity.ts](../src/core/entities/marketplace.entity.ts). Contratos de leitura também ficam nos services existentes das features. O `id` da linha do carrinho é `nftId:editionId`; `nftId` identifica o NFT.

| Endpoint | Entrada / resposta |
| --- | --- |
| `GET /session` | `{ user: {id,name,email} \| null, sessionId? }`. Sessão dura 30 minutos. |
| `POST /session` | `{email,password}` → sessão; login transfere uma única vez os itens do visitante para a conta, somando quantidades iguais. Intenções preservadas acima do estoque serão rejeitadas na cotação. |
| `DELETE /session` | Encerra a sessão e a conexão de carteira da conta; 204. |
| `POST /accounts` | `{username,email,password,confirmPassword}` → perfil, 201. Não autentica automaticamente. E-mail/username existentes retornam 409. |
| `GET /nfts` | Busca/filtros/ordenação/paginação anteriores, agora com `version`/`editions` em cada item. |
| `GET /nfts/:id` | `{nft,related}`; detalhe inclui estoque por edição e versão. |
| `GET /favorites` | Privado; `{items: InventoryNft[]}`. |
| `PUT /favorites/:nftId` | Privado; inclusão idempotente; retorna favoritos. |
| `DELETE /favorites/:nftId` | Privado; remoção idempotente, 204. |
| `GET /profile` | Privado; `{id,displayName,username,email,ens,walletAlias,avatar}`. |
| `PATCH /profile` | Privado; campos parciais `displayName,username,email,ens,walletAlias`; retorna perfil. |
| `PUT /profile/avatar` | Privado; `{avatar: dataURL \| null}`; PNG/JPEG/WebP base64 de até 1 milhão de caracteres; null remove. |
| `PUT /profile/password` | Privado; `{currentPassword,password,confirmPassword}`; 204. |
| `GET /wallets` | Privado; `{items: Wallet[]}`. |
| `POST /wallets` | Privado; `{label,address,network,primary?}` → carteira, 201. Máximo duas; exatamente uma principal quando houver carteiras. |
| `PATCH /wallets/:id` | Privado; atualização parcial dos mesmos campos; recurso alheio/ausente dá 404. |
| `POST /wallet-connection` | Privado; `{walletId,network}` → `{walletId,network,status}`; rede deve coincidir com a carteira. |
| `DELETE /wallet-connection` | Privado; desconecta, 204. |
| `GET /cart` | Visitante ou conta; `{version,items,totals,coupon,couponError,related}`. |
| `POST /cart/items` | `{nftId,editionId,quantity}`; soma à linha existente; 201 com carrinho atualizado. |
| `PATCH /cart/items/:id` | `{quantity}`; substitui quantidade e retorna carrinho. |
| `DELETE /cart/items/:id` | Remove e retorna carrinho. |
| `POST /cart/coupon` | `{code}`; valida código/expiração e retorna carrinho; falha não substitui cupom anterior. |
| `DELETE /cart/coupon` | Remove e retorna carrinho. |
| `GET /checkout` | Privado; dados do carrinho + `wallets`, `collector` (perfil) e `connection`. |
| `POST /quotes` | Privado; sem corpo; `{id,ownerId,fingerprint,expiresAt,items,totals,coupon}`, 201. Validade de cinco minutos. |
| `POST /orders` | Privado; header `Idempotency-Key` e corpo abaixo; novo pedido pending, 201; tentativa existente recupera pedido, 200. |
| `GET /orders/:id` | Privado; `{id,status:pending\|declined}` ou `{id,status:confirmed,receipt}`. |

Username: 3–30 letras minúsculas, números ou `_`; senha: 8–128 caracteres com letra e número; confirmação deve coincidir. E-mail é normalizado em minúsculas. ENS opcional deve usar `nome.eth`; código de indicação não participa do contrato de conta/compra. Campos e regras adicionais dos formulários serão ligados na integração de UI. Endereços EVM exigem `0x` e 40 dígitos hex; Solana usa validação sintática base58 de 32–44 caracteres, sem consulta à blockchain.

### Cotação e pedido

```json
{
  "quoteId": "quote-2",
  "walletId": "wallet-1",
  "network": "ethereum",
  "collector": {
    "displayName": "Ana Colecionadora",
    "email": "ana@kurio.test",
    "notes": "Observação opcional"
  }
}
```

A chave usa de 8 a 128 caracteres alfanuméricos, `-` ou `_`. Seu espaço é por conta: mesma chave e conteúdo normalizado retornam o mesmo pedido, mesmo depois de confirmado/recusado. Conteúdo diferente dá `409 IDEMPOTENCY_CONFLICT`. A consulta da tentativa ocorre antes de revalidar uma cotação já consumida; isso permite recuperar o pedido após timeout.

Uma criação nova compara cotação com carrinho, versão/preço/estoque dos NFTs, cupom/desconto/taxa e expiração. Divergência dá `409 QUOTE_CHANGED`; a UI deverá obter e apresentar nova cotação antes de reenviar. Carteira, conexão e rede também são validadas; carrinho com redes diferentes exige separar as compras.

A criação reserva estoque, persiste a tentativa e retorna pending. Normalmente o pedido resolve em dois segundos, confirmando ou recusando conforme o cenário. O prazo e o resultado ficam persistidos: consulta depois de refresh/reconexão avança pedidos vencidos. Conexão Socket.IO aberta também processa prazos. Não existe dependência de um timer de UI para recuperar o pedido.

Confirmação usa snapshot imutável, conserva preços/totais originais e remove do carrinho apenas as quantidades compradas que ainda estiverem nele. Itens/quantidades acrescentados depois permanecem. Recusa libera reserva e preserva o carrinho. Confirmed e declined são terminais; repetir liquidação não reaplica efeitos. Pedidos históricos não podem ser liquidados pelo controle.

## Cenários e controles de demonstração

`PUT /api/mock/scenario` recebe `{scenario}`; `GET` no mesmo endereço lista o ativo e os disponíveis. Esses controles continuam acessíveis nos cenários de falha para permitir recuperação. Também é possível definir `localStorage['kurio:api-scenario']` e recarregar.

| Cenário | Efeito |
| --- | --- |
| `default` | Latência fixa de 150 ms; catálogo 250 ms. |
| `populated` | É preset do reset, não cenário de rede; prepara itens/carteiras. |
| `empty`, `race` | Catálogo vazio; ou Emerald em 1500 ms e demais buscas em 100 ms. |
| `slow` | Respostas em 1800 ms. |
| `offline`, `error` | Erro de conexão pelo MSW; ou HTTP 503. |
| `timeout` | Resposta além dos dez segundos de timeout do Axios. |
| `validation`, `conflict` | Mutations retornam 422 com fields; ou 409. |
| `forbidden`, `session-expired` | HTTP 403; ou remove sessão, fazendo recursos privados retornarem 401. |
| `wallet-rejected`, `wallet-disconnected` | Recusa conexão com 409; ou devolve estado disconnected. |
| `order-pending` | Pedido novo fica pending até controle explícito de liquidação. |
| `payment-declined` | Pedido novo termina declined após dois segundos. |
| `timeout-after-create` | Persiste pedido/reserva antes de atrasar a primeira resposta por 10,5 s. Retry com mesma chave responde imediatamente com o pedido existente. |

Cenários anteriores de `kurio:mock-scenario` e `kurio:navigation-scenario` continuam disponíveis, mantendo os testes/demonstrações existentes. O reset limpa as três chaves de cenário. Use `default` ou reset para recuperar falhas; configurar uma falha global também afeta consultas de sessão.

Controles adicionais (sempre em `/api/mock`):

| Operação | Entrada / finalidade |
| --- | --- |
| `PATCH /nfts/:id` | `{price?,editions?:[{id,available}]}` altera dados públicos, incrementa versão e emite nft.updated. Estoque disponível é 0–100. |
| `GET /inventory` | Inspeciona inventário público completo. |
| `PATCH /fees` | `{networkFee: "0.02"}` invalida a comparação de cotações anteriores. |
| `PATCH /coupons/:code` | `{expired:true}` permite expirar KURIO10 já aplicado. |
| `POST /orders/:id/settle` | `{status:"confirmed"\|"declined"}` resolve pedido novo e emite eventos correspondentes. |
| `POST /events/replay` | `{name:"nft.updated"\|"order.updated",resourceId,mode:"duplicate"\|"old"}` reenvia o último evento sem alterar o banco. old reduz a versão em um para testar descarte, sem reconstituir uma versão histórica completa dos dados. |
| `POST /connection/disconnect` | Fecha conexões para testar reconexão do cliente. |

## Socket.IO

[createMarketplaceSocket](../src/core/realtime/socket.ts) devolve cliente tipado, inicialmente desconectado. Use `createMarketplaceSocket(origin, session.sessionId)`, registre listeners e então `connect()`. Visitantes omitem o token e recebem apenas eventos públicos. Uma conexão autenticada tem seu token vinculado à sessão; logout/expiração/troca de conta fecha o namespace antigo, sem reconectá-lo como outra conta. Falha de conexão pelo controle permite reconexão da mesma sessão.

Transporte: WebSocket, path `/socket.io/kurio`, namespace padrão, eventos JSON de texto. MSW 3 remove `/socket.io/` antes de comparar a URL lógica, portanto o handler corresponde a `/kurio`. Não há polling, namespaces customizados, anexos binários nem acknowledgements neste contrato. O binding publicado `@mswjs/socket.io-binding@0.2.0` usa `toSocketIo`; o README da branch principal apresenta uma API diferente. Foram conferidos o código instalado e testes com cliente Socket.IO real. O peer metadata do binding ainda pede MSW 2; o projeto usa MSW 3.0.3, combinação validada nos testes mas não declarada compatível pelo pacote. Não foi ocultado o aviso de peer.

Eventos: `{eventId,resourceId,version,data}`. `nft.updated` é público e carrega o NFT com disponibilidade; `order.updated` é enviado apenas à sessão dona e carrega `{id,status}`. Versões são monotônicas por recurso; duplicação/obsolescência são controles de teste. Alterações REST e eventos vêm da mesma transação; replays não modificam REST.

O consumidor da aplicação deverá descartar eventos antigos/duplicados, reconsultar recursos ativos por REST ao reconectar e liberar listeners/socket ao desmontar ou sair. A camada de mocks e os testes entregam o transporte e os cenários; esse consumo pelo cache/UI permanece fora da spec 006. O evento auxiliar `session.expired` permite ao consumidor observar a revogação.

Referências primárias: [binding oficial](https://github.com/mswjs/socket.io-binding), [MSW](https://github.com/mswjs/msw). A API efetivamente adotada foi conferida nos pacotes instalados; a documentação upstream pode descrever outra revisão.

## Verificações

`pnpm test` inclui contratos REST passando pelo MSW Node e Axios. `pnpm test:e2e tests/mocks.spec.ts` verifica persistência/refresh nas rotas existentes, timeout via Axios e eventos/reconexão/isolamento usando socket.io-client no Chromium. Essas verificações não alegam que os botões das operações ainda não integradas executem os fluxos completos.

Resultados e limites executados ficam na [spec 006](../specs/006-dados-mockados.md).


## Integração das telas — entrega final

As telas agora consomem os endpoints acima por services Axios e mutations Query. O reset também remove `kurio:purchase:*` do sessionStorage, além da seleção lembrada, para não recuperar uma tentativa de um banco anterior. Apenas o contexto desta aplicação é removido.

Checkout usa duas ações: **Revisar compra** (`POST /quotes`) e **Confirmar compra** (`POST /orders` com Idempotency-Key). Timeout oferece **Recuperar pedido**, reenviando o mesmo payload/chave; a tentativa sobrevive ao refresh na mesma aba e fica vinculada ao usuário. Durante pending, a interface acompanha Socket.IO e consulta REST a cada dois segundos. Recusa mantém o carrinho e permite nova revisão.

O cliente importa Socket.IO após a inicialização do MSW para usar WebSocket interceptado. Eventos aceitos invalidam consultas ativas; reconexão reconcilia REST. Favoritos têm atualização otimista/rollback; as demais mutations aguardam respostas autoritativas. Veja specs 007–009 para evidências dos fluxos pela interface.
