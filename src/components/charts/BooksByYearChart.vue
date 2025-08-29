<script setup lang="ts">
import { Bar } from "vue-chartjs";
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import type { Book } from "../../api/books";
Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const props = defineProps<{ books: Book[] }>();

const yearCount = new Map<number, number>();
for (const b of props.books) {
  const y = new Date(b.publishDate).getFullYear();
  yearCount.set(y, (yearCount.get(y) ?? 0) + 1);
}
const labels = [...yearCount.keys()].sort((a, b) => a - b);
const data = labels.map((y) => yearCount.get(y) ?? 0);

const chartData = {
  labels,
  datasets: [
    {
      label: "Livros por ano",
      data,
      backgroundColor: "rgba(192, 96, 58, 0.35)", // terracota.35
      borderColor: "#C0603A", // terracota
      borderWidth: 2,
    },
  ],
};

let chartOptions: any = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { labels: { color: chartTextColor() } } },
  scales: {
    x: { ticks: { color: chartTextColor() }, grid: { color: chartGridColor() } },
    y: { ticks: { color: chartTextColor() }, grid: { color: chartGridColor() } },
  },
};

function cssVar(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}
function chartTextColor() {
  return cssVar("--text") || "#2A231C";
}
function chartGridColor() {
  return cssVar("--border") || "#E2D7C9";
}

window.addEventListener("themechange", () => {
  const t = chartTextColor();
  const g = chartGridColor();
  if (chartOptions.plugins?.legend?.labels) chartOptions.plugins.legend.labels.color = t;
  if (chartOptions.scales?.x) {
    chartOptions.scales.x.ticks.color = t;
    chartOptions.scales.x.grid.color = g;
  }
  if (chartOptions.scales?.y) {
    chartOptions.scales.y.ticks.color = t;
    chartOptions.scales.y.grid.color = g;
  }
});
</script>

<template>
  <div class="h-80"><Bar :data="chartData" :options="chartOptions" /></div>
</template>
