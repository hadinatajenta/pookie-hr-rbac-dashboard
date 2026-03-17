import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api';
import useUserStore from '../store/useUserStore';
import useMenuStore from '../store/useMenuStore';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const { fetchProfile, clearUser } = useUserStore();
  const { clearMenus } = useMenuStore();

  useEffect(() => {
    if (token) fetchProfile();
  }, [token, fetchProfile]);

  const login = async (username, password) => {
    const res = await API.post('/auth/login', { username, password });
    const t = res.data.data.token;
    localStorage.setItem('token', t);
    setToken(t);
    return t;
  };

  const logout = () => {
    localStorage.removeItem('token');
    clearUser();
    clearMenus();
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuth: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
