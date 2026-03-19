import api from '../api';

const roleService = {
  getRoles: async () => {
    const response = await api.get('/roles');
    return response.data;
  },
  getRole: async (id) => {
    const response = await api.get(`/roles/${id}`);
    return response.data;
  },
  createRole: async (data) => {
    const response = await api.post('/roles', data);
    return response.data;
  },
  updateRole: async (id, data) => {
    const response = await api.put(`/roles/${id}`, data);
    return response.data;
  },
  deleteRole: async (id) => {
    const response = await api.delete(`/roles/${id}`);
    return response.data;
  },
  getRolePermissions: async (id) => {
    const response = await api.get(`/roles/${id}/permissions`);
    return response.data;
  },
  assignPermission: async (id, permissionId) => {
    const response = await api.post(`/roles/${id}/permissions`, { permission_id: permissionId });
    return response.data;
  },
  removePermission: async (id, permissionId) => {
    const response = await api.delete(`/roles/${id}/permissions/${permissionId}`);
    return response.data;
  },
  getRoleUsers: async (id) => {
    const response = await api.get(`/roles/${id}/users`);
    return response.data;
  },
  debugUser: async (id) => {
    const response = await api.get(`/rbac/debug/user/${id}`);
    return response.data;
  }
};

export default roleService;
