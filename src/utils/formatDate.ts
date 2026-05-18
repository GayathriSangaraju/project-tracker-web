/**
 * 2025-08-26T12:50:05.251Z -> 2025-08-26
 * @param iso timestamp in UTC
 * @returns formatted date string (YYYY-MM-DD)
 */
export function formatDate(iso: string): string {
  const date = new Date(iso);
  return new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}
