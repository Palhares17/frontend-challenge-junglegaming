---
name: kurio-figma-to-code
description: "Implemente ou adapte telas e componentes do projeto Kurio a partir de links, frames ou componentes do Figma, preservando fidelidade visual, componentização e padrões locais. Use em pedidos de Figma para código neste repositório. Não use para editar o arquivo Figma, apenas analisar um design ou corrigir código sem referência visual do Figma."
---

# Kurio — Figma para componentes

Transforme a referência solicitada em interface integrada ao projeto. Aplique esta skill junto à skill oficial de Figma para implementação; aqui ficam as decisões específicas do Kurio. Resolva escolhas rotineiras autonomamente e preserve alterações locais.

## 1. Delimitar a referência e o trabalho

- Leia o `AGENTS.md` da raiz e os que se aplicarem aos arquivos afetados, as seções relevantes de `README.md` e `STYLE_GUIDE.md`, e `docs/SDD.md`. Consulte `ARCHITECTURE.md` para decisões compartilhadas e a spec do recorte, quando existir.
- Resolva esses caminhos a partir da raiz do projeto, não da pasta desta skill. Use `rg --files` e buscas direcionadas para localizar os arquivos relacionados.
- Identifique arquivo Figma, nó, variantes desktop/mobile e estados pedidos. O README original e o guia visual apontam para arquivos diferentes: use a referência explícita do pedido; não presuma que os arquivos são equivalentes.
- Se o pedido identificar uma tela sem URL, procure o nó no inventário do guia e no contexto disponível. Esclareça somente ambiguidades que alterem a tela, comportamento, contrato ou escopo. Continue o trabalho independente dessa resposta.
- Confira código, scripts e configurações atuais. Registros históricos sobre ausência de componentes, assets ou testes não demonstram o estado presente.
- Mudanças de comportamento, contrato ou estado seguem o SDD local: crie ou atualize uma spec curta antes do código. Ajustes exclusivamente visuais seguem a dispensa de `docs/SDD.md`. Uma spec não autoriza implementar fluxos extras.

## 2. Obter evidências do Figma

- Descubra e leia a versão disponível de `figma:figma-design-to-code` antes de usar `get_design_context` ou iniciar a implementação. Siga suas exigências atuais de screenshot, contexto detalhado, Code Connect, assets e verificação; não replique esse protocolo nesta skill.
- Se for necessário usar `use_figma`, carregue `figma:figma-use` antes de cada chamada, conforme exigido por essa skill. Não edite o arquivo de design para cumprir um pedido de implementação.
- Analise hierarquia, composição, auto layout, dimensões, tipografia, cores, espaçamentos, bordas, imagens e variantes responsivas no recorte relevante.
- Separe **Figma verificado**, **requisito do README**, **decisão de implementação** e **pendência** nas notas da spec ou na entrega. Um elemento desenhado não comprova comportamento nem define regra de negócio.
- Se faltar acesso, contexto suficiente ou um asset essencial, registre o bloqueio e avance apenas no trabalho sustentado pelas evidências disponíveis. Não apresente uma reconstrução estimada como implementação fiel.

## 3. Planejar a composição a partir do código existente

Antes de editar, procure equivalentes em `src/core/components/ui/`, `src/core/components/general/`, na feature relacionada e em `src/core/lib/assets.ts`. Confira `src/index.css`, `components.json` e os estilos locais.

| Responsabilidade | Destino no padrão atual |
| --- | --- |
| Primitiva de interface shadcn/Base UI | `src/core/components/ui/` |
| Peça com responsabilidade comum entre telas | `src/core/components/general/` |
| Página e componentes específicos da feature | `src/feature/<feature>/views/` e `views/components/` |
| Consulta, mutation e integração com Query | `src/feature/<feature>/hooks/` |
| Transporte HTTP via Axios | `src/feature/<feature>/services/<operacao>/<operacao>.service.ts` |
| Entrada, contratos, lógica pura e simulação | `schemas/`, `entities/`, `lib/` e `mocks/` conforme a necessidade |

- A página compõe seções e conecta o estado. Extraia componentes por responsabilidade, repetição ou complexidade que prejudique a leitura; não crie um componente para cada elemento nem diretórios vazios.
- Use props e callbacks tipados. Peças compartilhadas não devem importar features. Se um componente só serve à tela solicitada, mantenha-o na feature até haver motivo concreto para compartilhá-lo.
- Reutilize composições existentes antes de adicionar abstrações. Considere `IconButton`, `NftArtwork`, `EthPrice`, `SearchField` e `NftCard` quando forem pertinentes; confirme sua API e adequação no código.

## 4. Implementar layout, estado e interação

- Preserve React/TypeScript, Tailwind e shadcn configurados em `components.json`; a base atual usa Base UI. Adapte o código retornado pelo Figma aos componentes e aliases existentes, sem introduzir outra biblioteca visual por conveniência.
- Reutilize os tokens semânticos de `src/index.css`. Se faltar um valor, confira a medida e sua aplicação: adicione token para significado reutilizável ou mantenha a medida específica no componente. Não altere tokens globais para corrigir uma exceção local.
- Preserve hierarquia, proporções, alinhamentos, imagens, recortes e tipografia. Use layout fluido; posicionamento absoluto atende sobreposições deliberadas, não substitui a composição inteira.
- Siga a skill oficial para obter e armazenar assets, mantendo imagens dinâmicas ligadas aos dados. Não use a captura da tela como interface nem URLs temporárias do Figma em runtime.
- Reproduza variantes desktop/mobile verificadas. Quando não houver frame intermediário, faça uma adaptação coerente e registre-a como proposta. A altura e a moldura do mockup não impõem corte fixo ao conteúdo.
- Mantenha navegação/estado de URL no Router, estado remoto no Query e chamadas HTTP nos services Axios, conforme o recorte. Dados fictícios ficam nos mocks MSW, não em views ou hooks como caminhos alternativos de negócio.
- Implemente os estados pertinentes de carregamento, vazio, erro, sucesso e atualização. Use o Skeleton com shimmer existente em conteúdo dependente de dados e respeite movimento reduzido.
- Garanta semântica, labels, alternativas textuais, teclado, foco visível e controle/retorno de foco em diálogos e drawers. Ajustes necessários de acessibilidade devem ser explícitos nas evidências.
- Integre apenas os fluxos autorizados. Para ações ainda sem fluxo, reutilize o feedback explícito de indisponibilidade quando apropriado; não simule sucesso, invente regras ou implemente páginas adicionais por aparecerem no layout.

## 5. Conferir e entregar com evidências

- Execute a interface e compare a captura renderizada com a referência do Figma no mesmo tamanho e estado. Confira também 390, 768 e 1440 px: composição, overflow, textos, recortes de assets, ações, teclado e foco. Para componente isolado, use seu contexto real ou uma montagem temporária removida após a conferência.
- Siga a verificação de assets da skill oficial. Corrija diferenças do recorte solicitado e registre diferenças preexistentes fora dele.
- Consulte os scripts atuais do `package.json` e execute as verificações pertinentes. Atualmente há typecheck, lint, build, Vitest e Playwright; selecione os testes afetados. Para mudança visual simples, prefira comparação renderizada e regressões existentes; não crie testes que apenas repitam a implementação.
- Regressão visual precisa de dados estáveis. Uma baseline criada a partir da própria implementação não comprova aderência ao Figma: confira a referência antes de aceitar ou atualizar snapshots.
- Relacione os critérios da spec às evidências quando houver spec. Registre viewport, cenário, teste/comando, resultado e localização de capturas relevantes. Diferencie inspeção, execução manual, teste automatizado e não executado.
- Atualize a documentação afetada, sem reescrever registros históricos como se fossem evidências novas. Entregue componentes criados/reutilizados, validações executadas, diferenças justificadas e pendências.
- Se uma verificação não puder ser executada, declare o limite; não afirme fidelidade ou funcionamento sem a evidência correspondente.

## Exemplos de acionamento

**Acionar:**

- “Implemente a tela de carteiras deste link do Figma no padrão do projeto.”
- “Adapte o detalhe do NFT ao frame mobile indicado, reutilizando os componentes.”
- “Crie este componente do Figma na feature correspondente e confira o layout.”
- “Ajuste a home para corresponder ao frame desktop do Figma.”

**Não acionar:**

- “Analise a acessibilidade deste Figma e liste problemas.” — análise, sem implementação.
- “Crie ou altere um frame no Figma.” — autoria no Figma, com suas skills próprias.
- “Corrija o cálculo de ETH.” — regra de negócio sem referência visual.
- “Troque o texto deste botão.” — ajuste local sem referência do Figma.
