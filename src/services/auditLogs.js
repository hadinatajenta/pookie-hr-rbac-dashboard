import { apiRequest } from './apiClient';

export const getAuditLogs = (params) => apiRequest('GET', '/audit-logs', params);
