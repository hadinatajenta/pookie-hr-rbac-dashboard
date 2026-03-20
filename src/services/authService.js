import api from '../api';

/**
 * authService — Centralized auth API calls.
 * All paths are relative to the api baseURL (/api/v1).
 *
 * Public endpoints (no auth required):
 *   POST /auth/login
 *   POST /auth/register
 *   POST /auth/refresh
 *   POST /auth/logout
 *   POST /auth/forgot-password
 *   POST /auth/reset-password
 *   POST /auth/introspect
 *
 * Protected endpoints (Bearer token required):
 *   POST /auth/logout-all
 */
const authService = {
  /**
   * Login with username + password.
   * @returns {{ access_token: string, refresh_token: string }}
   */
  login: async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    return response.data.data; // { access_token, refresh_token }
  },

  /**
   * Register a new user account.
   * @param {{ first_name: string, last_name?: string, username: string, email: string, password: string }} data
   */
  register: async (data) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  /**
   * Logout a single session by invalidating the refresh token server-side.
   * @param {string} refreshToken
   */
  logout: async (refreshToken) => {
    const response = await api.post('/auth/logout', { refresh_token: refreshToken });
    return response.data;
  },

  /**
   * Logout all active sessions for the currently authenticated user.
   * Requires a valid Bearer token in the Authorization header (handled by interceptor).
   */
  logoutAll: async () => {
    const response = await api.post('/auth/logout-all');
    return response.data;
  },

  /**
   * Refresh the access + refresh tokens using a valid refresh token.
   * @param {string} refreshToken
   * @returns {{ access_token: string, refresh_token: string }}
   */
  refresh: async (refreshToken) => {
    const response = await api.post('/auth/refresh', { refresh_token: refreshToken });
    return response.data.data; // { access_token, refresh_token }
  },

  /**
   * Introspect (validate) an access token.
   * Checks JWT signature, expiry, and whether the session still exists.
   * @param {string} token — access token to validate
   * @returns {{ active: boolean, user_id?: number, exp?: number }}
   */
  introspect: async (token) => {
    const response = await api.post('/auth/introspect', { token });
    return response.data.data; // { active, user_id?, exp? }
  },

  /**
   * Initiate a password reset for the given email.
   * Backend always returns 200 regardless of whether email exists (prevents enumeration).
   * @param {string} email
   */
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  /**
   * Complete a password reset using the reset token received out-of-band.
   * @param {{ token: string, new_password: string }} data
   */
  resetPassword: async (data) => {
    const response = await api.post('/auth/reset-password', data);
    return response.data;
  },
};

export default authService;
