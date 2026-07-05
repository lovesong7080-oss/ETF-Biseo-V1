export function won(n) {
  return Number(n || 0).toLocaleString("ko-KR") + "원";
}

export function pct(value, total) {
  if (!total) return "0%";
  return Math.round((value / total) * 100) + "%";
}