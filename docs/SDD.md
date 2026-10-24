# SDD enxuto para o Kurio

Uma mudança de comportamento começa com um contrato curto: o que precisa acontecer, os limites da entrega e como demonstrar o resultado. A mesma spec acompanha implementação e validação. Esta é uma adaptação local de Spec-Driven Development (desenvolvimento orientado por especificações), sem dependências adicionais.

## Por que adotar aqui

O [README](../README.md) já define os requisitos do desafio; o [guia de estilo](../STYLE_GUIDE.md) registra referências visuais e decisões. Precisamos transformar partes desse escopo em entregas pequenas e verificáveis, evitando duplicar esses documentos.

Na inspeção de 23/10/2026, há código para home, parâmetros de URL, consulta via Axios/Query e handlers MSW de catálogo. Isso é evidência de implementação, não de funcionamento validado. Playwright e Vitest estão nas dependências, mas não foram encontradas configurações, suítes ou scripts de teste. O texto inicial do README ainda descrevia somente uma marca; foi atualizado nesta adoção para distinguir código existente de validação pendente.

## O que aproveitar da pesquisa

| Fonte primária | Prática documentada | Adaptação neste projeto |
| --- | --- | --- |
| [GitHub Spec Kit](https://github.com/github/spec-kit#spec-driven-development) | Princípios do projeto, especificação, plano, tarefas e implementação. | Regras estáveis em `AGENTS.md`; comportamento e plano no mesmo arquivo. |
| [Kiro Specs](https://kiro.dev/docs/specs/) | Requisitos e critérios de aceite, design e tarefas em três arquivos. | Preservar o conteúdo essencial em seções curtas de uma spec. |
| [Kiro Quick Spec](https://kiro.dev/docs/specs/quick-spec/) | Geração das três partes em sequência, sem aprovação intermediária de cada fase. | Executar trabalho já autorizado sem criar pausas por seção. O Quick Spec continua usando três arquivos; o arquivo único é nossa escolha. |
| [OpenSpec](https://github.com/Fission-AI/OpenSpec#why-openspec) | Artefatos por mudança e evolução iterativa de requisitos, design e tarefas. | Uma mudança por arquivo, atualizado junto com o código. |

Fontes consultadas em 23/10/2026. A recomendação de um arquivo único é uma decisão para este repositório, não um padrão oficial dessas ferramentas. A pesquisa descreve práticas; não demonstra uma redução quantitativa de erros neste projeto.

## Quando criar uma spec

| Tipo de trabalho | Registro suficiente |
| --- | --- |
| Texto, espaçamento, token ou refatoração local sem mudar comportamento | Objetivo e verificação na entrega; sem arquivo novo. |
| Nova interação, correção de regra, estado de URL, persistência ou contrato | Uma spec de aproximadamente 30–60 linhas, com 3–6 critérios observáveis. |
| Sessão, compra, precisão monetária, idempotência ou tempo real | Uma spec por recorte verificável, com falhas, recuperação e invariantes explícitas. Dividir quando houver entregas independentes. |

Esses tamanhos orientam concisão; não justificam omitir requisitos. Comece pelas mudanças novas. Documente comportamento existente somente quando ele for afetado ou precisar de validação.

## Fluxo de trabalho

1. **Situar:** ler o pedido, os trechos relevantes do README e do guia, o código afetado e uma spec relacionada, se houver. Registrar o que foi observado e o que é proposta.
2. **Especificar:** copiar [o template](../specs/_template.md) para `specs/NNN-descricao.md`. Preencher objetivo, limites, critérios e abordagem. Formular critérios como “Dado…, quando…, então…”, com resultado observável. Incluir falha e recuperação quando aplicáveis.
3. **Implementar:** seguir poucas tarefas no mesmo arquivo. Registrar suposições reversíveis e continuar no escopo autorizado. Esclarecer dúvidas que alterem contrato ou resultado esperado; a existência da spec não amplia a autorização do pedido.
4. **Verificar:** ligar cada critério a um teste ou procedimento reproduzível e ao resultado observado. Corrigir divergências entre código e spec antes de concluir.
5. **Encerrar:** atualizar evidências, status e documentação afetada na mesma entrega. Uma verificação pendente mantém a spec em validação. Não converter o comportamento acidental do código em requisito para fazer um teste passar.

Estados: `proposta` → `em implementação` → `em validação` → `concluída`. O status indica progresso, não uma etapa obrigatória de aprovação. Mantenha o arquivo no mesmo caminho; use Git para consultar seu histórico.

## Conteúdo e fontes de verdade

- **README, seções 1–12:** requisitos do desafio. A spec referencia a seção e detalha o recorte sem dispensar exigências da entrega completa.
- **STYLE_GUIDE:** referência visual, propostas e evidências históricas. Preserve essa distinção; uma proposta não é uma medição do Figma. O guia registra divergência entre o arquivo Figma inspecionado e o link do README; não assuma equivalência ao implementar telas.
- **Spec ativa:** comportamento esperado e decisões da mudança. Use caminhos para localizar código, sem copiar implementações inteiras.
- **Código e contratos tipados:** estado implementado. Divergências com requisitos precisam ser resolvidas e registradas.
- **Evidências:** o que foi realmente executado e observado. Inspeção estática não comprova interação, acessibilidade, responsividade ou integração.

Decisões locais ficam na spec. Quando afetarem várias features, registre a decisão compartilhada em `ARCHITECTURE.md`, conforme a entrega exigir, e referencie-a nas specs.

## Validação proporcional

| Mudança | Evidência esperada |
| --- | --- |
| Apenas documentação | Conteúdo consistente, caminhos e links locais válidos. |
| Regra pura, parser ou cálculo | Testes de exemplos e limites relevantes, além das verificações estáticas. |
| Fluxo de UI, REST, sessão ou persistência | Playwright com MSW, observando UI e resultado; incluir recuperação de falha. |
| Socket.IO, pedido ou cotação | Cenários determinísticos, passando pelos transportes exigidos; duplicação, obsolescência e reconexão conforme o recorte. |
| Interface visual | Conferência em 390, 768 e 1440 px e teclado; regressão visual nas telas exigidas pelo README. |

Para mudanças de código, os comandos disponíveis são `pnpm typecheck`, `pnpm lint` e `pnpm build`. Eles não comprovam os critérios de interação. Configure os testes necessários no recorte correspondente; só documente comandos após existirem. Uma reprodução manual ajuda a investigar, mas não substitui os E2E exigidos na entrega final.

Uma spec está concluída quando todos os seus critérios têm evidência satisfatória, as tarefas estão finalizadas e a documentação reflete o resultado. Não marque “passou” para testes planejados ou não executados.

## Como começar

O [piloto de validação do catálogo](../specs/001-validacao-catalogo.md) mostra como aplicar o modelo ao código existente. Ele foi validado junto à implementação da home: contém os comandos, testes executados e evidências por critério. O registro histórico da inspeção inicial acima precede essa validação; a conclusão do piloto não comprova os demais fluxos do desafio.

Para um próximo pedido, use: “Siga `docs/SDD.md` para implementar [mudança]. Crie ou atualize a spec do recorte, execute o trabalho autorizado e entregue as evidências por critério.”

Depois de três mudanças, compare tempo gasto especificando, retrabalho após validação e defeitos reabertos com as entregas anteriores, quando houver registros comparáveis. São indicadores para ajustar o processo, sem metas inventadas ou promessa de eliminar erros.
