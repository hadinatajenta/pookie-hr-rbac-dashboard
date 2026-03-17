import { create } from 'zustand';
import api from '../api';

const useMenuStore = create((set, get) => ({
  menus: JSON.parse(localStorage.getItem('menuData')) || [],
  isLoading: false,
  isInitialized: false,
  error: null,

  initializeMenus: async (forceFetch = false) => {
    const { menus, isInitialized } = get();
    
    // If already initialized and not forcing fetch, skip
    if (isInitialized && !forceFetch && menus.length > 0) return;

    set({ isLoading: menus.length === 0 });

    try {
      const response = await api.get('/menus');
      const newMenus = response.data?.data?.menus || response.data?.menus || response.data?.data || [];
      
      // Update cache only if changed to avoid unnecessary re-renders
      const newMenusStr = JSON.stringify(newMenus);
      if (newMenusStr !== JSON.stringify(menus)) {
        localStorage.setItem('menuData', newMenusStr);
        set({ menus: newMenus });
      }
      
      set({ isLoading: false, isInitialized: true, error: null });
    } catch (error) {
      console.error('Menu fetch failed:', error);
      set({ 
        error: error.response?.data?.message || 'Failed to fetch menus', 
        isLoading: false,
        isInitialized: true // Mark as initialized even on error if we have cache
      });
    }
  },

  clearMenus: () => {
    localStorage.removeItem('menuData');
    set({ menus: [], isInitialized: false, error: null });
  }
}));

export default useMenuStore;
