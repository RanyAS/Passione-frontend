export function formatYen(value: number) {
  return `¥${value.toLocaleString('ja-JP')}`;
}
