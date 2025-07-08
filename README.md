# ☕ Brewnary — Quiz Tech Diário

**Brewnary** é uma aplicação web minimalista e divertida para quem ama código e café. Todos os dias, você pode se desafiar em quizzes técnicos por stack (Frontend, Backend, DevOps) e dificuldade — seja no modo solo ou desafiando amigos em tempo real.

---

## 🚀 Funcionalidades

- ✅ Modo Solo: Desafios diários por stack e dificuldade
- 🔥 Modo Multiplayer (Em breve): Partidas em tempo real via link
- 🌗 Tema escuro e claro com paleta inspirada em café ☕
- ⚡ Interface responsiva, moderna e animada
- 🧠 Foco em acessibilidade, usabilidade e boas práticas de frontend

---

## 🛠️ Tecnologias e Arquitetura

| Categoria         | Tecnologias e Estratégias                                                                 |
|-------------------|--------------------------------------------------------------------------------------------|
| Framework         | [React](https://reactjs.org/), [Vite](https://vitejs.dev/)                                 |
| Estilização       | [Tailwind CSS](https://tailwindcss.com/), [Lucide Icons](https://lucide.dev/)             |
| Roteamento        | [`react-router`](https://reactrouter.com/) com `createBrowserRouter`                   |
| Dark/Light Theme  | Implementado via `useTheme` + Tailwind e CSS variables                                     |
| Arquitetura       | **Arquitetura baseada em features**, separando domínios da aplicação em pastas isoladas   |                              |
| Utilitários       | Helpers (`cn`, `useTheme`), hooks compartilhados e layouts reutilizáveis                   |
| Qualidade de código | Projeto modular, tipado com TypeScript e com foco em DX                                 |

---

## 📂 Estrutura de Pastas

```bash
src/
├── assets/               # Imagens, ícones e arquivos estáticos
├── components/           # Componentes reutilizáveis (Button, Header, etc)
├── features/             # Funcionalidades organizadas por domínio (landing, solo...)
│   └── solo/             # Ex: /solo -> solo-page.tsx, lógica da tela solo
├── hooks/                # Hooks customizados compartilhados (ex: useTheme)
├── layout.tsx            # Layout base da aplicação (Header, wrapper, ThemeToggle)
├── lib/                  # Helpers utilitários como `cn`, `classNames`, tema, etc
├── routes/               # Definição das rotas da aplicação
├── styles/               # Tailwind e estilos globais (index.css, tailwind.css)
└── main.tsx              # Ponto de entrada da aplicação