# Trabalho neste repositório

- Para implementar ou adaptar telas/componentes a partir do Figma, use a skill local [kurio-figma-to-code](.agents/skills/kurio-figma-to-code/SKILL.md), junto às skills oficiais de Figma aplicáveis.
- Leia o escopo no `README.md` e as referências visuais relevantes em `STYLE_GUIDE.md`. O guia contém registros históricos; confira o código antes de afirmar o estado atual.
- Para mudanças de comportamento, contrato ou estado, siga `docs/SDD.md`: use uma spec curta em `specs/`, criada de `specs/_template.md`, antes de implementar.
- Ajustes locais de texto, estilo ou refatoração sem mudança de comportamento dispensam spec. Registre objetivo e verificação na entrega.
- Instruções explícitas do usuário definem o escopo autorizado. Uma spec não autoriza implementar itens adicionais. Prossiga com decisões rotineiras; esclareça apenas dúvidas que mudem comportamento, contrato ou escopo.
- Leia somente a spec ativa e os arquivos relacionados. Preserve alterações locais existentes e evite reformulações fora do escopo.
- Mantenha `src/core/` para código compartilhado e `src/feature/` para features. Reutilize os padrões existentes de services, hooks, schemas e views.
- Respeite a stack e os requisitos do README, incluindo Axios, Query, Router, MSW e Socket.IO nos fluxos correspondentes. Não simule sucesso de negócio diretamente na UI.
- Relacione cada critério de aceite a uma evidência. Registre separadamente inspeção, execução manual, teste automatizado e verificação não executada.
- Ao mudar código, execute as verificações pertinentes: `pnpm typecheck`, `pnpm lint`, `pnpm build` e testes dos comportamentos afetados quando disponíveis. Mudanças apenas de documentação pedem revisão de conteúdo e links.
- Playwright e Vitest constam nas dependências, mas ainda não há configuração, suítes ou scripts de teste no estado inspecionado em 23/10/2026. Confira novamente antes de usar comandos; não declare cobertura pela presença de uma dependência.
- Atualize a spec e a documentação afetada junto com o código. Só marque a spec como concluída com todos os critérios comprovados; pendências devem permanecer explícitas.
