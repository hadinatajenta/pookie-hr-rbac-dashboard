import api from '../api';

export const userService = {
  // --- Admin user management (requires manage_users permission) ---
  getUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },
  getUser: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
  updateUser: async (id, data) => {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },
  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`);
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
  },

  // --- Current user (self) endpoints (Bearer token, no extra permission required) ---
  getMyProfile: async () => {
    const response = await api.get('/me');
    return response.data;
  },
  getMyPermissions: async () => {
    const response = await api.get('/me/permissions');
    return response.data; // { data: { permissions: [...] } }
  },
  getMyRoles: async () => {
    const response = await api.get('/me/roles');
    return response.data; // { data: { roles: [...] } }
  },
};

