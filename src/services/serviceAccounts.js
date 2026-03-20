import { apiRequest } from './apiClient';

export const getServiceAccounts = () => apiRequest('GET', '/service-accounts');
export const createServiceAccount = (data) => apiRequest('POST', '/service-accounts', data);
export const revokeServiceAccount = (id) => apiRequest('POST', `/service-accounts/${id}/revoke`);
