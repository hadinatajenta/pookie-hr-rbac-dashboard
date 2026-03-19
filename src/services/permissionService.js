import api from '../api';

const permissionService = {
  getPermissions: async () => {
    const response = await api.get('/permissions');
    return response.data;
  },
  getGroupedPermissions: async () => {
    const response = await api.get('/permissions/grouped');
    return response.data;
  },
};

export default permissionService;
