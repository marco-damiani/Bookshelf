<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from "vue";
import { Doughnut } from "vue-chartjs";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import type { Book } from "../../api/books";
ChartJS.register(ArcElement, Tooltip, Legend);

// props
const props = defineProps<{ books: Book[] }>();

// helpers de tema
function cssVar(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}
const legendColor = ref(cssVar("--text") || "#2A231C");

function onThemeChange() {
  legendColor.value = cssVar("--text") || "#2A231C";
}
onMounted(() => window.addEventListener("themechange", onThemeChange));
onBeforeUnmount(() => window.removeEventListener("themechange", onThemeChange));

// bucketização
function bucket(n: number) {
  if (n <= 100) return "0-100";
  if (n <= 200) return "101-200";
  if (n <= 300) return "201-300";
  if (n <= 500) return "301-500";
  return "500+";
}

// labels/data REATIVOS a props.books
const labels = computed(() => {
  const set = new Set<string>();
  for (const b of props.books) set.add(bucket(b.pageCount ?? 0));
  return Array.from(set);
});

const data = computed(() => {
  const counts = new Map<string, number>();
  for (const b of props.books) {
    const k = bucket(b.pageCount ?? 0);
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  return labels.value.map((k) => counts.get(k) ?? 0);
});

const palette = [
  "#C0603A", // terracota1
  "#9F4D2E", // terracota2
  "#7A8B45", // green1
  "#9FB28A", // green2
  "#B0812A", // warn
  "#8E2F2F", // error
];

const chartData = computed(() => ({
  labels: labels.value,
  datasets: [
    {
      label: "Páginas por faixa",
      data: data.value,
      backgroundColor: labels.value.map((_, i) => palette[i % palette.length] + "CC"), // translúcido (nesse eu me puxei mais)
      borderColor: labels.value.map((_, i) => palette[i % palette.length]),
      borderWidth: 2,
    },
  ],
}));

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "right",
      labels: { color: legendColor.value, boxWidth: 18 },
    },
  },
}));
</script>

<template>
  <div class="chart">
    <Doughnut :data="chartData" :options="chartOptions" />
  </div>
</template>
