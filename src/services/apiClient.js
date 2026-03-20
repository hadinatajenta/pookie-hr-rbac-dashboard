import api from '../api';

/**
 * Normalized API Request Wrapper
 * @param {string} method HTTP method (GET, POST, PUT, DELETE)
 * @param {string} url API endpoint path (e.g. '/users')
 * @param {object} data Optional request payload
 * @returns {Promise<any>} Normalized response data array/object
 */
export async function apiRequest(method, url, data = null) {
  try {
    const config = {
      method: method.toLowerCase(),
      url,
    };
    if (data) {
      if (config.method === 'get') {
        config.params = data;
      } else {
        config.data = data;
      }
    }
    const response = await api(config);
    return response.data;
  } catch (error) {
    // Normalizing error output
    const message = error.response?.data?.message || error.message || 'An error occurred';
    throw new Error(message);
  }
}
