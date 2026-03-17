import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api';
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

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('menuData');
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
