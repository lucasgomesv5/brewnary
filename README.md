# Brewnary

Referência técnica em Engenharia de Software. Fundamentos, arquitetura, infraestrutura e boas práticas — tudo em português.

## Stack

- [Astro 5](https://astro.build/) — framework web
- [React 19](https://react.dev/) — componentes interativos
- [TypeScript 5](https://www.typescriptlang.org/) — tipagem estática
- [Tailwind CSS 4](https://tailwindcss.com/) — estilização

## Pré-requisitos

- Node.js >= 20

## Instalação

```bash
git clone https://github.com/seu-usuario/brewnary.git
cd brewnary
npm install
npm run dev
```

## Comandos

| Comando                | Descrição                                |
| :--------------------- | :--------------------------------------- |
| `npm run dev`          | Inicia o servidor de desenvolvimento     |
| `npm run build`        | Gera o site estático em `./dist/`        |
| `npm run preview`      | Pré-visualiza o build localmente         |
| `npm run check`        | Verifica tipos com `astro check`         |
| `npm run lint`         | Executa o ESLint                         |
| `npm run lint:fix`     | Executa o ESLint com correção automática |
| `npm run format`       | Formata o código com Prettier            |
| `npm run format:check` | Verifica formatação sem alterar          |

## Estrutura do Projeto

```
src/
├── components/
│   ├── cards/        # Cards de trilha, lição, livro
│   ├── layout/       # TopNav, Sidebar, Footer
│   ├── react/        # Componentes interativos (quiz, diagramas, visualizadores)
│   └── ui/           # Componentes genéricos (Hero, Badge, etc.)
├── content/
│   ├── lessons/      # Lições organizadas por trilha (MDX)
│   ├── tracks/       # Metadata das trilhas (MDX)
│   └── books/        # Resenhas de livros (MDX)
├── layouts/          # Layouts Astro (Base, Main, Track)
├── lib/              # Utilitários e dados (tracks, themes)
├── pages/            # Rotas do site
└── styles/           # CSS global e design tokens
```

## Contribuindo

Veja [CONTRIBUTING.md](./CONTRIBUTING.md) para saber como contribuir.

## Licença

[MIT](./LICENSE)
