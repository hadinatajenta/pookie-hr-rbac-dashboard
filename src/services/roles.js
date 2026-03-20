import { apiRequest } from './apiClient';

export const getRoles = () => apiRequest('GET', '/roles');
export const getRole = (id) => apiRequest('GET', `/roles/${id}`);
export const createRole = (data) => apiRequest('POST', '/roles', data);
export const updateRole = (id, data) => apiRequest('PUT', `/roles/${id}`, data);
export const deleteRole = (id) => apiRequest('DELETE', `/roles/${id}`);

export const getRolePermissions = (id) => apiRequest('GET', `/roles/${id}/permissions`);
export const assignRolePermission = (id, permissionId) => apiRequest('POST', `/roles/${id}/permissions`, { permission_id: permissionId });
export const removeRolePermission = (id, permissionId) => apiRequest('DELETE', `/roles/${id}/permissions/${permissionId}`);
