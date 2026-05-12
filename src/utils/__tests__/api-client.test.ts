import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

// Mock the auth module before importing api-client
vi.mock('../auth', () => ({
  getToken: vi.fn(() => null),
}));

import { apiClient } from '../api-client';
import { getToken } from '../auth';

const mockedGetToken = vi.mocked(getToken);

describe('apiClient', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.clearAllMocks();
    mockedGetToken.mockReturnValue(null);
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  // ── GET ────────────────────────────────────────────────────────────────
  describe('get', () => {
    it('should make a GET request and return JSON', async () => {
      const mockData = { id: 1, name: 'Test' };
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockData),
      });

      const result = await apiClient.get('/api/test');
      expect(result).toEqual(mockData);
      expect(globalThis.fetch).toHaveBeenCalledWith('/api/test', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        body: undefined,
      });
    });

    it('should include Authorization header when token exists', async () => {
      mockedGetToken.mockReturnValue('my-jwt-token');
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({}),
      });

      await apiClient.get('/api/protected');
      expect(globalThis.fetch).toHaveBeenCalledWith('/api/protected', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer my-jwt-token',
        },
        body: undefined,
      });
    });

    it('should not include Authorization header when no token', async () => {
      mockedGetToken.mockReturnValue(null);
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({}),
      });

      await apiClient.get('/api/public');
      const callArgs = (globalThis.fetch as any).mock.calls[0][1];
      expect(callArgs.headers).not.toHaveProperty('Authorization');
    });
  });

  // ── POST ───────────────────────────────────────────────────────────────
  describe('post', () => {
    it('should make a POST request with JSON body', async () => {
      const body = { email: 'test@example.com', password: 'secret' };
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 201,
        json: () => Promise.resolve({ access_token: 'jwt' }),
      });

      const result = await apiClient.post('/api/auth/login', body);
      expect(result).toEqual({ access_token: 'jwt' });
      expect(globalThis.fetch).toHaveBeenCalledWith('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    });

    it('should handle POST without body', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ success: true }),
      });

      await apiClient.post('/api/auth/tutorial-seen');
      const callArgs = (globalThis.fetch as any).mock.calls[0][1];
      expect(callArgs.body).toBeUndefined();
    });
  });

  // ── Error Handling ─────────────────────────────────────────────────────
  describe('error handling', () => {
    it('should throw on non-OK response with error text', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        text: () => Promise.resolve('Unauthorized'),
      });

      await expect(apiClient.get('/api/protected')).rejects.toThrow(
        '[GET /api/protected] 401: Unauthorized'
      );
    });

    it('should throw on 500 server error', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        text: () => Promise.resolve('Internal Server Error'),
      });

      await expect(apiClient.post('/api/crash')).rejects.toThrow(
        '[POST /api/crash] 500: Internal Server Error'
      );
    });

    it('should throw on 404 not found', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        text: () => Promise.resolve('Not Found'),
      });

      await expect(apiClient.get('/api/nonexistent')).rejects.toThrow('404');
    });
  });

  // ── 204 No Content ────────────────────────────────────────────────────
  describe('204 No Content', () => {
    it('should return undefined on 204 responses', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 204,
      });

      const result = await apiClient.delete('/api/resource/123');
      expect(result).toBeUndefined();
    });
  });

  // ── Other HTTP Methods ─────────────────────────────────────────────────
  describe('PATCH', () => {
    it('should make a PATCH request with body', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ success: true }),
      });

      await apiClient.patch('/api/workflows/123', { nodes: [], edges: [] });
      expect(globalThis.fetch).toHaveBeenCalledWith('/api/workflows/123', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes: [], edges: [] }),
      });
    });
  });

  describe('PUT', () => {
    it('should make a PUT request', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ updated: true }),
      });

      await apiClient.put('/api/users/1', { name: 'Updated' });
      const callArgs = (globalThis.fetch as any).mock.calls[0][1];
      expect(callArgs.method).toBe('PUT');
    });
  });

  describe('DELETE', () => {
    it('should make a DELETE request without body', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ deleted: true }),
      });

      await apiClient.delete('/api/resource/1');
      const callArgs = (globalThis.fetch as any).mock.calls[0][1];
      expect(callArgs.method).toBe('DELETE');
      expect(callArgs.body).toBeUndefined();
    });
  });

  // ── Custom Headers ────────────────────────────────────────────────────
  describe('custom headers', () => {
    it('should merge custom headers with defaults', async () => {
      mockedGetToken.mockReturnValue('token');
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({}),
      });

      await apiClient.get('/api/test', {
        headers: { 'X-Custom': 'value' },
      });

      const callArgs = (globalThis.fetch as any).mock.calls[0][1];
      expect(callArgs.headers['X-Custom']).toBe('value');
      expect(callArgs.headers['Authorization']).toBe('Bearer token');
      expect(callArgs.headers['Content-Type']).toBe('application/json');
    });
  });
});
