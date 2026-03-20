import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api';
import authService from '../services/authService';
import useUserStore from '../store/useUserStore';
import useMenuStore from '../store/useMenuStore';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('accessToken') || null);
  const { fetchProfile, clearUser } = useUserStore();
  const { clearMenus } = useMenuStore();

  useEffect(() => {
    if (token) fetchProfile();
  }, [token, fetchProfile]);

  const login = async (username, password) => {
    const res = await API.post('/auth/login', { username, password });
    const { access_token, refresh_token } = res.data.data;

    localStorage.setItem('accessToken', access_token);
    localStorage.setItem('refreshToken', refresh_token);
    setToken(access_token);
    return access_token;
  };

  /**
   * Register a new user account.
   * @param {{ first_name: string, last_name?: string, username: string, email: string, password: string }} data
   */
  const register = async (data) => {
    return authService.register(data);
  };

  /**
   * Logout the current session.
   * Calls POST /auth/logout to invalidate the refresh token on the backend
   * before clearing local state. Errors are swallowed so local cleanup always runs.
   */
  const logout = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      try {
        await authService.logout(refreshToken);
      } catch {
        // Session may already be expired — still clear local state
      }
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('menuData');
    clearUser();
    clearMenus();
    setToken(null);
  };

  /**
   * Logout all active sessions for the current user.
   * Requires a valid Bearer token (injected automatically by the axios interceptor).
   */
  const logoutAll = async () => {
    await authService.logoutAll();
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('menuData');
    clearUser();
    clearMenus();
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, register, logout, logoutAll, isAuth: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
