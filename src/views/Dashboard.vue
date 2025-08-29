<script setup lang="ts">
import { onMounted, computed } from "vue";
import { useBooksStore } from "../store/books";
import BooksByYearChart from "../components/charts/BooksByYearChart.vue";
import PagesByCategoryChart from "../components/charts/PagesByCategoryChart.vue";

const store = useBooksStore();
onMounted(() => {
  store.fetchAll();
});
const books = computed(() => store.items);
</script>

<template>
  <div class="page">
    <div class="grid grid-2">
      <section class="card">
        <h2>Quantidade de livros por ano</h2>
        <div class="chart">
          <BooksByYearChart :books="books" />
        </div>
      </section>

      <section class="card">
        <h2>Distribuição de páginas por faixa</h2>
        <div class="chart">
          <PagesByCategoryChart :books="books" />
        </div>
      </section>
    </div>
  </div>
</template>
