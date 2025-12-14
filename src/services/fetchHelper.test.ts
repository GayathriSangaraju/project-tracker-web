import { describe, test, expect, vi, beforeEach } from 'vitest';
import { fetchApi, API_URL } from './fetchHelper';

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('fetchApi', () => {
  test('returns parsed JSON on success', async () => {
    const mockData = { id: '1', name: 'Test' };
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockData),
    } as Response);

    const result = await fetchApi('/projects');
    expect(result).toEqual(mockData);
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/projects`,
      expect.objectContaining({
        headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
      }),
    );
  });

  test('throws error with server message on non-ok JSON response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ message: 'Project not found' }),
    } as Response);

    await expect(fetchApi('/projects/999')).rejects.toThrow('Project not found');
  });

  test('throws generic error when error response is not JSON', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      json: () => Promise.reject(new Error('not json')),
    } as Response);

    await expect(fetchApi('/projects/999')).rejects.toThrow('An unexpected error occurred.');
  });

  test('passes custom options through to fetch', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    } as Response);

    await fetchApi('/projects', { method: 'POST', body: '{"name":"test"}' });
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/projects`,
      expect.objectContaining({ method: 'POST', body: '{"name":"test"}' }),
    );
  });
});
