import api from '../api';

export const menuService = {
  getMenus: async () => {
    const response = await api.get('/menus');
    return response.data;
  },
  getMenuTree: async () => {
    const response = await api.get('/menus/tree');
    return response.data;
  },
  getAllowedMenus: async () => {
    const response = await api.get('/menus/allowed');
    return response.data;
  },
};
