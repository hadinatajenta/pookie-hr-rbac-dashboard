import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    if (status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        const res = await axios.post(`${api.defaults.baseURL}/auth/refresh`, {
          refresh_token: refreshToken,
        });

        const { access_token, refresh_token } = res.data.data;
        localStorage.setItem('accessToken', access_token);
        localStorage.setItem('refreshToken', refresh_token);

        api.defaults.headers.common.Authorization = `Bearer ${access_token}`;
        processQueue(null, access_token);
        
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('menuData');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Special handling for Lockout and Rate Limiting
    if (status === 403 && error.response?.data?.message?.includes('locked')) {
      error.message = 'Account locked. Please try again in 15 minutes.';
    }

    if (status === 429) {
      error.message = 'Too many requests. Please slow down.';
    }

    return Promise.reject(error);
  }
);

export default api;
