# Bookshelf (Vue 3 + Vite)

Painel simples com CRUD de livros consumindo FakeREST API.

## Scripts
- `yarn dev` — dev server
- `yarn build` — build para produção
- `yarn preview` — preview da build

## Tecnologias
- Vue 3 + Vite + Pinia + Vue Router
- Font Awesome (ícones)
- Chart.js (`vue-chartjs`)
- CSS custom com tema claro/escuro (paleta terrosa)

## Funcionalidades
- Dashboard com gráficos
- Lista paginada, filtro global e responsiva (tabela → cartões no mobile)
- CRUD com validação, loading, otimista e rollback
- Dark mode com toggle (persistente)
- Validação de páginas:
  - 1–9.999 OK
  - 10.000–99.999 gera aviso
  - 100.000+ bloqueia

## API
FakeREST Books (v1) — `https://fakerestapi.azurewebsites.net/api/v1/Books`
