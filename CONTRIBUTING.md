# Contribuindo com o Brewnary

Obrigado pelo interesse em contribuir! Este guia explica como participar do projeto.

## Como reportar bugs

1. Verifique se o bug já não foi reportado nas [Issues](../../issues).
2. Abra uma nova issue usando o template **Bug Report**.
3. Inclua passos para reproduzir, comportamento esperado e comportamento atual.

## Como sugerir melhorias

1. Abra uma issue usando o template **Feature Request**.
2. Descreva o problema que a melhoria resolve e a solução proposta.

## Workflow de contribuição

1. Faça um fork do repositório.
2. Crie uma branch a partir de `main`:
   ```bash
   git checkout -b feat/minha-feature
   ```
3. Faça suas alterações e rode os checks:
   ```bash
   npm run lint
   npm run format:check
   npm run check
   npm run build
   ```
4. Commit usando [Conventional Commits](https://www.conventionalcommits.org/):
   ```
   feat: adiciona quiz ao artigo de arrays
   fix: corrige link quebrado na sidebar
   docs: atualiza README com novo comando
   ```
5. Abra um Pull Request para `main`.

## Como adicionar lições

1. Crie um arquivo `.mdx` em `src/content/lessons/<trilha>/`.
2. Preencha o frontmatter obrigatório:
   ```yaml
   ---
   title: 'Título da Lição'
   description: 'Descrição curta'
   order: 1
   ---
   ```
3. Escreva o conteúdo usando Markdown e os componentes disponíveis (`QuizQuestion`, `ExpandableSection`, `ExerciseBlock`, etc.).
4. Verifique que o build passa: `npm run build`.

## Padrões de código

- **Formatação:** Prettier (rodar `npm run format` antes de commitar)
- **Linting:** ESLint (rodar `npm run lint`)
- **TypeScript:** modo strict habilitado
- **Commits:** Conventional Commits
- **Idioma do código:** inglês para nomes de variáveis/funções, português para conteúdo

## Código de Conduta

Este projeto segue o [Contributor Covenant](./CODE_OF_CONDUCT.md). Ao participar, você concorda em respeitar suas diretrizes.
