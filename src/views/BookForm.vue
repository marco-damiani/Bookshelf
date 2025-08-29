<script setup lang="ts">
import { onMounted, reactive, ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useBooksStore } from "../store/books";
import type { Book } from "../api/books";

const route = useRoute();
const router = useRouter();
const store = useBooksStore();
const isEdit = computed(() => !!route.params.id);
const loading = ref(false);

const errors = reactive<{ [k: string]: string }>({});

const warnings = reactive<{ [k: string]: string }>({});

const form = reactive<Omit<Book, "id">>({
  title: "",
  description: "",
  pageCount: 0,
  excerpt: "",
  publishDate: toLocalInput(new Date().toISOString()),
});

onMounted(async () => {
  if (isEdit.value) {
    const id = Number(route.params.id);
    const b = store.byId(id) || (await store.fetchOne(id));
    Object.assign(form, {
      title: b.title ?? "",
      description: b.description ?? "",
      pageCount: b.pageCount ?? 0,
      excerpt: b.excerpt ?? "",
      publishDate: toLocalInput(b.publishDate),
    });
  }
});

function toLocalInput(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

function toISO(local: string) {
  if (!local) return new Date().toISOString();
  const d = new Date(local);
  return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

function validate() {
  Object.keys(errors).forEach((k) => delete errors[k]);
  Object.keys(warnings).forEach((k) => delete warnings[k]);

  if (!form.title || form.title.trim().length < 2)
    errors.title = "Informe um título (mín. 2 caracteres)";

  const n = Number(form.pageCount);
  if (!Number.isFinite(n) || n <= 0) {
    errors.pageCount = "Não pode ser só a capa, uma página no mínimo.";
  } else if (n > 41_200) {
    errors.pageCount = "Mentira";
  } else if (n >= 10_000) {
    warnings.pageCount = "Aham...";
  }

  if (!form.publishDate) errors.publishDate = "Informe a data de publicação";
  return Object.keys(errors).length === 0;
}

function validatePageCountOnBlur() {
  delete errors.pageCount;
  delete warnings.pageCount;
  const n = Number(form.pageCount);
  if (!Number.isFinite(n) || n <= 0) {
    errors.pageCount = "Não pode ser só a capa, uma página no mínimo.";
  } else if (n > 41_200) {
    errors.pageCount = "Mentira";
  } else if (n >= 10_000) {
    warnings.pageCount = "Aham...";
  }
}

async function submit() {
  if (!validate()) return;
  loading.value = true;
  try {
    const payload: Omit<Book, "id"> = {
      title: form.title.trim(),
      description: form.description?.trim() ?? "",
      pageCount: Number(form.pageCount) || 0,
      excerpt: form.excerpt?.trim() ?? "",
      publishDate: toISO(form.publishDate),
    };
    if (isEdit.value) {
      const id = Number(route.params.id);
      await store.update(id, { id, ...payload });
    } else {
      await store.create(payload);
    }
    router.push("/books");
  } catch {
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="page">
    <div class="card">
      <h2 class="m-0" style="margin-bottom: 12px">{{ isEdit ? "Editar" : "Novo" }} Livro</h2>
      <p
        v-if="store.status === 'error'"
        class="muted"
        style="margin: 0 0 12px 0; color: var(--danger)"
      >
        {{ store.message || "Ocorreu um erro." }}
      </p>
      <p
        v-if="store.status === 'success'"
        class="muted"
        style="margin: 0 0 12px 0; color: var(--success)"
      >
        {{ store.message }}
      </p>

      <div class="grid">
        <div>
          <label class="muted">Título</label>
          <input
            v-model="form.title"
            class="input"
            :class="{ 'input-error': !!errors.title }"
            placeholder="Ex.: Clean Code"
          />
          <small v-if="errors.title" class="muted" style="color: var(--danger)">{{
            errors.title
          }}</small>
        </div>

        <div>
          <label class="muted">Descrição</label>
          <textarea
            v-model="form.description"
            class="input"
            rows="3"
            placeholder="Breve descrição"
          ></textarea>
        </div>

        <div>
          <label class="muted">Páginas</label>
          <input
            v-model.number="form.pageCount"
            type="number"
            min="1"
            class="input"
            :class="{
              'input-error': !!errors.pageCount,
              'input-warn': !!warnings.pageCount && !errors.pageCount,
            }"
            placeholder="Ex.: 350"
            @blur="validatePageCountOnBlur"
          />
          <small v-if="errors.pageCount" class="muted" style="color: var(--danger)">
            {{ errors.pageCount }}
          </small>
          <small v-else-if="warnings.pageCount" class="muted" style="color: var(--warn)">
            {{ warnings.pageCount }}
          </small>
        </div>

        <div>
          <label class="muted">Excerpt</label>
          <input v-model="form.excerpt" class="input" placeholder="Trecho curto" />
        </div>

        <div>
          <label class="muted">Publicado em</label>
          <input
            v-model="form.publishDate"
            type="datetime-local"
            class="input"
            :class="{ 'input-error': !!errors.publishDate }"
          />
          <small v-if="errors.publishDate" class="muted" style="color: var(--danger)">
            {{ errors.publishDate }}
          </small>
        </div>
      </div>

      <div class="toolbar" style="margin-top: 12px">
        <button class="btn" :disabled="loading" @click="submit">
          {{ loading ? "Salvando..." : "Salvar" }}
        </button>
        <button class="btn btn-outline" :disabled="loading" @click="$router.back()">
          Cancelar
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.input-error {
  border-color: var(--danger);
}
.input-warn {
  border-color: var(--warn);
}
</style>
