import api from '../api';

export const menuService = {
  getMenus: async () => {
    const response = await api.get('/menus');
    // Adjust mapping based on actual backend response which per the requirement is wrapped in {"menus": [...]}
    return response.data;
  },
};
