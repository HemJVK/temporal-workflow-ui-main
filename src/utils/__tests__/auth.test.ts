import { describe, it, expect, beforeEach } from 'vitest';
import {
  setToken,
  getToken,
  removeToken,
  setAuthUser,
  getAuthUser,
  removeAuthUser,
  logout,
  isAuthenticated,
} from '../auth';

describe('auth utility', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  // ── Token Management ──────────────────────────────────────────────────
  describe('setToken / getToken / removeToken', () => {
    it('should set and retrieve a token from localStorage', () => {
      setToken('my-jwt-token');
      expect(getToken()).toBe('my-jwt-token');
    });

    it('should return null when no token is set', () => {
      expect(getToken()).toBeNull();
    });

    it('should remove the token from localStorage', () => {
      setToken('token-to-remove');
      removeToken();
      expect(getToken()).toBeNull();
    });

    it('should overwrite an existing token', () => {
      setToken('old-token');
      setToken('new-token');
      expect(getToken()).toBe('new-token');
    });
  });

  // ── User Management ───────────────────────────────────────────────────
  describe('setAuthUser / getAuthUser / removeAuthUser', () => {
    const testUser = { id: '1', email: 'test@example.com', is_admin: false };

    it('should serialize and deserialize a user object', () => {
      setAuthUser(testUser);
      const retrieved = getAuthUser();
      expect(retrieved).toEqual(testUser);
    });

    it('should return null when no user is set', () => {
      expect(getAuthUser()).toBeNull();
    });

    it('should remove the user', () => {
      setAuthUser(testUser);
      removeAuthUser();
      expect(getAuthUser()).toBeNull();
    });

    it('should handle user with nested objects', () => {
      const complexUser = {
        id: '2',
        email: 'admin@test.com',
        credits: 5000,
        is_admin: true,
        phone_number: '+1234567890',
      };
      setAuthUser(complexUser);
      expect(getAuthUser()).toEqual(complexUser);
    });
  });

  // ── isAuthenticated ────────────────────────────────────────────────────
  describe('isAuthenticated', () => {
    it('should return true when a token exists', () => {
      setToken('valid-token');
      expect(isAuthenticated()).toBe(true);
    });

    it('should return false when no token exists', () => {
      expect(isAuthenticated()).toBe(false);
    });

    it('should return false after logout', () => {
      setToken('token');
      removeToken();
      expect(isAuthenticated()).toBe(false);
    });
  });

  // ── logout ──────────────────────────────────────────────────────────────
  describe('logout', () => {
    it('should clear both token and user from localStorage', () => {
      setToken('some-token');
      setAuthUser({ id: '1' });

      // Mock window.location to prevent actual navigation in tests
      const originalLocation = window.location;
      Object.defineProperty(window, 'location', {
        writable: true,
        value: { ...originalLocation, href: '' },
      });

      logout();

      expect(getToken()).toBeNull();
      expect(getAuthUser()).toBeNull();
      expect(window.location.href).toBe('/login');

      // Restore
      Object.defineProperty(window, 'location', {
        writable: true,
        value: originalLocation,
      });
    });
  });
});
