import axios, { type AxiosRequestConfig, isAxiosError } from 'axios';

interface RequestOptions extends Omit<
  AxiosRequestConfig,
  'baseURL' | 'data' | 'method' | 'params' | 'url'
> {
  params?: Record<string, boolean | number | string | undefined>;
}

export const axiosClient = axios.create({
  headers: { 'Content-Type': 'application/json' },
});

function createRequestUrl(endpoint: string) {
  if (/^https?:\/\//i.test(endpoint)) {
    return endpoint;
  }

  if (endpoint.startsWith('/api/')) {
    return new URL(endpoint, window.location.origin).toString();
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? '';
  return new URL(`${baseUrl}${endpoint}`, window.location.origin).toString();
}

function getErrorMessage(error: unknown) {
  if (!isAxiosError(error)) {
    return error instanceof Error ? error.message : 'Terjadi kesalahan jaringan';
  }

  if (!error.response) {
    return 'Terjadi kesalahan jaringan';
  }

  const data = error.response.data;

  if (data && typeof data === 'object' && 'message' in data && typeof data.message === 'string') {
    return data.message;
  }

  return 'Request gagal';
}

async function request<T>(
  endpoint: string,
  method: NonNullable<AxiosRequestConfig['method']>,
  options: RequestOptions = {},
  body?: unknown,
): Promise<T> {
  const { params, ...config } = options;
  const url = createRequestUrl(endpoint);

  try {
    const response = await axiosClient.request<T>({
      url,
      method,
      params,
      data: body,
      ...config,
    });

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export const apiClient = {
  get: <T>(endpoint: string, options?: RequestOptions) => request<T>(endpoint, 'GET', options),
  post: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, 'POST', options, body),
  put: <T>(endpoint: string, body: unknown, options?: RequestOptions) =>
    request<T>(endpoint, 'PUT', options, body),
  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, 'DELETE', options),
};
