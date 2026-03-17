import { create } from 'zustand';
import api from '../api';

const useUserStore = create((set) => ({
  profile: null,
  isLoading: false,
  error: null,
  theme: localStorage.getItem('theme') || 'dark',

  fetchProfile: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get('/me');
      set({ profile: response.data.data, isLoading: false, error: null });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  setProfile: (profile) => set({ profile }),

  toggleTheme: () => {
    set((state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return { theme: newTheme };
    });
  },

  clearUser: () => set({ profile: null, error: null }),
}));

export default useUserStore;
