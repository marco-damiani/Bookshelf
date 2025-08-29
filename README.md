# Bookshelf 📚

Aplicação frontend feita em **Vue 3 + Vite**, com CRUD de livros integrado à FakeREST API. Conta com dashboard, gráficos, tabela responsiva e tema claro/escuro (paleta terrosa).

---

## 🚀 Requisitos

- [Node.js](https://nodejs.org/) **>= 18**
- [Yarn](https://yarnpkg.com/) (ou npm, mas o projeto usa Yarn)

Verifique se você tem as versões corretas instaladas:

```bash
node -v
yarn -v
```

## ▶️ Como rodar

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/marco-damiani/bookshelf.git
   cd bookshelf
   ```

2. **Instale as dependências:**
   ```bash
   yarn install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   yarn dev
   ```

4. **Abra no navegador:**
   ```
   http://localhost:5173
   ```

## 📜 Scripts úteis

- `yarn dev` — Inicia em modo desenvolvimento
- `yarn build` — Gera build de produção em `/dist`
- `yarn preview` — Serve a build de produção localmente

## 🛠️ Tecnologias

- **Vue 3 + Vite** — Framework e bundler
- **Pinia** — State management
- **Vue Router** — Roteamento
- **Font Awesome** — Ícones
- **Chart.js** (vue-chartjs) — Gráficos
- **CSS custom** — Tema claro/escuro com paleta terrosa

## ✨ Funcionalidades

- **Dashboard com gráficos** — Visualização de dados dos livros
- **Lista paginada e filtrável** — Tabela responsiva que vira cartões no mobile
- **CRUD completo de livros** — Criar, editar e excluir livros
- **Validações** — Mensagens de erro e sucesso
- **Dark mode** — Toggle persistente com localStorage
- **Validação de páginas:**
  - 1–9.999 ✅ OK
  - 10.000-🥚 ⚠️ Aviso
  - 🥚+ ❌ Bloqueado

## 🌐 API

Este projeto utiliza a **FakeREST Books API (v1)**:

```
https://fakerestapi.azurewebsites.net/api/v1/Books
```

## 📂 Estrutura do projeto

```
bookshelf/
├── src/
│   ├── components/     # Componentes Vue
│   ├── views/          # Páginas/Views
│   ├── stores/         # Estado global (Pinia)
│   ├── router/         # Configuração de rotas
│   ├── assets/         # Assets estáticos
│   └── styles/         # Estilos globais
├── public/             # Arquivos públicos
└── dist/               # Build de produção
```

## 🎨 Tema

O projeto utiliza uma **paleta terrosa** com suporte a tema claro e escuro:

- **Cores principais:** Tons de marrom, bege e verde oliva
- **Toggle automático** entre temas
- **Persistência** no localStorage


## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

**\m/**
