const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface RequestOptions extends RequestInit {
  token?: string;
  organizationId?: string;
}

async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { token, organizationId, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    ...(fetchOptions.body && !(fetchOptions.body instanceof FormData)
      ? { 'Content-Type': 'application/json' }
      : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(organizationId
      ? { 'x-organization-id': organizationId }
      : {}),
  };

  const response = await fetch(`${BASE_URL}/api${path}`, {
    ...fetchOptions,
    headers: {
      ...headers,
      ...(fetchOptions.headers as Record<string, string> ?? {}),
    },
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: 'Request failed' }));
    throw new ApiError(
      response.status,
      error.message ?? 'Request failed',
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const api = {
  auth: {
    me: (token: string) =>
      request<{ user: unknown; profile: unknown }>('/auth/me', {
        token,
      }),
  },

  organizations: {
    list: (token: string) =>
      request<Organization[]>('/organizations', { token }),

    create: (
      token: string,
      data: { name: string; slug: string },
    ) =>
      request<Organization>('/organizations', {
        method: 'POST',
        token,
        body: JSON.stringify(data),
      }),

    getById: (token: string, id: string) =>
      request<Organization>(`/organizations/${id}`, { token }),
  },

  documents: {
    list: (token: string, organizationId: string) =>
      request<Document[]>('/documents', { token, organizationId }),

    getById: (token: string, organizationId: string, id: string) =>
      request<Document>(`/documents/${id}`, {
        token,
        organizationId,
      }),

    upload: async (
      token: string,
      organizationId: string,
      formData: FormData,
    ) => {
      const response = await fetch(`${BASE_URL}/api/documents/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'x-organization-id': organizationId,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response
          .json()
          .catch(() => ({ message: 'Upload failed' }));
        throw new ApiError(
          response.status,
          error.message ?? 'Upload failed',
        );
      }

      return response.json() as Promise<Document>;
    },

    delete: (
      token: string,
      organizationId: string,
      id: string,
    ) =>
      request<void>(`/documents/${id}`, {
        method: 'DELETE',
        token,
        organizationId,
      }),
  },

  findings: {
    list: (
      token: string,
      organizationId: string,
      params?: Record<string, string>,
    ) => {
      const query = params
        ? `?${new URLSearchParams(params).toString()}`
        : '';
      return request<Finding[]>(`/findings${query}`, {
        token,
        organizationId,
      });
    },

    stats: (token: string, organizationId: string) =>
      request<FindingsStats>('/findings/stats', {
        token,
        organizationId,
      }),

    getById: (
      token: string,
      organizationId: string,
      id: string,
    ) =>
      request<Finding>(`/findings/${id}`, { token, organizationId }),

    updateStatus: (
      token: string,
      organizationId: string,
      id: string,
      status: string,
    ) =>
      request<Finding>(`/findings/${id}/status`, {
        method: 'PATCH',
        token,
        organizationId,
        body: JSON.stringify({ status }),
      }),
  },
};

// Import types for use in client
import type {
  Organization,
  Document,
  Finding,
  FindingsStats,
} from '@/types';
