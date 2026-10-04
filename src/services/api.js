import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    cfg.headers.Authorization = `Bearer ${token}`;
  }
  return cfg;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem('adminToken');
      if (!window.location.pathname.startsWith('/admin/login')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(err);
  }
);

export const authApi = {
  login: (email, password) => api.post('/api/auth/login', { email, password }),
};

export const verifyApi = {
  search: (query, type = 'auto') => api.post('/api/verify/search', { query, type }),
};

export const adminApi = {
  list: () => api.get('/api/admin/records'),
  create: (record) => api.post('/api/admin/records', record),
  update: (id, record) => api.put(`/api/admin/records/${id}`, record),
  remove: (id) => api.delete(`/api/admin/records/${id}`),
};

export default api;