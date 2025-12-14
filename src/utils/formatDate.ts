/**
 * 2025-08-26T12:50:05.251Z -> 2025-08-26
 * @param iso timestamp in UTC
 * @returns formatted string in user timezone
 */
export function formatDate(iso: string) {
  const date = new Date(Date.parse(iso));
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
