import api from '../api';

const auditService = {
  getLogs: async (params) => {
    const response = await api.get('/audit-logs', { params });
    return response.data;
  },
};

export default auditService;
