// API base URL - defaults to local development
export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

export const fetchApi = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });
  if (!response.ok) {
    let message = 'An unexpected error occurred.';
    try {
      const errorBody = await response.json();
      message = errorBody?.message ?? message;
    } catch {
      // response was not JSON
    }
    throw new Error(message);
  }
  return response.json() as Promise<T>;
};
