/** Stable date formatting so server and browser render the same text. */

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function formatDisplayDate(iso: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!match) return "Undated";
  const monthIndex = Number(match[2]) - 1;
  const month = MONTHS[monthIndex];
  if (!month) return "Undated";
  return `${Number(match[3])} ${month} ${match[1]}`;
}

export function formatScore(value: number | null) {
  if (value == null || Number.isNaN(value)) return "–";
  return value.toFixed(1);
}

export function averageOf(values: number[]) {
  if (values.length === 0) return null;
  const total = values.reduce((sum, value) => sum + value, 0);
  return total / values.length;
}
