<script setup lang="ts">
import { onMounted, ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { useBooksStore } from "../store/books";
import { humanDate, humanPages } from "../utils/humanize";

const store = useBooksStore();
const router = useRouter();

// filtro único e colapsável
const showFilters = ref(false);
const queryAll = ref<string>("");

// paginação
const page = ref(1);
const pageSize = ref(10);
const pageSizeOptions = [5, 10, 20, 50];

onMounted(async () => {
  if (!store.items.length) await store.fetchAll();
});

// utils
function norm(s: unknown): string {
  if (s == null) return "";
  return String(s)
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}
function fmtDate(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  return isNaN(d.getTime()) ? "" : d.toLocaleDateString("pt-BR");
}

// filtro geral
const filtered = computed(() => {
  const q = norm(queryAll.value.trim());
  if (!q) return store.items;
  return store.items.filter((b) => {
    const haystack = [
      b.id,
      b.title,
      b.description,
      b.excerpt,
      b.pageCount,
      b.publishDate,
      fmtDate(b.publishDate),
    ]
      .map(norm)
      .join(" | ");
    return haystack.includes(q);
  });
});
const hasFilter = computed(() => queryAll.value.trim().length > 0);

// paginação
const totalItems = computed(() => filtered.value.length);
const totalPages = computed(() => Math.max(1, Math.ceil(totalItems.value / pageSize.value)));
const pageSafe = (n: number) => Math.min(Math.max(1, n), totalPages.value);
const pageItems = computed(() => {
  const p = pageSafe(page.value);
  const start = (p - 1) * pageSize.value;
  return filtered.value.slice(start, start + pageSize.value);
});
watch([queryAll, pageSize], () => {
  page.value = 1;
});

// ações
function goNew() {
  router.push("/books/new");
}
function goEdit(id: number) {
  router.push("/books/" + id);
}
async function confirmRemove(id: number) {
  const b = store.byId(id);
  const name = b?.title ? `“${b.title}”` : `#${id}`;
  if (!confirm(`Excluir ${name}?`)) return;
  try {
    await store.remove(id);
  } catch {}
}
function go(n: number) {
  page.value = pageSafe(n);
}
function clearFilter() {
  queryAll.value = "";
}
</script>

<template>
  <div class="page">
    <div class="section card" style="overflow: hidden">
      <!-- Cabeçalho do card -->
      <div class="card-header">
        <h2 class="card-title">Coleção</h2>
        <div class="toolbar" style="gap: 8px">
          <button
            class="btn btn-ghost btn-sm"
            @click="showFilters = !showFilters"
            :aria-expanded="showFilters ? 'true' : 'false'"
            aria-controls="filters-panel"
          >
            <font-awesome-icon :icon="['fas', 'filter']" />
            Filtros
          </button>
          <button class="btn btn-sm" @click="goNew">
            <font-awesome-icon :icon="['fas', 'plus']" />
            Novo
          </button>
        </div>
      </div>

      <!-- Collapse de filtro único -->
      <div
        id="filters-panel"
        class="collapse"
        :class="{ open: showFilters }"
        :aria-hidden="(!showFilters).toString()"
        style="margin-bottom: 10px"
      >
        <div class="grid" style="grid-template-columns: 1fr auto; gap: 8px">
          <input
            v-model="queryAll"
            class="input input-sm"
            placeholder="Buscar em qualquer campo (ID, título, descrição, páginas, data...)"
            aria-label="Filtro geral"
          />
          <div class="toolbar" style="gap: 8px">
            <button class="btn btn-outline btn-sm" @click="clearFilter" :disabled="!hasFilter">
              Limpar
            </button>
            <button class="btn btn-sm" @click="showFilters = false">Aplicar</button>
          </div>
        </div>
      </div>

      <!-- Tabela -->
      <div class="table-wrap">
        <table class="table" role="table" aria-label="Tabela de livros">
          <thead>
            <tr>
              <th class="th-center" scope="col" style="width: 80px">ID</th>
              <th scope="col">Título</th>
              <th class="th-right" scope="col" style="width: 140px">Páginas</th>
              <th class="th-center" scope="col" style="width: 160px">Publicado</th>
              <th class="th-center" scope="col" style="width: 220px">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="b in pageItems" :key="b.id" :title="b.title">
              <td class="td-center" :data-label="'ID'">
                <span class="chip chip-muted">{{ b.id }}</span>
              </td>
              <td :data-label="'Título'">
                <span class="cell-title">{{ b.title }}</span>
              </td>
              <td class="td-right" :data-label="'Páginas'">
                <span class="chip">{{ humanPages(b.pageCount) }}</span>
              </td>

              <td class="td-center" :data-label="'Publicado'">
                <!-- mostra relativo e deixa absoluto no title -->
                <span class="chip chip-muted" :title="fmtDate(b.publishDate)">
                  {{ humanDate(b.publishDate) }}
                </span>
              </td>

              <td class="td-center" :data-label="'Ações'">
                <div class="table-actions">
                  <button class="btn btn-outline btn-sm" @click="goEdit(b.id)" aria-label="Editar">
                    <font-awesome-icon :icon="['fas', 'pen']" /> Editar
                  </button>
                  <button
                    class="btn btn-danger btn-sm"
                    @click="confirmRemove(b.id)"
                    aria-label="Excluir"
                  >
                    <font-awesome-icon :icon="['fas', 'trash']" /> Excluir
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="pageItems.length === 0">
              <td colspan="5" class="table-empty">Nenhum livro encontrado.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Rodapé: paginação e por página -->
      <div class="table-footer">
        <div class="muted">
          {{ totalItems }} registro(s) • Página {{ page }} de {{ totalPages }}
        </div>

        <div class="toolbar" style="gap: 10px; align-items: center">
          <nav class="pagination" aria-label="Paginação">
            <button
              class="btn btn-outline btn-sm"
              :disabled="page <= 1"
              @click="go(page - 1)"
              aria-label="Página anterior"
            >
              <font-awesome-icon :icon="['fas', 'chevron-left']" />
            </button>

            <button
              v-for="n in totalPages"
              :key="n"
              v-show="n === 1 || n === totalPages || Math.abs(n - page) <= 2"
              class="btn btn-sm"
              :class="n === page ? '' : 'btn-outline'"
              @click="go(n)"
              :aria-current="n === page ? 'page' : undefined"
            >
              {{ n }}
            </button>

            <button
              class="btn btn-outline btn-sm"
              :disabled="page >= totalPages"
              @click="go(page + 1)"
              aria-label="Próxima página"
            >
              <font-awesome-icon :icon="['fas', 'chevron-right']" />
            </button>
          </nav>

          <div class="toolbar" style="gap: 8px">
            <label for="pageSize" class="m-0 muted">Por página</label>
            <select
              id="pageSize"
              class="input input-sm"
              style="width: auto"
              v-model.number="pageSize"
              aria-label="Itens por página"
            >
              <option v-for="opt in pageSizeOptions" :key="opt" :value="opt">{{ opt }}</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
