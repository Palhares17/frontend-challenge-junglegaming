# Kurio — guia de estilo e mapa da UI

Análise de 22/10/2026. Documento de referência para planejamento e desenvolvimento; não implementa componentes nem configura dependências.

## 1. Fontes, evidências e limites

- **[Figma]**: propriedade medida no arquivo, estrutura de camadas ou aparência conferida em captura. Quando a evidência for apenas estrutural, isso será informado.
- **[README]**: comportamento ou critério exigido pelo desafio, mesmo sem representação no layout.
- **[Proposta]**: decisão de implementação ou complemento visual; não é uma especificação extraída do Figma.
- **[Pendente]**: informação que não pôde ser confirmada ou decisão ainda aberta.

Arquivo analisado: [Untitled — Page 1](https://www.figma.com/design/7jzy1utqt6Et0TTEOYmkcp/Untitled?node-id=0-1), chave `7jzy1utqt6Et0TTEOYmkcp`. Esta é a referência enviada pelo usuário; o README aponta para outra chave de arquivo. O README foi preservado.

**[Figma]** A inspeção encontrou uma página (`0:1`, `Page 1`), com 15 frames principais, sem outras páginas na raiz. Foram lidas a árvore completa dessa página, as propriedades visuais dos nós visíveis e uma resposta de contexto de design da home. Foram obtidas 13 capturas individuais: a home e 12 das demais telas.

**[Pendente]** O MCP informou limite de chamadas do plano Starter. As capturas individuais de **Desktop / Login** e **Mobile / Detalhes do NFT**, e a consulta complementar de definições de variáveis, foram recusadas. Essas duas telas têm metadados completos, mas não foram conferidas visualmente. Não usar suas descrições estruturais como prova de validação visual. Os valores numéricos dos gradientes também precisam de uma leitura complementar.

**[Figma]** As consultas de coleções de variáveis e estilos locais retornaram listas vazias. Entretanto, o contexto da home referencia estilos e nomes semânticos, como `Color/Primary` e `Display/43 Bold`. Portanto, os valores resolvidos abaixo foram conferidos, mas não foi confirmada a origem/publicação de uma biblioteca de tokens. Não há uma página dedicada a design system no arquivo inspecionado.

Nenhum asset foi baixado nesta etapa. Nenhuma alteração foi feita no arquivo Figma.

## 2. Inventário das telas

Todas as dimensões abaixo são as dos frames de referência, em pixels, arredondadas para eliminar resíduos decimais de posicionamento. Altura do frame não determina altura fixa da página implementada.

| Tela | Desktop | Mobile | Composição e situação |
| --- | --- | --- | --- |
| Início | [1:661](https://www.figma.com/design/7jzy1utqt6Et0TTEOYmkcp/Untitled?node-id=1-661), 1440 × 3668 | [1:1531](https://www.figma.com/design/7jzy1utqt6Et0TTEOYmkcp/Untitled?node-id=1-1531), 414 × 896 | Desktop com header, hero, sidebar de filtros, grid, paginação, promoções, seção editorial e footer. Mobile com busca, botão de filtros, hero compacto, grid em duas colunas alternadas e navegação inferior. |
| Detalhes do NFT | [1:844](https://www.figma.com/design/7jzy1utqt6Et0TTEOYmkcp/Untitled?node-id=1-844), 1440 × 2246 | [1:1629](https://www.figma.com/design/7jzy1utqt6Et0TTEOYmkcp/Untitled?node-id=1-1629), 414 × 896 | Desktop com galeria, edição, quantidade, compra, favorito, informações, avaliações e relacionados. Metadados mobile mostram hero, painel sobreposto de informações e barra de compra; captura pendente. |
| Carrinho de NFTs | [1:994](https://www.figma.com/design/7jzy1utqt6Et0TTEOYmkcp/Untitled?node-id=1-994), 1440 × 1754 | [1:1694](https://www.figma.com/design/7jzy1utqt6Et0TTEOYmkcp/Untitled?node-id=1-1694), 414 × 896 | Tabela e resumo lado a lado no desktop; cards empilhados e resumo inferior no mobile. Quantidades e itens de exemplo diferem entre as versões. |
| Pagamento | [1:1150](https://www.figma.com/design/7jzy1utqt6Et0TTEOYmkcp/Untitled?node-id=1-1150), 1440 × 1657 | [1:1785](https://www.figma.com/design/7jzy1utqt6Et0TTEOYmkcp/Untitled?node-id=1-1785), 414 × 896 | Desktop com formulário do colecionador, itens, totais e provedores de carteira. Mobile mostra carteiras salvas, provedores e total; os dados do colecionador e a revisão completa precisam ser acomodados no fluxo. |
| Confirmação de pedido | [1:1153](https://www.figma.com/design/7jzy1utqt6Et0TTEOYmkcp/Untitled?node-id=1-1153), 1440 × 1657 | Ausente | Modal `1:1157`, 578 × 821, sobre a composição do checkout. Contém metadados, itens, taxa, total e ação de exploração. Adaptar para mobile é obrigatório. |
| Login | [1:1248](https://www.figma.com/design/7jzy1utqt6Et0TTEOYmkcp/Untitled?node-id=1-1248), 1440 × 1981 | [1:1907](https://www.figma.com/design/7jzy1utqt6Et0TTEOYmkcp/Untitled?node-id=1-1907), 414 × 896 | Metadados desktop indicam formulário em modal sobre `Marketplace Page`; captura pendente. Mobile é uma tela própria com marca, e-mail, senha, recuperação e botões sociais. |
| Cadastro | [1:1282](https://www.figma.com/design/7jzy1utqt6Et0TTEOYmkcp/Untitled?node-id=1-1282), 1440 × 1981 | [1:1927](https://www.figma.com/design/7jzy1utqt6Et0TTEOYmkcp/Untitled?node-id=1-1927), 414 × 896 | Modal sobre marketplace no desktop; tela própria no mobile. Nome de usuário, e-mail, senha, confirmação e botões sociais. |
| Perfil do colecionador | [1:1316](https://www.figma.com/design/7jzy1utqt6Et0TTEOYmkcp/Untitled?node-id=1-1316), 1440 × 1080 | Ausente | Sidebar de conta, dados, ENS, apelido da carteira, avatar e alteração de senha. Adaptar para mobile é obrigatório. |
| Carteiras | [1:1414](https://www.figma.com/design/7jzy1utqt6Et0TTEOYmkcp/Untitled?node-id=1-1414), 1440 × 1080 | Ausente | Sidebar de conta, formulário principal e seção secundária ainda vazia. Adaptar para mobile é obrigatório. |

**[Figma]** Não há frames específicos de tablet nem variantes principais separadas para carregamento, falha, cotação alterada ou pedido pendente/recusado. A seção vazia de carteira secundária é um estado desenhado; não confundir com ausência de todos os estados vazios.

## 3. Navegação e fluxos

### O que está definido no arquivo

**[Figma]** A inspeção dos nós visíveis encontrou zero `reactions` de protótipo e zero `flowStartingPoints`. Há elementos visuais de navegação, mas não conexões configuradas que comprovem seus destinos. Links de texto externos não equivalem a transições de protótipo.

Elementos observados: header com Início/Mercado/Criadores/Aprenda, busca, carrinho e Entrar; breadcrumbs; links entre login e cadastro; sidebar da conta; setas de retorno mobile; navegação inferior mobile; ações Comprar, Conectar e finalizar, Confirmar compra e fechar modal.

### Fluxo de aplicação proposto

**[Proposta, orientada pelo README]**:

1. Início/catálogo → detalhe → escolha de edição e quantidade → carrinho.
2. Carrinho → autenticação, quando necessária → retorno ao checkout com os itens preservados.
3. Checkout → dados do colecionador → carteira/rede → revisão da cotação → envio do pedido.
4. Pedido pendente → consulta/reconciliação → confirmado com recibo, ou recusado com recuperação da compra.
5. Conta → perfil ou carteiras → salvar pela API → feedback de resultado.

**[README]** Sessão expirada deve preservar o contexto de retomada. Novo preço, disponibilidade, cupom ou taxa deve exigir nova confirmação. Recibo só aparece após confirmação efetiva da simulação, usando o snapshot do pedido.

**[Proposta]** Mercado e Explorar levam ao catálogo da home, preservando parâmetros; não criar uma segunda página de catálogo sem necessidade. A confirmação tem endereço próprio, mesmo quando apresentada como modal no desktop. Acesso direto deve funcionar sem depender de uma página anterior no histórico.

**[Pendente]** O botão central da navegação mobile lembra uma ação de leitura/scan, mas o arquivo não define sua função. Não atribuir uma funcionalidade fictícia. O ícone de favoritos pode abrir uma visualização filtrada do catálogo autenticado; esse destino é proposta, não ligação existente.

**[README]** Páginas editoriais, suporte, atividade, ofertas e downloads estão fora do escopo. **[Proposta]** Preservar a composição visual das seções presentes na home, com ações auxiliares que informem sua indisponibilidade na demonstração ou destinos externos válidos. Newsletter, recuperação de senha e login social não ganharão sucesso simulado sem fluxo definido. Não implementar páginas extras apenas porque há links no layout.

## 4. Direção visual

**[Figma]** Marca `KURIO`, tema escuro de tons marrons, cobre nas ações, textos claros e dourados atenuados. Roboto Mono em toda a interface inspecionada. As imagens de macacos colecionáveis têm papel central na composição.

O desktop tem cartões e superfícies predominantemente retos, com raios discretos em controles. No mobile há mais arredondamento, cards orgânicos, sombras pronunciadas e alguns botões com aparência de cápsula e gradiente. Login e cadastro mobile usam CTAs com arredondamento moderado. Evitar aplicar uma única aparência de botão ou card indiscriminadamente a todas as telas.

**[Proposta]** O tema do projeto será guiado pelos tokens deste documento. Os componentes shadcn/ui receberão a identidade Kurio. Não foi observado tema claro.

## 5. Cores e tokens

Valores sólidos medidos nos preenchimentos e contornos; nomes CSS são propostas de normalização. Os nomes de estilo indicados são os retornados pelo contexto da home.

| Token proposto | Valor observado | Função e evidência |
| --- | --- | --- |
| `--color-ink` | `#140D0A` | `Color/Ink`; fundo principal `1:661` e tinta dos botões primários. |
| `--color-foreground` | `#F5F1EB` | `Color/Foreground`; texto principal e marca no header `1:663`. |
| `--color-primary` | `#D28A4C` | `Color/Primary`; preenchimento de CTA, indicadores e divisores ativos. |
| `--color-text-accent` | `#E89B55` | `Text/Accent`; links, preços e navegação ativa. |
| `--color-text-secondary` | `#CFB28C` | `Text/Secondary`; descrições, metadados e labels secundários. Ex.: `1:673`. |
| `--color-secondary` | `#B39463` | `Color/Secondary`; placeholder, preço anterior e ícones secundários. Ex.: `1:724`. |
| `--color-surface-card` | `#241612` | `Color/Surface Card`; filtros `1:683`, modal, cards e footer. |
| `--color-surface-dark` | `#38220F` | `Color/Surface Dark`; faixa da marca no footer e input da newsletter. |
| `--color-surface-control` | `#2F1D15` | Superfícies circulares, ex.: `1:864`. Nome semântico proposto. |
| `--color-border` | `#3F2319` | `Color/Border`; bordas de inputs, paginação e divisórias sutis. |
| `--color-border-soft` | `#55321F` | `Color/Border Soft`; contornos secundários, chips e ícones. |
| `--color-required` | `#F0805F` | Asteriscos de obrigatoriedade em checkout e conta. Usar como erro é proposta. |
| `--color-text-editorial` | `#F7F3EC` | Variante do título da seção editorial `1:804`. Preservar onde aplicável. |

Também aparecem `#FBFBFB`, `#EDEDED`, preto e cores de marcas sociais. São valores locais de elementos gráficos, máscaras ou logos; não constituem automaticamente novos tokens globais. Os verdes encontrados pertencem ao logo do Google e não comprovam um estado de sucesso do produto.

**[Pendente]** Os gradientes visíveis no hero e em controles mobile não tiveram ângulos, stops e opacidades extraídos. Não tratar uma interpolação entre os tons sólidos como equivalente ao original. Tokens sugeridos `--gradient-hero` e `--gradient-action` ficam sem valor até essa medição.

### Estados sem paleta completa desenhada

**[Proposta]** Usar `--color-required` para erro com ícone e mensagem; cobre para avisos de atualização; texto claro com ícone e mensagem explícita para sucesso. Não introduzir uma cor verde global com base no logo social. Estados financeiros sempre devem ter um rótulo textual: pendente, confirmado ou recusado.

### Contraste e ajustes necessários

Razões calculadas a partir dos valores sólidos medidos, sem gradientes/opacidade; não substituem a auditoria da interface pronta.

| Par sólido | Razão aproximada | Orientação |
| --- | --- | --- |
| `#F5F1EB` sobre `#140D0A` | 17,10:1 | Texto principal. |
| `#CFB28C` sobre `#241612` | 8,68:1 | Texto secundário. |
| `#B39463` sobre `#241612` | 6,12:1 | Texto atenuado. |
| `#140D0A` sobre `#D28A4C` | 6,85:1 | Preferir esta tinta nos CTAs sólidos. |
| `#F5F1EB` sobre `#D28A4C` | 2,50:1 | Insuficiente para texto comum; ajustar onde aparecer, como em Aplicar no carrinho mobile. |
| `#3F2319` sobre `#140D0A` | 1,34:1 | Borda muito sutil para ser o único indicador de um controle. |
| `#55321F` sobre `#140D0A` | 1,71:1 | Mesmo cuidado com limites e estados de controles. |

**[Proposta]** Controles que dependam da borda para serem identificados precisam de contraste adequado, preservando o tom quente; usar cobre no foco, sem depender apenas de mudança de cor. Registrar os ajustes adotados em `ARCHITECTURE.md` na implementação, conforme o README.

## 6. Tipografia

**[Figma]** Família `Roboto Mono`, pesos Regular 400, Medium 500 e Bold 700. Todos os segmentos de texto inspecionados usam essa família. A API também retorna configurações de variação de peso; a disponibilidade dos arquivos de fonte ainda não foi verificada.

| Uso/token proposto | Tamanho / peso / entrelinha observados | Referência |
| --- | --- | --- |
| `display-desktop` | 43 / 700 / 70 px | Título do hero `1:672`. |
| `display-mobile` | 18 / 700 / 29 px | Título do hero mobile `1:1551`. |
| `brand-mobile` | 32 / 700 / Auto, tracking 10% | Wordmark `1:1909`, `1:1929`. |
| `brand-desktop` | 14 / 700 / Auto, tracking 10% | Wordmark no header `1:663`. |
| `heading-editorial` | 28 / 700 / Auto | Seção editorial `1:804`. |
| `heading-featured` | 24 / 700 / 32 px | NFT em destaque `1:688`. |
| `heading-mobile` | 20 / 700 / 16 px | Título do detalhe mobile `1:1648`; apenas propriedades, captura pendente. |
| `section-title` | 18 / 700 / 16 px | Filtros, resumo e títulos de conta. |
| `promo-title` | 18 / 700 / 24 px | Promoção `1:774`. |
| `product-title` | 16 / 400 / 16 px | Card de catálogo `1:711`. |
| `action-label` | 16 / 700 / 20 px | Explorar `1:675`; outros botões têm variações. |
| `filter-row` | 15 / 400 ou 700 / 40 px | Itens de coleção e contadores. |
| `body` | 14 / 400 / 22 ou 24 px | Footer e descrição do hero. |
| `eyebrow` | 14 / 500 / 16 px, tracking 10% | Boas-vindas `1:671`. |
| `caption` | 12 / 500 / 16 px | Metadados editoriais `1:810`. |
| `badge` | 10 / 500 / Auto | Quantidade no header. |

Há ainda usos pontuais de 9, 13, 17, 21 e 22 px. Não transformar toda variação em uma hierarquia semântica global: símbolos, metadados e ícones tipográficos podem manter estilos locais.

**[Proposta]** Token de família `--font-ui: "Roboto Mono", monospace`, pesos 400/500/700 e variantes de texto nomeadas por função. `Auto` deve ser tratado como valor observado do Figma, sem convertê-lo arbitrariamente em uma altura em pixels. Tracking de 10% corresponde à intenção de `0.1em`; conferir com a fonte real carregada.

**[Proposta]** Preservar os tamanhos e pesos de referência, mas revisar entrelinhas inferiores ao tamanho da fonte quando houver quebra de linha, zoom ou texto dinâmico. Para novos textos de estado, começar com 14/22 ou 14/24. Labels não devem desaparecer quando o usuário preencher o campo. Preços devem manter alinhamento numérico e precisão, sem assumir que todos terão o mesmo comprimento.

## 7. Espaçamentos, grid e responsividade

### Medidas observadas

| Região | Medida | Referência |
| --- | --- | --- |
| Container desktop | 1200 px em frame de 1440; margens de 120 px | Home `1:662`, detalhe `1:845`, conta `1:1317`. |
| Início vertical desktop | 24 px no topo; 32 px entre header e hero; 96 px entre grandes blocos | Home `1:661` e `1:662`. |
| Hero desktop | 1200 × 450 px; imagem 450 × 450 px | `1:664`, `1:680`. |
| Catálogo desktop | Sidebar 310 px + intervalo 48 px + grid 842 px | `1:681`, `1:682`, `1:695`. |
| Grid desktop | Três colunas de 258 px; intervalo horizontal de 34 px | `1:708`; altura varia com o conteúdo. |
| Card desktop | Fundo de imagem 258 × 300 px; vários assets em slots de 250 × 250 px | `1:709`, `1:710`, `1:713`. |
| Relacionados desktop | Cinco cards de aproximadamente 219–220 px | `1:1110` e seus filhos. |
| Conta desktop | Sidebar 310 px + intervalo 28 px + formulário 862 px | `1:1319`, `1:1351`; mesmo padrão nas carteiras. |
| Galeria desktop | Grupo de 573 × 448 px; miniaturas de 100 × 100 px | `1:850`, `1:851`. |
| Home mobile | Margens 24 px; conteúdo 366 px | `1:1532`, `1:1571`. |
| Grid mobile | Duas colunas de 175 px, intervalo 16 px; coluna direita deslocada 32 px | `1:1572`, `1:1593`, `1:1594`. |
| Hero mobile | 366 × 190 px | `1:1540`. |
| Formulários mobile | Margens 28 px; conteúdo 358 px; campos de 50 px; intervalo 12 px | `1:1912`, `1:1932`. |
| CTA principal mobile | Altura 60 px | `1:1922`, `1:1948`, `1:1905`. |
| Resumo do carrinho mobile | Largura 414 px, padding horizontal 24 px | `1:1763`, `1:1764`. |
| Confirmação desktop | Modal de 578 px de largura | `1:1157`. |

**[Figma]** Gaps recorrentes medidos no auto layout incluem 4, 6, 8, 10, 12, 16, 20, 24, 28, 32, 40, 48 e 96 px. Também existem intervalos específicos da composição; a presença de um número isolado não o torna token reutilizável.

**[Proposta]** Manter a escala acima em tokens de espaçamento por valor, como `--space-6: 6px`, `--space-12: 12px` e `--space-28: 28px`. Tokens semânticos de layout: `--container-max: 1200px`, `--gutter-home-mobile: 24px`, `--gutter-form-mobile: 28px` e `--section-gap-desktop: 96px`. Não arredondar tudo para múltiplos de 8.

### Breakpoints e comportamento propostos

**[Figma]** São observáveis referências em 414 e 1440 px. Não há evidência de um breakpoint exato entre elas. **[README]** Validar pelo menos 390, 768 e 1440 px.

**[Proposta inicial]** Usar 768 px para reorganização intermediária e 1024 px para entrada dos layouts com sidebar/header desktop, ajustando pelo espaço real necessário. Esses números são hipóteses de implementação, não propriedades medidas do arquivo. Se a sidebar e os cards ficarem comprimidos, manter o painel de filtros recolhido até haver espaço suficiente.

- Container desktop centralizado com limite de 1200 px, sem impor 120 px de margem em todas as larguras.
- Filtros mobile em drawer com os mesmos parâmetros da URL; ordenação e paginação devem permanecer acessíveis mesmo sem variantes desenhadas.
- Grid com ordem de leitura e tabulação lógica, mesmo quando a composição mobile tiver deslocamento entre colunas.
- Tabela do carrinho vira lista de cards; nenhuma coluna necessária pode desaparecer.
- Perfil e carteiras mobile com formulário em coluna única e acesso compacto à navegação de conta.
- Checkout mobile em etapas ou seções que incluam dados, carteira/rede e revisão completa. A tela desenhada de carteira não cobre sozinha todos os requisitos.
- Confirmação mobile em página ou painel de largura disponível, com rolagem e quebra de identificadores longos.
- Navegação inferior e barra de compra não podem cobrir o conteúdo. Reservar espaço no documento e considerar `safe-area-inset-bottom`.
- Não reproduzir o raio de 40 px do contorno dos frames mobile como arredondamento obrigatório de toda a página web; pode ser apresentação do dispositivo. Decisão pendente de validação.
- Não limitar páginas a 896 px nem recortar conteúdo para caber no frame. O cadastro mobile já ocupa quase toda a altura de referência antes de mensagens de validação.

## 8. Bordas, raios e sombras

**[Figma]** Bordas de 1 px são recorrentes; ícones usam frequentemente 1,5 px. Há underlines ativos de 2–3 px e divisor de header de aproximadamente 0,3 px. Preservar a aparência sutil de divisores, sem tornar contornos essenciais imperceptíveis.

| Token/uso proposto | Observação |
| --- | --- |
| `radius-none` = 0 | Superfícies e cards desktop são majoritariamente retos. |
| `radius-input-desktop` = 3 px | Campo de cupom `1:1083` e diversos controles. |
| `radius-pagination` = 4 px | Paginação `1:761`. |
| `radius-button` = 6 px | Botão Entrar do header; também usado em controles do filtro. |
| `radius-promo` = 8 px | Promoções `1:772`. |
| `radius-input-mobile` = 10 px | Padrão visível em busca e formulários mobile; conferir cada variante. |
| Raios locais de imagem | 11–24 px e outros valores; pertencem ao slot/arte, não a todo card. |
| Controles circulares | Usar círculo ou cápsula de acordo com sua geometria; não compartilhar o raio de um avatar com o de um input. |

**[Figma]** Sombras medidas, convertidas para notação CSS de referência:

| Uso | Valor de referência |
| --- | --- |
| Campo da newsletter | `0 0 20px 0 rgba(10, 6, 4, 0.45)` |
| Controle de quantidade desktop | `0 4px 12px -2px rgba(20, 13, 10, 0.149)` |
| Variante maior de quantidade | `0 6.6px 19.8px -3.3px rgba(20, 13, 10, 0.149)` |
| Card do carrinho mobile | `0 6px 20px 0 rgba(10, 6, 4, 0.45)` |
| Navegação inferior mobile | `0 -10px 30px 0 rgba(10, 6, 4, 0.45)` |
| Carteira mobile, uma variante | `0 20px 20px 0 rgba(10, 6, 4, 0.45)` |

**[Proposta]** Manter tokens separados para sombra de controle, card mobile e navegação. Não aplicar sombra global a toda superfície. A opacidade exata do overlay de modal ainda não foi medida; escurecer o fundo sem comprometer legibilidade e foco é uma especificação proposta.

## 9. Componentes e estados

### Elementos reutilizados no arquivo

**[Figma]** Foram encontradas instâncias de `Header With Divider`, `Header Row`, `Filters`, `Footer`, `Checkout Page`, `Marketplace Page`, `Social Button`, `Password Input` e `Mobile Social Block`, além de ícones. Não confundir instâncias de páginas inteiras com componentes que necessariamente devem existir da mesma forma no código.

O contexto da home identifica componentes-fonte `Header Row` (`1:25`), `Header With Divider` (`1:68`), `Filters` (`1:82`) e `Footer` (`1:184`). Como a localização dessas definições não foi confirmada no inventário de raiz, usar como referências de componente, não como telas adicionais.

**[Figma]** A descrição do header distingue versão com divisor em home/conta/autenticação e versão sem divisor no fluxo de mercado. Header ativo usa texto em cobre e underline. A seleção da conta usa faixa lateral e texto destacado. Edições e carteiras usam borda/indicador de seleção. O backdrop de marketplace do cadastro inclui ações sobre um card e badge de raridade; isso indica uma variante visual, sem comprovar um comportamento de hover no protótipo.

### Proposta de componentes compartilhados em `core/`

| Local | Componentes/responsabilidade |
| --- | --- |
| `core/components/ui/` | Primitivos shadcn/ui adaptados: botão, input, textarea, select, checkbox/radio, slider, tabs, dialog, drawer/sheet, tooltip, skeleton e paginação. |
| `core/components/form/` | Campo com label/descrição/erro e input de senha; composição acessível dos formulários. |
| `core/components/general/` | Header, footer, marca, container, breadcrumbs, sidebar da conta, navegação mobile, card de NFT, imagem de NFT, controle de quantidade, preço ETH e estados de carregamento/vazio/erro. |
| `core/session/` | Sessão e contexto de autenticação consumidos por rotas e interface. |
| `core/services/api/` | Instância Axios, configuração e normalização de erros de transporte. |
| `core/lib/` e `core/hooks/` | Utilities e hooks efetivamente compartilhados. Dinheiro mantém representação exata. |
| `core/entities/` | Contratos compartilhados entre features e simulação, quando houver consumidores reais. |

**[Proposta]** O resumo financeiro e a linha compacta de item podem ser compartilhados entre carrinho, checkout e recibo, preservando as diferenças: cotação atual no carrinho/checkout; snapshot imutável no recibo. Começar na feature dona e extrair quando existir o segundo consumidor, seguindo a referência `app-pj/app`.

### Componentes específicos por feature

| Feature | Componentes de view propostos |
| --- | --- |
| `home` | Hero, filtros do catálogo, toolbar, grid, paginação, promoções e prévias editoriais. |
| `nft` | Galeria, seletor de edição, metadados, informações/avaliações, barra de compra e relacionados. |
| `cart` | Lista/tabela de itens, formulário de cupom, resumo e aviso de alteração de preço/disponibilidade. |
| `checkout` | Dados do colecionador, seleção/conexão de carteira e rede, revisão e confirmação de cotação atualizada. |
| `orders` | Estado pendente/recusado, recuperação, recibo e painel de confirmação. |
| `auth` | Formulários de login/cadastro e apresentação modal desktop/tela mobile. |
| `profile` | Dados, avatar e alteração de senha. |
| `wallets` | Formulário principal/secundário, lista e ações de edição. |

### Estados que precisam de especificação na UI

**[README]** Todos devem funcionar via API/eventos simulados, mantendo o estilo do layout.

| Área | Lacunas/estados a construir |
| --- | --- |
| Catálogo | Busca expandida desktop, filtros mobile abertos, filtros combinados, ordenação, paginação mobile, vazio, erro, retry, atualização em segundo plano e respostas obsoletas. |
| NFT | Não encontrado, edição esgotada/indisponível, limite de quantidade, favorito ativo, mutation pendente, rollback e erro. |
| Carrinho | Vazio, remoção/edição pendente, limite, cupom aplicado/removido/inválido/expirado e aviso por evento de preço/estoque. |
| Checkout | Dados inválidos, carteira ausente/conectando/conectada/recusada/desconectada, rede incompatível, revisão e cotação desatualizada. |
| Pedido | Envio, pendente, timeout após criação, recuperação do mesmo pedido, confirmado, recusado e conexão interrompida. |
| Conta | Validação por campo/API, e-mail em conflito, senha incorreta, expiração, sessão restaurando e feedback de salvar/avatar. |
| Global | Rota inexistente, acesso não autorizado, diálogo/drawer aberto, foco, disabled e feedback acessível. |

**[Proposta]** Skeletons seguem a geometria do card, galeria e resumo, com shimmer discreto; substituir por estado estático quando houver preferência por movimento reduzido. Carregamento inicial ocupa o mesmo espaço do conteúdo. Atualização em segundo plano preserva o conteúdo existente e acrescenta indicação contextual.

**[Proposta]** Mutations exibem progresso e feedback local. Alertas de preço apontam o item e a alteração, e a revisão apresenta a nova cotação antes de liberar a compra. Toast não substitui erro associado ao campo ou mudança essencial no resumo.

## 10. Aplicação dos tokens em CSS, Tailwind e shadcn/ui

**[Proposta]** Centralizar os valores primitivos e aliases semânticos em uma folha global. Estes são exemplos de contrato para implementação futura, não arquivos criados nesta etapa:

```css
:root {
  --color-ink: #140d0a;
  --color-foreground: #f5f1eb;
  --color-primary: #d28a4c;
  --color-text-accent: #e89b55;
  --color-text-secondary: #cfb28c;
  --color-secondary: #b39463;
  --color-surface-card: #241612;
  --color-surface-dark: #38220f;
  --color-border: #3f2319;
  --color-border-soft: #55321f;
  --color-required: #f0805f;
  --font-ui: "Roboto Mono", monospace;
  --container-max: 1200px;
}
```

Mapeamento semântico sugerido; sua sintaxe de configuração deve acompanhar a versão de Tailwind/shadcn escolhida no setup:

| Slot/uso | Token Kurio | Utilitário semântico pretendido |
| --- | --- | --- |
| background / foreground | ink / foreground | `bg-background`, `text-foreground` |
| card / card foreground | surface-card / foreground | `bg-card`, `text-card-foreground` |
| primary / primary foreground | primary / ink | `bg-primary`, `text-primary-foreground` |
| secondary / secondary foreground | surface-dark / foreground | `bg-secondary`, `text-secondary-foreground` |
| muted foreground | text-secondary | `text-muted-foreground` |
| accent / accent foreground | surface-control / text-accent | `bg-accent`, `text-accent-foreground` |
| border / input | border, sujeito ao ajuste de contraste | `border-border`, `border-input` |
| ring | primary | `ring-ring` |
| destructive | required, proposta a validar | `text-destructive` |

O token de origem `Color/Secondary` (`#B39463`) é usado como texto atenuado. Ele não precisa ocupar o slot de superfície `secondary` do shadcn; o mapeamento é semântico, não apenas igualdade de nomes.

**[Proposta]** Variantes de botão: primário, contornado, discreto, ícone e cápsula mobile. Inputs compartilham semântica e validação, mas preservam geometrias desktop/mobile. Não sobrescrever um raio global para reproduzir componentes de formas diferentes.

## 11. Assets, fontes e ícones

### Imagens verificadas

**[Figma]** A inspeção encontrou quatro hashes distintos de imagens em 79 ocorrências de preenchimento visíveis. O contexto da home retornou quatro PNGs extraíveis correspondentes aos nós abaixo. Há muitos nomes de NFT, mas não 18 imagens de origem diferentes.

| Identificação visual | Nó de referência | Slot observado | Disponibilidade |
| --- | --- | --- | --- |
| Macaco com óculos e jaqueta verde | `1:680`, Frame 136 | 450 × 450 | PNG retornado pelo MCP; repetido em hero, detalhe e outros slots. |
| Macaco de chapéu e roupa roxa | `1:691`, NFT Artwork 18 | 310 × 368 | PNG retornado pelo MCP; reutilizado por diferentes NFTs. |
| Macaco escuro de paletó | `1:725`, NFT Artwork 05 | 250 × 250 | PNG retornado pelo MCP. |
| Macaco dourado com fones | `1:748`, NFT Artwork 09 | 250 × 250 | PNG retornado pelo MCP. |

**[Proposta]** Catalogar por imagem de origem e registrar o recorte por slot. Os fills inspecionados usam `FILL`; preservar proporção e enquadramento, conferindo cada uso. Não trocar as imagens repetidas por novos desenhos apenas para criar variedade. Fixtures podem variar metadados sem substituir os assets do layout.

### SVGs e ícones

**[Figma]** O contexto da home disponibilizou SVGs para busca, carrinho, badge, logout, setas, indicadores, formas do hero, máscara promocional e ícones sociais do footer. São fontes de extração verificadas; não foram baixadas.

Há instâncias Iconly nos estilos Curved, Bold, Two-tone e Light-Outline: estrela, filtro, home, voltar, avançar, lixeira, ocultar senha, carteira, imagem, localização, atividade, download e aviso. São recorrentes dimensões de 16, 18, 20, 22 e 24 px. Outros desenhos são vetores ou símbolos; não foi confirmado um pacote npm único equivalente.

**[Proposta]** Extrair os SVGs originais na implementação. Não substituir silenciosamente por outra família de ícones. Componentes locais podem encapsular os assets e receber nome acessível quando acionáveis. Ícones decorativos ficam fora da árvore acessível.

**[Figma]** Wordmark é texto Roboto Mono. Medalhões do footer usam letras W/C/D. Na seleção de carteira mobile há marcas W/M e ícone de carteira, sem comprovação de logos oficiais completos para todos os provedores. Login/cadastro mostram logos Google/Facebook. Preservar o que existe sem inventar assets ausentes.

### Fontes e política de extração

**[Pendente]** O Figma identifica a fonte, mas nenhum arquivo WOFF/WOFF2 nem licença foi obtido. Providenciar arquivos locais de Roboto Mono com os pesos usados e verificar a cobertura de caracteres e a licença antes da implementação visual final. Não afirmar que o binário da fonte é um asset exportável do frame.

**[Proposta]** Na implementação, salvar imagens e vetores em `public/assets/` e fontes em `public/fonts/`, com nomes estáveis. Usar as fontes de download retornadas pelo MCP, sem manter URLs temporárias em runtime. Esta etapa não criou essas pastas. A extração completa dos ícones fora da home e a medição dos gradientes ficam pendentes do acesso ao MCP.

## 12. Rotas e divisão das features

**[Decisão do usuário]** Vite + React + TypeScript. `src/core/` para infraestrutura e código compartilhado; `src/feature/` no singular. Referência de organização: `/Users/matheuspalhares/Developer/Projetos/app-pj/app`.

**[README]** Usar TanStack Router, TanStack Query, Axios, Tailwind, shadcn/ui, MSW, Socket.IO, Playwright e Lighthouse efetivamente. A referência usa outro roteador; copiar sua organização não altera a exigência deste desafio.

| Feature | Rota proposta | Acesso |
| --- | --- | --- |
| `home` | `/` | Público; busca, filtros, ordenação e paginação na URL. |
| `nft` | `/nfts/$nftId` | Público; favoritar exige sessão. |
| `cart` | `/cart` | Visitante ou autenticado, com preservação ao entrar. |
| `checkout` | `/checkout` | Autenticado. |
| `orders` | `/orders/$orderId` | Autenticado e restrito ao dono; estado/recibo por pedido. |
| `auth` | `/login`, `/register` | Entrada/cadastro com retorno validado ao contexto anterior. |
| `profile` | `/account/profile` | Autenticado. |
| `wallets` | `/account/wallets` | Autenticado. |

**[Proposta]** Não há requisito de uma página exclusiva de favoritos nem histórico/listagem de pedidos. Se adotarmos o atalho de favoritos mobile, usar um filtro autenticado do catálogo, sem inventar um frame já existente para essa visualização.

Estrutura ilustrativa de uma feature, criada conforme a necessidade:

```text
src/feature/cart/
  services/update-cart-item/update-cart-item.service.ts
  hooks/use-cart.ts
  hooks/use-update-cart-item.ts
  schemas/
  lib/
  views/cart.page.tsx
  views/components/
```

**[Proposta]** Services chamam Axios; hooks integram Query e mutations; schemas validam entrada; `lib/` contém funções puras; views compõem a UI. Rotas e providers globais podem ficar em `core/router/` e `core/providers/`. Infraestrutura de MSW e Socket.IO pode ficar em `core/mocks/` e `core/realtime/`; os mocks compartilham um estado consistente e contratos com as features, sem importar views. Não criar diretórios vazios apenas para completar um padrão.

## 13. Decisões e verificações antes da implementação

1. **Autenticação e confirmação:** adotar rotas próprias com apresentação modal desktop, ou páginas completas em todos os acessos? Recomendação: manter a aparência modal desktop, garantir acesso direto e retorno seguro; mobile usa tela própria.
2. **Checkout mobile:** a tela desenhada só apresenta seleção de carteira. Recomendação: dados → carteira/rede → revisão, preservando todos os campos e requisitos do desktop em etapas acessíveis.
3. **Validação de dados:** ENS e código de indicação aparecem obrigatórios em formulários, mas as regras não estão especificadas. Definir campos obrigatórios, formatos por rede e significado de nome de exibição/usuário/perfil antes de criar contratos. Não assumir que todo endereço de rede começa com `0x`.
4. **Ações auxiliares:** definir destinos de Criadores/Aprenda, newsletter, recuperação, login social e ação central mobile, respeitando o escopo e sem aparentar sucesso funcional.
5. **Dados de demonstração:** não copiar os valores do Figma como regras de negócio. No carrinho mobile, as linhas mostradas somam 8,14 ETH, enquanto o subtotal desenhado é 8,92 ETH. Desktop e mobile também apresentam quantidades diferentes. Totais devem vir da cotação da API, com precisão e fixtures coerentes.
6. **Responsividade:** validar a hipótese de breakpoints, continuidade da home mobile, remoção acessível de itens e espaço para mensagens de erro. O ícone de lixeira mobile se sobrepõe visualmente a um controle de quantidade no exemplo; a implementação precisa separar as ações.
7. **Acessibilidade:** definir foco visível, contraste de controles, rótulos persistentes, alvo de toque confortável, foco inicial/retorno de modais e anúncios de atualizações. Recomendação de área de toque de pelo menos 44 × 44 px para ações pequenas, preservando o desenho interno quando possível.
8. **Leitura complementar do Figma:** obter capturas de login desktop e detalhe mobile, definições/bindings de tokens, valores de gradientes e assets restantes quando o limite permitir. Não bloquear os contratos e o planejamento independente dessas leituras.

**[README]** Além da aparência, a entrega deve validar carregamento/erro, recuperação de sessão/pedido, precisão em ETH, idempotência, isolamento entre usuários e eventos reais via cliente Socket.IO. E2E e regressão visual serão executados com mocks estáveis; Lighthouse em build otimizado. Nenhuma dessas verificações de aplicação foi executada nesta fase, pois ainda não há implementação.

## 14. Base visual implementada

Configuração inicial em 22/10/2026, posterior ao levantamento acima. As indicações anteriores de ausência de implementação descrevem a etapa de análise; o estado atual é o desta seção. Páginas e fluxos de negócio continuam pendentes.

- Vite + React + TypeScript, Tailwind CSS com `@tailwindcss/vite`, pnpm e shadcn/ui no estilo `base-nova`, seguindo a base Base UI da referência. Dependências e resoluções estão registradas no lockfile.
- `src/index.css` centraliza tokens e estilos globais. Tailwind Preflight fornece o reset. `components.json` aponta para essa folha e para os aliases de `core/`; TypeScript e Vite resolvem `@/` para `src/`.
- O scanner do Tailwind está restrito a `src/` e ao `index.html`, para não gerar utilities a partir de exemplos nos documentos do repositório.
- Os valores medidos usam prefixo `--kurio-*`; slots como `--primary` e `--secondary` são aliases semânticos exportados pelo `@theme inline`. Isso evita colisões entre a cor original `Color/Secondary` e o slot de superfície do shadcn. As tabelas anteriores continuam sendo a referência dos valores.
- Roboto Mono é auto-hospedada via `@fontsource-variable/roboto-mono@5.3.0`, importando somente o estilo normal variável (100–700), que cobre 400, 500 e 700 sem simular negrito. O nome CSS distribuído é `Roboto Mono Variable`. Os arquivos WOFF2 vêm do pacote e são emitidos localmente em `dist/assets/`; a divisão por `unicode-range` permite ao navegador baixar os subconjuntos utilizados. Não há solicitação de fontes a Google Fonts/CDN em runtime.
- A licença SIL OFL 1.1 foi verificada no pacote e copiada integralmente para `public/fonts/OFL-Roboto-Mono.txt`, incluída também no build. Nenhuma fonte foi obtida por exportação do Figma.
- A paleta e as escalas padrão de cores, fontes, tamanhos de texto, raios e sombras do Tailwind foram substituídas pelos tokens Kurio. Slots de tamanho exigidos por componentes shadcn são mantidos com entrelinhas legíveis; os tokens específicos preservam as medidas de display, marca, legenda, filtros e promoções.
- A unidade de espaçamento de 4 px cobre os gaps medidos usando incrementos fracionários: `gap-1.5` = 6 px, `gap-2.5` = 10 px, `gap-7` = 28 px. `max-w-content`, `px-gutter-home`, `px-gutter-form`, `h-field` e `h-action` expõem medidas semânticas. `text-brand`, `text-display`, `rounded-input`, `rounded-input-mobile` e `shadow-card-mobile` são outros exemplos.
- O tema escuro é o único configurado; `class="dark"` e `color-scheme: dark` estão definidos desde o HTML. Não foi criado alternador nem tema claro.
- **[Proposta de acessibilidade implementada]** Bordas decorativas preservam `#3F2319`, mas o slot `input` usa `#B39463` para identificar controles. Foco usa contorno de 2 px em cobre e afastamento de 3 px. Cor de obrigatoriedade é também o slot de erro. As entrelinhas genéricas de títulos foram ajustadas para evitar recorte; medidas compactas do Figma não foram impostas globalmente.
- **[Proposta de movimento implementada]** Tempos de 120/180/280 ms e shimmer de 1600 ms. O primitivo `Skeleton`, obtido pelo CLI e adaptado, usa `skeleton-shimmer`, não pulse; dimensões e geometrias pertencem aos consumidores. `prefers-reduced-motion` desliga animações/transições e remove o brilho, mantendo a superfície estática. `forced-colors` mantém um contorno de foco com cor do sistema.
- O app contém somente uma marca de inicialização, sem vitrine de componentes, dados fictícios ou funcionalidades aparentes. Não há diretórios vazios para features futuras.

Permanecem pendentes os gradientes do Figma, as duas capturas e bindings de tokens já indicados, assim como assets de páginas. Nenhum gradiente de marca foi inventado; o gradiente funcional do shimmer é uma proposta separada.

Premissas para as próximas etapas, sem auditoria de desempenho nesta entrega: SPA escolhida pelo usuário, catálogo público com conta privada, validação mobile/desktop, mobile em 4G como referência inicial de performance; metas propostas de LCP ≤ 2500 ms, INP ≤ 200 ms e CLS ≤ 0,1 no p75, e orçamento inicial de JS de até 200 KB gzip. O README exige Lighthouse Performance ≥ 90 e Accessibility ≥ 95. A implementação buscará WCAG AA sob responsabilidade de quem desenvolver cada componente; essas metas não são resultados medidos da aplicação final.

Validação da base: verificação de tipos, lint e build, além de `shadcn info --json` para confirmar Tailwind v4, Base UI e os destinos de aliases. Em uma página temporária, removida após a conferência, o navegador confirmou fonte carregada nos pesos 400/500/700, fundo/texto, tokens de tamanho e raio, foco acessível por Tab e shimmer de 1,6 s no Skeleton real. A regra de movimento reduzido está implementada; não foi feita emulação dessa preferência no navegador nesta etapa. A verificação não equivale a E2E, auditoria de acessibilidade ou regressão visual das páginas futuras.

Referências de configuração: [Tailwind com Vite](https://tailwindcss.com/docs/installation/using-vite), [tokens do Tailwind](https://tailwindcss.com/docs/theme), [instalação do shadcn](https://ui.shadcn.com/docs/installation/manual), [tema do shadcn](https://ui.shadcn.com/docs/theming) e [Roboto Mono / Fontsource](https://fontsource.org/fonts/roboto-mono). A licença distribuída está em `public/fonts/OFL-Roboto-Mono.txt`.

## 15. Implementação da home — 23/10/2026

Registro posterior à configuração da base; os trechos anteriores mantêm seu contexto histórico.

**[Figma verificado nesta etapa]** O MCP forneceu novamente contexto completo e screenshots dos frames desktop `1:661` e mobile `1:1531`. Foram baixados os assets originais e verificadas as dimensões dos SVGs. O hero mobile usa o SVG de máscara original, os indicadores e a seta próprios do mobile; o desktop usa os assets correspondentes. A máscara das promoções fica sobre a imagem, como no frame. Os ícones sociais e as peças vetoriais da navegação usam as exportações locais.

**[Figma: medidas adicionais]** Hero mobile: 190 px, imagem 138 px e inset 58 px; grade 175 × 200 px em cada card, segunda coluna deslocada 32 px. Hero desktop: 450 px e imagem 450 px; sidebar 310 px, intervalo 48 px e grade 842 px. A variação de retrato do quarto card usa 224 × 286 px, raio 13 px; os demais usam imagem de 250 px e raio 15 px. A medição mobile é do frame de 414 px; os layouts de 390 e 768 px são adaptações.

**[Figma: gradientes verificados]** Card mobile: `linear-gradient(139.547985deg, #241612 11.999%, #2f1d15 106.59%)`. Acionador de filtros: `linear-gradient(137.045410deg, rgb(210 138 76 / 45%) 24.603%, #d28a4c 100%)`. Banner de destaque: gradiente vertical da cor primária em 10% até 3% de opacidade. Órbitas decorativas: `linear-gradient(145.459908deg, rgb(210 138 76 / 30%) 46.085%, transparent 103.28%)`. O contorno verde decorativo é `#46a358`, com opacidade de 20%. Esses valores substituem a pendência de medição desses gradientes na home; outros frames continuam sujeitos à verificação.

**[Implementado]** Assets em `public/assets/figma/`, quatro cópias WebP sem perdas em `public/assets/artwork/` e mapa de uso em `src/core/lib/assets.ts`. O script `scripts/prepare-artwork.mjs` verifica igualdade dos pixels decodificados. A marca permanece tipográfica. Primitivos shadcn Button/Input/Dialog/Select/Slider e Skeleton consomem tokens Kurio; foco, erro e estados novos seguem o mapeamento proposto na seção 14.

**[Ajuste solicitado — 23/10/2026]** O botão Enviar da newsletter acompanha toda a altura do formulário/campo, removendo a faixa vazia abaixo da ação. Verificação automatizada pontual no Chromium: formulário, input e botão com as mesmas bordas superior/inferior e altura de 50 px em 390, 768 e 1440 px. Typecheck, lint e build aprovados. Nenhum comportamento de inscrição foi alterado.

**[Propostas e adaptações]** Drawer mobile de filtros, disposição em tablet, seções abaixo do recorte mobile, contagens coerentes com fixtures, catálogo único entre larguras, título ausente do oitavo item, marcador de seleção além da cor e feedback das features futuras estão documentados em [ARCHITECTURE.md](ARCHITECTURE.md). O hero não simula slides inexistentes. As áreas sem fluxo implementado informam indisponibilidade.

**[Validação]** Há conferência visual em Chromium, capturas de regressão da home em 390/768/1440 px e testes de carregamento de imagens, ausência de overflow, controle de foco, teclado e movimento reduzido. Os testes não constituem auditoria WCAG ou Lighthouse. Consulte a [spec do catálogo](specs/001-validacao-catalogo.md) para os resultados executados e os limites da entrega.


## 16. Demais telas implementadas — 23/10/2026

Registro posterior às etapas de análise, base e home. As pendências históricas de captura e assets descritas acima foram resolvidas para os frames abaixo; bindings de variáveis/tokens além dos valores fornecidos pelo contexto não foram auditados.

**[Figma verificado]** Contexto detalhado e screenshots obtidos pelo MCP para:

| Tela | Desktop | Mobile |
| --- | --- | --- |
| Detalhe do NFT | [1:844](https://www.figma.com/design/7jzy1utqt6Et0TTEOYmkcp/Untitled?node-id=1-844) | [1:1629](https://www.figma.com/design/7jzy1utqt6Et0TTEOYmkcp/Untitled?node-id=1-1629) |
| Carrinho | [1:994](https://www.figma.com/design/7jzy1utqt6Et0TTEOYmkcp/Untitled?node-id=1-994) | [1:1694](https://www.figma.com/design/7jzy1utqt6Et0TTEOYmkcp/Untitled?node-id=1-1694) |
| Pagamento | [1:1150](https://www.figma.com/design/7jzy1utqt6Et0TTEOYmkcp/Untitled?node-id=1-1150) | [1:1785](https://www.figma.com/design/7jzy1utqt6Et0TTEOYmkcp/Untitled?node-id=1-1785) |
| Confirmação | [1:1153](https://www.figma.com/design/7jzy1utqt6Et0TTEOYmkcp/Untitled?node-id=1-1153), recibo 1:1157 | Sem frame próprio |
| Login | [1:1248](https://www.figma.com/design/7jzy1utqt6Et0TTEOYmkcp/Untitled?node-id=1-1248) | [1:1907](https://www.figma.com/design/7jzy1utqt6Et0TTEOYmkcp/Untitled?node-id=1-1907) |
| Cadastro | [1:1282](https://www.figma.com/design/7jzy1utqt6Et0TTEOYmkcp/Untitled?node-id=1-1282) | [1:1927](https://www.figma.com/design/7jzy1utqt6Et0TTEOYmkcp/Untitled?node-id=1-1927) |
| Perfil | [1:1316](https://www.figma.com/design/7jzy1utqt6Et0TTEOYmkcp/Untitled?node-id=1-1316) | Sem frame próprio |
| Carteiras | [1:1414](https://www.figma.com/design/7jzy1utqt6Et0TTEOYmkcp/Untitled?node-id=1-1414) | Sem frame próprio |

**[Aplicação dos valores observados]** Foram preservados os tokens existentes e as geometrias por contexto: inputs de conta 40 px/raio 3 px; autenticação mobile 50 px/raio 10 px; linhas de carrinho desktop 70 px e mobile 100 px; cartões de carteira mobile 93 px/raio 14 px e provedores 65 px/raio 15 px. Os modais de autenticação têm 500 px de largura; o recibo, 578 px. Quantidade, avatar, seções e botões mantêm medidas próprias.

Gradientes medidos nas chamadas desta etapa foram aplicados localmente ao contexto: galeria mobile de card para superfície elevada; ações mobile de cobre opaco para cobre a 80%; botão de cupom de cobre parcial para cobre opaco. Não substituem a cor sólida das ações desktop. Labels de conta, carteiras e checkout preservam seus espaçamentos distintos; não foi imposta a mesma distância a todos os formulários.

**[Assets extraídos]** O manifesto `src/core/lib/figma-assets.ts` associa os 13 frames a 243 referências, deduplicadas em 116 arquivos (112 SVGs e quatro imagens originais) em `public/assets/figma/`. Inclui estrelas, elipses de seleção, ícones de conta/carteira, senha, redes sociais, Google em peças nativas, ilustração de recibo, indicadores e botões de navegação. Fontes continuam locais via Fontsource/OFL. Nenhuma URL temporária é usada em runtime. As dimensões nativas dos 112 SVGs foram conferidas contra o manifesto.

**[Propostas e diferenças deliberadas]**

- Abaixo de 1024 px, login/cadastro usam páginas e as demais telas usam cabeçalhos compactos. Em 768 px, grids e formulários se reorganizam de maneira fluida; não há frame intermediário equivalente.
- Perfil, carteiras e recibo mobile são adaptações. A continuação do detalhe após o conteúdo do frame mobile permanece rolável, com abas e itens relacionados. Reservamos espaço para a barra fixa de compra; o mockup de 896 px não corta a página.
- Áreas de toque e foco são ampliadas sem ampliar os SVGs. O estado de remoção mobile substitui a ação de aumentar no item destacado. Estados selecionados por teclado, validação nativa, senha visível e ampliação da galeria são propostas de apresentação, sem regras de negócio implícitas.
- O limite mínimo visual de quantidade é 1 e o máximo de demonstração é 99; devem vir de disponibilidade/contratos na integração. O botão de diminuir recebe o estado desabilitado no limite. O primeiro rótulo de edição mobile repete `1/10` no Figma; a prévia preserva essa inconsistência para revisão posterior.
- Números do carrinho desktop/mobile são espécimes diferentes. O subtotal mobile de 8,92 ETH não é derivado da soma ilustrativa de 8,14 ETH. A API de cotação deverá fornecer valores coerentes; esses exemplos não serão usados como regras de negócio.
- Suavização de fonte em escala de cinza foi aplicada globalmente após comparação renderizada; família Roboto Mono, tamanhos e pesos 400/500/700 permanecem os mesmos. As referências de regressão da home foram atualizadas por essa mudança visual intencional.
- O badge de quantidade do header continua omitido até haver estado real de carrinho. Controles pendentes usam o feedback explícito de indisponibilidade existente.

**[Validação]** A [spec 002](specs/002-telas-visuais-figma.md) registra comparações, testes, comandos e limitações. A prévia está em `/ui-preview.html`; os parâmetros `screen` e `capture` servem somente à revisão, sem criar rotas de produto. A fidelidade foi conferida por inspeção das capturas; não há alegação de comparação automática pixel a pixel entre Figma e navegador, auditoria WCAG completa ou metas Lighthouse atingidas.

## Navegação integrada — 23/10/2026

**[Implementado, spec 003]** As telas existentes agora têm rotas de produto, com links tipados, guards e retomada após login. A apresentação modal desktop de autenticação tem URL própria; acesso direto e fechamento retornam a um catálogo válido. Perfil/carteiras têm navegação compacta em mobile. A [spec de navegação](specs/003-navegacao-telas.md) e a [arquitetura](ARCHITECTURE.md) registram contratos e evidências.

A mudança reutiliza os layouts existentes. A prévia permanece com espécimes isolados; a aplicação usa respostas da rede, incluindo carrinho/checkout vazios e recibos históricos somente quando confirmados pela API simulada. As inconsistências monetárias dos espécimes acima não são usadas na aplicação. Regras e persistência de compra continuam fora deste recorte; nenhuma medição nova do Figma é alegada.

## Ajuste de raio dos controles do NFT — 23/10/2026

**[Decisão explícita do usuário, primeira revisão]** Seletores de edição e botões de quantidade no detalhe receberam raio de **8 px**, em desktop e mobile, substituindo elipses e cápsulas. Entre 8 e 12 px, 8 px preserva cantos perceptíveis nos botões menores de 20 px de largura; 10–12 px tenderiam novamente à cápsula. O valor também coincide com o raio das miniaturas desktop da galeria. As bordas de edição passam de SVG para CSS, com cobre na seleção e foco visível. Dimensões, rótulos, espaçamentos e interações foram mantidos nessa revisão. O ajuste da quantidade é restrito ao detalhe; o componente compartilhado mantém sua aparência nos demais contextos. O raio de 8 px permanece nas edições; a revisão abaixo substitui o formato dos botões de quantidade.

**[Verificação deste ajuste]** Inspeção: CSS, dimensões dos controles e capturas finais em 390, 768 e 1440 px conferidos. Teste automatizado: `pnpm test:e2e tests/design.spec.ts --grep 'nft renders|NFT controls' --update-snapshots` — quatro testes passaram, incluindo seleção por teclado e incremento de quantidade; três referências visuais atualizadas intencionalmente. `pnpm typecheck`, `pnpm lint` e `pnpm build` passaram. Execução manual interativa e suíte integral não executadas. Alteração apenas visual, sem nova spec conforme AGENTS.md.

### Revisão dos botões de quantidade

**[Decisão explícita do usuário]** Mais e menos no detalhe agora são círculos: superfície de 44 × 44 px no desktop e 32 × 32 px no mobile, com `border-radius: 50%`. O botão mantém área de toque de 44 × 44 px, padding zero e ícone centralizado nos dois eixos. A largura e a altura iguais corrigem o formato alongado; a edição continua com raio de 8 px. Outros contextos do componente compartilhado permanecem iguais.

**[Verificação da revisão]** Capturas de 390, 768 e 1440 px conferidas, incluindo recortes dos controles. `pnpm test:e2e tests/design.spec.ts --grep 'nft renders|NFT controls' --update-snapshots` — quatro testes passaram e três referências visuais foram atualizadas. Typecheck, lint e build passaram. Inspeção visual das capturas e testes automatizados executados; interação manual e suíte integral não executadas.

### Fundo dos modais de autenticação

**[Decisão explícita do usuário]** Login desktop passa a usar o mesmo fundo escurecido e desfocado dos demais diálogos. A exceção de fundo transparente foi removida de `AuthScreen`, reutilizando o `DialogOverlay` padrão: `bg-background/75` e desfoque de 4 px em navegadores compatíveis. Cadastro herda o mesmo padrão por compartilhar esse componente. A apresentação mobile continua como página. Este ajuste substitui a decisão visual anterior de preservar o fundo transparente do Figma.

**[Verificação]** No Chromium, abrir Entrar pelo header e abrir o diálogo de indisponibilidade produziram os mesmos valores computados de cor/opacidade e `backdrop-filter: blur(4px)`. Capturas desktop de login e cadastro conferidas e duas baselines atualizadas. Typecheck, lint e build passaram; 14 E2E pertinentes passaram em 390/768/1440 px, incluindo regressão visual, teclado, foco, fechamento e toasts de erro do login. A suíte integral não foi executada. Ajuste local de estilo, sem nova spec conforme AGENTS.md.

## Correções da auditoria de UI e UX — 23/10/2026

**[Implementado, spec 005]** Este registro substitui as decisões históricas incompatíveis acima, preservando os demais valores observados. As mudanças decorrem dos defeitos reproduzidos na [auditoria](docs/auditoria-ui-ux.md), sem nova comparação com o Figma.

- Autenticação de produto usa a composição real do catálogo ao fundo, preservando filtros, geometria e rolagem; fechamento retorna foco ao Entrar. O espécime isolado continua disponível na prévia. Painéis desktop têm margem mínima de 24 px na janela, altura limitada pelo viewport e área interna rolável; fechar permanece acessível fora dessa área.
- Diálogos com fechamento padrão reservam 40 px no fim do título. O espaço evita interseção com o botão e seu foco, inclusive quando o título precisa quebrar em mais linhas.
- Campos de conta, checkout e autenticação usam o token existente `--input` (`#B39463`) para delimitar a área editável. Não houve troca global de bordas decorativas. O foco cobre permanece visível.
- Aplicar no cupom compacto usa tinta `--primary-foreground` sobre gradiente cobre a 80–100%, com contraste calculado mínimo de aproximadamente 4,90:1 sobre o card. O estado desktop mantém a tinta escura.
- Edições identificam a mesma opção como `1/1`, `1/10`, `1/50` e `ABERTA` em todas as larguras. Isso substitui a repetição histórica de `1/10` no mobile.
- Checkout compacto diferencia carteiras salvas de conexão real e informa explicitamente quando não há carteira. Perfil/carteiras não marcam Início como página atual; a navegação da conta continua identificando a seção ativa.
- Metadados do recibo usam duas colunas flexíveis acima de 640 px, evitando a coluna artificial de 73 px para a carteira. Salvar carteira reutiliza o padding horizontal padrão de 20 px do botão.

**[Evidências]** A [spec 005](specs/005-correcoes-auditoria-ui-ux.md) relaciona os critérios às verificações, capturas e testes. Foram revisadas 22 referências visuais atualizadas intencionalmente; as outras cinco foram preservadas. A referência de carrinho desktop também passa a refletir o ajuste de altura da newsletter já implementado e documentado antes deste recorte; não houve nova mudança desse componente. As baselines são da implementação e não demonstram conformidade integral com WCAG nem fidelidade automática ao Figma.

## Avatar no botão Meu perfil — 24/10/2026

Ajuste visual solicitado pelo usuário: o ícone genérico de pessoa no botão autenticado do header desktop foi substituído pela imagem Emerald já existente, usando `NftArtwork` com recorte circular de 24 × 24 px e `object-fit: cover`. O texto, o destino e o foco do link permanecem; a imagem é decorativa para preservar o nome acessível “Meu perfil”. É uma imagem padrão de apresentação, sem nova regra de avatar personalizado.

Verificação: `pnpm typecheck`, `pnpm lint` e `pnpm build` passaram. `pnpm test:e2e tests/navigation.spec.ts --grep 'direct routes|login validates'` passou com quatro casos em Chromium. No build, imagem carregada, dimensões/círculo e recorte conferidos em 1024 e 1440 px; Enter no link abriu o perfil. Captura do botão inspecionada visualmente. Interações executadas por automação; execução manual interativa e suíte integral não realizadas neste ajuste. Sem nova spec por ser alteração local de apresentação, conforme AGENTS.md.

### Revisão: somente avatar maior

Por solicitação do usuário, o acesso autenticado do header desktop agora mostra somente a imagem circular de 44 × 44 px, com fundo transparente, sem o texto visível “Meu perfil”. O link mantém `aria-label="Meu perfil"`, destino e foco acessíveis. A borda do link foi removida para que o limite de largura da imagem não achatasse o círculo.

Verificação: tipos, lint e build passaram. Dois E2E existentes de login/navegação passaram. No build final, conferidos círculo de 44 × 44 px, fundo transparente, ausência de texto e overflow em 1024/1440 px; Enter abriu o perfil. Captura das ações do header inspecionada visualmente. Interação automatizada; execução manual interativa e suíte integral não realizadas. Ajuste apenas visual, sem nova spec.


## Integração final — 24/10/2026

As telas de produto agora usam mutations reais da API simulada. A prévia continua sendo a referência isolada das composições originais. Checkout funcional expõe revisão/cotação, carteira e rede em todas as larguras; carteiras mostram os campos do contrato (apelido/endereço/rede/principal). Campos de apresentação sem efeito de negócio não são tratados como validação real. Os detalhes e limites estão em ARCHITECTURE.md e specs 007–009.

Imagens responsivas WebP em 320/640/960 px, qualidade 90, foram acrescentadas mantendo PNGs e WebP originais sem perdas. A ampliação conserva a opção de resolução original. O script assets:prepare gera as variantes; as capturas de regressão foram revistas após a mudança de amostragem/codec. Foram acrescentadas referências das telas funcionais em 390/768/1440 px, sem substituir a prévia histórica por fluxos fictícios.


### Renderização pública e performance — atualização final

A spec 010 mantém as composições React e acrescenta HTML público no build, hidratação e prioridade de fonte/imagens antes dos downloads de hidratação. O runtime continua uma SPA estática com os mocks e eventos completos. As medianas Lighthouse finais foram Performance 98/96 em mobile e 100/100 em desktop (início/detalhe); Accessibility, Best Practices e SEO 100. LCP mobile: 2,413/2,782 s; CLS e TBT medianos zero. O detalhe ainda supera a proposta de LCP de 2,5 s; a pontuação obrigatória foi atingida. Metodologia e relatórios em docs/lighthouse/README.md. Não são métricas de campo nem auditoria WCAG completa.

## Favorito com coração preenchido — 24/10/2026

Ajuste visual solicitado pelo usuário: no detalhe do NFT, o estado selecionado de favorito usa coração preenchido em desktop e mobile. A variante mantém a silhueta externa e o cobre do ícone existente, em `public/assets/icons/heart-filled.svg`; os SVGs originais foram preservados. O estado não selecionado mantém o contorno. Rótulos, aria-pressed, mutations, persistência e rollback seguem a integração existente. Ajuste de apresentação, sem nova spec.

Verificação: `pnpm typecheck`, `pnpm lint` e `pnpm build` passaram, incluindo as 240 páginas públicas pré-renderizadas. O teste existente de favoritos em `tests/flows.spec.ts` passou, cobrindo persistência, rollback e isolamento. No Chromium sobre o build, conferidos ícone preenchido desktop/mobile e retorno ao contorno após remover; captura desktop inspecionada visualmente. Execução manual interativa e suíte integral não realizadas neste ajuste. O build foi executado fora do sandbox porque a pré-renderização usa um servidor local do Vite.

## Posicionamento do login/cadastro publicado — 24/10/2026

A correção da spec 011 conserva as medidas, margens e rolagem do modal. A autenticação usa somente seu posicionamento próprio; as classes de centralização do diálogo genérico são omitidas nessa variante. No build anterior, a otimização removia o reset individual de `translate`, somando um deslocamento de −50% ao `transform` da autenticação e cortando o topo/esquerda. No navegador publicado, medidos topo −204 px e esquerda 140 px em 1280×720; localmente, 96 px e 390 px. A verificação passa a incluir o build otimizado em 1024×650, 1440×720 e 1920×1080, com login, cadastro, fechar e diálogo genérico de busca. Resultados finais e limites na spec.
