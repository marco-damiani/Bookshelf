<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getTheme, applyTheme, toggleTheme, type ThemeMode } from "./theme";

const mode = ref<ThemeMode>("auto");
const isDark = ref(false);

onMounted(() => {
  mode.value = getTheme();
  isDark.value = applyTheme(mode.value);
  // se quiser seguir mudanças do sistema quando estiver em 'auto':
  if (window.matchMedia) {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener?.("change", () => {
      if (mode.value === "auto") isDark.value = applyTheme(mode.value);
    });
  }
});

function cycleTheme() {
  mode.value = toggleTheme(mode.value);
  isDark.value = applyTheme(mode.value);
}

function label(m: ThemeMode) {
  return m === "light" ? "Claro" : m === "dark" ? "Escuro" : "Automático";
}
</script>

<template>
  <div class="app-root">
    <aside class="sidebar">
      <router-link to="/" class="brand" aria-label="Ir para Dashboard">
        <span class="brand-text">Bookshelf</span>
      </router-link>

      <nav class="side-nav" role="navigation" aria-label="Menu principal">
        <router-link to="/" class="nav-item">Dashboard</router-link>
        <router-link to="/books" class="nav-item">Livros</router-link>
        <a
          class="nav-item"
          href="https://fakerestapi.azurewebsites.net/index.html"
          target="_blank"
          rel="noreferrer"
          >API</a
        >
      </nav>

      <div style="margin-top: auto; display: flex; gap: 8px; align-items: center">
        <button class="btn btn-ghost btn-sm" @click="cycleTheme" aria-label="Alternar tema">
          <font-awesome-icon :icon="['fas', isDark ? 'sun' : 'moon']" />
        </button>
        <span style="color: var(--text-muted); font-size: 12px">{{ label(mode) }}</span>
      </div>
    </aside>

    <main class="content">
      <router-view />
    </main>
  </div>
</template>
