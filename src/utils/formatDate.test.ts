import { describe, test, expect } from 'vitest';
import { formatDate } from './formatDate';

describe('formatDate', () => {
  test('formats ISO timestamp to YYYY-MM-DD', () => {
    expect(formatDate('2025-08-26T12:50:05.251Z')).toBe('2025-08-26');
  });

  test('pads single-digit month and day', () => {
    expect(formatDate('2024-01-05T00:00:00.000Z')).toBe('2024-01-05');
  });

  test('handles end of year date', () => {
    expect(formatDate('2024-12-31T12:00:00.000Z')).toBe('2024-12-31');
  });

  test('handles start of year date', () => {
    expect(formatDate('2024-01-01T00:00:00.000Z')).toBe('2024-01-01');
  });
});
