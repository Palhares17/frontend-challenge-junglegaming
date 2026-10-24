# 011 — Falhas de carregamento com toast e recuperação

Status: em implementação
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
- Contratos REST, filtros, persistência, proteção das rotas e dados existentes permanecem. Sem PWA/offline cache, reset automático de dados, mudanças de Figma ou promessa de toast em erro nativo do navegador.

## Critérios de aceite

- **CA-01:** Dada a URL completa informada, abrir e recarregar em 390/768/1440 px carrega o catálogo, preservando filtros e sem erro JavaScript.
- **CA-02:** Dada uma falha de catálogo, a navegação/filtros permanecem, aparece um único toast de carregamento e uma nova tentativa recupera os resultados sem reload; dados válidos de uma atualização que falha permanecem visíveis.
- **CA-03:** Dada falha de carregamento de rota pública ou privada, aparece toast no layout padrão com nova tentativa/retorno, sem título de tela de erro; retry recupera o conteúdo, sem expor dados privados durante falha da sessão. 404 continua distinto.
- **CA-04:** Dado catálogo indisponível, login/cadastro continuam utilizáveis no mobile/desktop e autenticação pode concluir pela API quando o serviço de sessão está disponível.
- **CA-05:** Toasts não acumulam em rerenders/falhas repetidas e são removidos ao recuperar/sair da tela. Navegação entre telas de produto continua no Router, sem novo documento.

## Tarefas

- [ ] Reproduzir falhas e registrar a causa observada e os limites do diagnóstico.
- [ ] Implementar feedback compartilhado e remover dependência bloqueante na autenticação.
- [ ] Testar recuperação, URLs diretas, sessão, recursos inexistentes e navegação.
- [ ] Executar tipos, lint, build e testes pertinentes; atualizar documentação/evidências.

## Evidências

| Critério | Procedimento | Resultado |
| --- | --- | --- |
| CA-01 | URL original no Aside e Chromium limpo; E2E em três larguras | Aside recuperou após reload; regressão automatizada pendente |
| CA-02 | MSW: catálogo HTTP 503, retry e atualização com cache | Não executado |
| CA-03 | MSW: falhas de detalhe/carrinho/sessão e retry; 404 | Não executado |
| CA-04 | MSW: catálogo falha, formulário/autenticação disponíveis | Não executado |
| CA-05 | Repetição/saída/recuperação, navegação com contagem de documentos | Não executado |

Inspeção: código/URL válidos; erro original de conexão ao documento identificado na aba do usuário. Execução manual: nenhuma; inspeção e interações com navegador realizadas por automação. Verificações automatizadas: pendentes. Não executado: reprodução da causa de baixo nível de `ERR_SOCKET_NOT_CONNECTED` (falha transitória já recuperada).
