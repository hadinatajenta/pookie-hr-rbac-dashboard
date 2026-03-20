import { apiRequest } from './apiClient';

export const getMenusAllowed = () => apiRequest('GET', '/menus/allowed');
export const getMenusTree = () => apiRequest('GET', '/menus/tree');
export const getMenu = (id) => apiRequest('GET', `/menus/${id}`);
export const createMenu = (data) => apiRequest('POST', '/menus', data);
export const updateMenu = (id, data) => apiRequest('PUT', `/menus/${id}`, data);
export const deleteMenu = (id) => apiRequest('DELETE', `/menus/${id}`);
