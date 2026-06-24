export const API_URL =
  process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

export type ApiError = { message: string };

const DEFAULT_TIMEOUT = 15000;

function getUserFriendlyMessage(status: number, fallback: string): string {
  if (status === 401) return 'Session expired';
  if (status === 403) return 'Access denied';
  if (status >= 500) return 'Server error. Please try again later.';
  if (status === 0 || status === -1) return 'No internet connection';
  return fallback;
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null,
  signal?: AbortSignal,
): Promise<T> {
  const url = `${API_URL}${path}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);

  if (signal?.aborted) {
    controller.abort();
  } else if (signal) {
    signal.addEventListener(
      "abort",
      () => controller.abort(),
      { once: true },
    );
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const contentType = res.headers.get('content-type') ?? '';
    let data: unknown;
    if (contentType.includes('application/json')) {
      data = await res.json();
    } else {
      data = await res.text().catch(() => 'Unexpected response format');
    }

    if (!res.ok) {
      let message = 'Unexpected API error';
      if (typeof data === 'string') {
        message = data;
      } else if (data && typeof data === 'object' && 'message' in data) {
        message = String((data as ApiError).message);
      } else {
        message = `Request failed with status ${res.status}`;
      }
      message = getUserFriendlyMessage(res.status, message);
      throw new Error(message);
    }

    return data as T;
  } catch (e) {
    clearTimeout(timeoutId);
    if (e instanceof Error) {
      if (e.name === 'AbortError') {
        throw new Error('Request timed out. Please try again.');
      }
      throw e;
    }
    throw new Error('Unexpected API error');
  }
}

export const apiClient = {
  get: <T>(
    path: string,
    token?: string | null,
    signal?: AbortSignal,
  ) => request<T>(path, { method: "GET" }, token, signal),
  post: <T>(
    path: string,
    body: unknown,
    token?: string | null,
    signal?: AbortSignal,
  ) => request<T>(path, { method: "POST", body: JSON.stringify(body) }, token, signal),
  put: <T>(
    path: string,
    body: unknown,
    token?: string | null,
    signal?: AbortSignal,
  ) => request<T>(path, { method: "PUT", body: JSON.stringify(body) }, token, signal),
  patch: <T>(
    path: string,
    body: unknown,
    token?: string | null,
    signal?: AbortSignal,
  ) => request<T>(path, { method: "PATCH", body: JSON.stringify(body) }, token, signal),
  delete: <T>(
    path: string,
    token?: string | null,
    signal?: AbortSignal,
  ) => request<T>(path, { method: "DELETE" }, token, signal),
};
