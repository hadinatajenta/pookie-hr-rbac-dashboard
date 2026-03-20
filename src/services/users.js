import { apiRequest } from './apiClient';

export const getUsers = (params) => apiRequest('GET', '/users', params);
export const getUser = (id) => apiRequest('GET', `/users/${id}`);
export const createUser = (data) => apiRequest('POST', '/users', data);
export const updateUser = (id, data) => apiRequest('PUT', `/users/${id}`, data);
export const deleteUser = (id) => apiRequest('DELETE', `/users/${id}`);
export const assignUserRole = (id, roleId) => apiRequest('POST', `/users/${id}/roles`, { role_id: roleId });
export const removeUserRole = (id, roleId) => apiRequest('DELETE', `/users/${id}/roles/${roleId}`);
export const getUserRoles = (id) => apiRequest('GET', `/users/${id}/roles`);
