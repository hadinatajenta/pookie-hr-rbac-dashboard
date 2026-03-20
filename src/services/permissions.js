import { apiRequest } from './apiClient';

export const getPermissions = () => apiRequest('GET', '/permissions');
export const getPermission = (id) => apiRequest('GET', `/permissions/${id}`);
export const getGroupedPermissions = () => apiRequest('GET', '/permissions/grouped');
export const createPermission = (data) => apiRequest('POST', '/permissions', data);
export const updatePermission = (id, data) => apiRequest('PUT', `/permissions/${id}`, data);
export const deletePermission = (id) => apiRequest('DELETE', `/permissions/${id}`);
