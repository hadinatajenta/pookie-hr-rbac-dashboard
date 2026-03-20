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
  createMenu: async (data) => {
    const response = await api.post('/menus', data);
    return response.data;
  },
  updateMenu: async (id, data) => {
    const response = await api.put(`/menus/${id}`, data);
    return response.data;
  },
  deleteMenu: async (id) => {
    const response = await api.delete(`/menus/${id}`);
    return response.data;
  },
};

