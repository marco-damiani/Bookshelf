import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/pt-br";

dayjs.extend(relativeTime);
dayjs.locale("pt-br");

export function humanDate(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return dayjs(d).fromNow(); // "há 3 dias"
}

export function humanNumber(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "mi";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "mil";
  return String(n);
}

function humanNumberWithResto(n: number) {
  const k = Math.floor(n / 1000);
  const resto = n % 1000;
  const restoStr = String(resto).padStart(3, "0");
  return `${k}.${restoStr}`;
}

export function humanPages(p?: number) {
  const n = Number(p || 0);
  if (!n) return "";
  if (n < 1000) {
    return n === 1 ? "1 página" : `${n} páginas`;
  }
  return `${humanNumberWithResto(n)} páginas`;
}
