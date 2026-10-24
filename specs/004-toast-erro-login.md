# 004 — Toast de erro no login

Status: concluída
Atualização: 2026-10-23
Referências: README (conta e sessão), STYLE_GUIDE (cores e estados), docs/SDD.md.

## Objetivo e limites

Substituir a mensagem de erro acima do formulário de login por um toast com react-hot-toast, conforme pedido e captura do usuário.
Inclui falhas de credenciais e falhas transitórias do envio de login. Cadastro, feedback de outras operações e contratos da API permanecem no escopo existente.

## Contexto e decisões

- Observado: AuthRoutePage deriva mutation.error e AuthScreen renderiza um parágrafo role=alert antes do formulário.
- Implementado: toast.error no callback onError de cada envio e Toaster compartilhado em src/core/, com tokens existentes, no topo da viewport. Callback por envio evita notificação tardia após desmontagem.
- Manter região viva acessível fora do conteúdo ocultado pelo modal desktop; evitar duplicação e remover o toast ao reenviar ou sair da autenticação.
- Contratos/estado: Axios, Query, MSW, sessão e redirecionamento mantidos; apenas apresentação da falha muda.
- Ícone CircleAlert estático para permanecer completo com redução de movimento; região viva montada antes do modal, em portal no body. ariaProps explícitas na chamada toast.error, pois o padrão do toast prevalece sobre essa opção no Toaster da versão instalada (2.6.1).

## Critérios de aceite

- **CA-01:** Dadas credenciais inválidas, quando a API retorna 401, então aparece um único toast “E-mail ou senha inválidos.” e nenhum erro inline, sem deslocar os campos.
- **CA-02:** Dada falha transitória no envio, quando a API retorna 503, então o toast informa “Não foi possível entrar. Tente novamente.”; os valores permanecem e um novo envio válido recupera o fluxo.
- **CA-03:** Dado erro visível, quando há reenvio ou saída do login, então o toast anterior é removido; sucesso preserva sessão e destino de retorno.
- **CA-04:** Em 390, 768 e 1440 px, o toast fica dentro da viewport, acessível como alerta inclusive no modal, desaparece automaticamente e permite continuar pelo teclado.

## Tarefas

- [x] Instalar react-hot-toast, integrar Toaster e substituir erro inline (CA-01–04).
- [x] Verificar falhas, recuperação, responsividade e teclado com Playwright/MSW.
- [x] Registrar evidências e atualizar documentação afetada.

## Evidências

| Critério | Teste ou procedimento reproduzível | Resultado e referência |
| --- | --- | --- |
| CA-01 | tests/auth-toast.spec.ts: erro em três larguras, boundingBox dos campos antes/depois e nova falha | Passou: único alerta fora do formulário, campos sem deslocamento e valores preservados |
| CA-02 | tests/auth-toast.spec.ts: cenário MSW error após abrir login e reenvio | Passou: POST 503, mensagem genérica e recuperação para perfil com os mesmos campos |
| CA-03 | tests/auth-toast.spec.ts: reenvio, troca para cadastro, Escape e resposta 401 tardia; tests/navigation.spec.ts: login com query/hash e refresh | Passou: remoção, ausência de erro tardio, retorno e sessão preservados |
| CA-04 | tests/auth-toast.spec.ts: 390/768/1440 px, role alert assertive, elementFromPoint, viewport, expiração e Enter; tests/design.spec.ts: login/cadastro e teclado | Passou: toast acima da UI, sem overflow, timeout observado, envio por teclado e seis baselines visuais preservadas |

Inspeção: autenticação, sessão, dialog, configuração de testes e implementação instalada da lib; capturas de toast em três larguras conferidas. Após ajuste do ícone, capturas mobile/desktop conferidas novamente.
Execução manual interativa: não executada; os fluxos foram exercitados por Playwright/Chromium com Axios e MSW.
Teste automatizado: `pnpm test:e2e tests/auth-toast.spec.ts tests/navigation.spec.ts tests/design.spec.ts --grep 'toast|login|register|auth dialog|login validates'` — 17 passaram. Após ajuste final do ícone, `pnpm test:e2e tests/auth-toast.spec.ts` — 6 passaram. Screenshots em `test-results/auth-toast-*/login-toast.png`.
Verificações gerais: `pnpm typecheck`, `pnpm lint` e `pnpm build` passaram após a alteração final. README e ARCHITECTURE atualizados. A primeira execução identificou ariaProps sobrescritas; a correção foi revalidada. Testes executados fora do sandbox para permitir o servidor local.
Verificação não executada: leitor de tela real e suite E2E integral; cobertos os fluxos afetados e regressão visual de autenticação.
Pendências do recorte: nenhuma.
