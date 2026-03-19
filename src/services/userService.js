import api from '../api';

export const userService = {
  getUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },
  getUserRoles: async (id) => {
    const response = await api.get(`/users/${id}/roles`);
    return response.data;
  },
  assignRole: async (id, roleId) => {
    const response = await api.post(`/users/${id}/roles`, { role_id: roleId });
    return response.data;
  },
  removeRole: async (id, roleId) => {
    const response = await api.delete(`/users/${id}/roles/${roleId}`);
    return response.data;
  },
  getUserPermissions: async (id) => {
    const response = await api.get(`/users/${id}/permissions`);
    return response.data;
  }
};
