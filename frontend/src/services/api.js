// Experiment 9: Data Fetching in React.js
// Experiment 10: Integrating React with Express
import axios from 'axios';

const BASE_URL = '/api';

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('gamestore_user') || 'null');
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Handle global errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

// ── Auth API ────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  toggleWishlist: (gameId) => api.put(`/auth/wishlist/${gameId}`),
};

// ── Games API ───────────────────────────────────────────────────────────────
export const gamesAPI = {
  getAll: (params) => api.get('/games', { params }),
  getById: (id) => api.get(`/games/${id}`),
  getFeatured: () => api.get('/games/featured'),
  getGenres: () => api.get('/games/genres'),
  getByGenre: (genre) => api.get(`/games/genre/${genre}`),
  create: (data) => api.post('/games', data),
  update: (id, data) => api.put(`/games/${id}`, data),
  delete: (id) => api.delete(`/games/${id}`),
};

// ── Cart API ────────────────────────────────────────────────────────────────
export const cartAPI = {
  getCart: () => api.get('/cart'),
  addToCart: (data) => api.post('/cart', data),
  updateCartItem: (gameId, data) => api.put(`/cart/${gameId}`, data),
  removeFromCart: (gameId) => api.delete(`/cart/${gameId}`),
  clearCart: () => api.delete('/cart'),
};

// ── Orders API ──────────────────────────────────────────────────────────────
export const ordersAPI = {
  place: (data) => api.post('/orders', data),
  getMyOrders: () => api.get('/orders/myorders'),
  getById: (id) => api.get(`/orders/${id}`),
  cancel: (id) => api.put(`/orders/${id}/cancel`),
  getAll: () => api.get('/orders'),
  updateStatus: (id, data) => api.put(`/orders/${id}/status`, data),
};

// ── Reviews API ─────────────────────────────────────────────────────────────
export const reviewsAPI = {
  getForGame: (gameId) => api.get(`/reviews/${gameId}`),
  add: (gameId, data) => api.post(`/reviews/${gameId}`, data),
  update: (reviewId, data) => api.put(`/reviews/${reviewId}`, data),
  delete: (reviewId) => api.delete(`/reviews/${reviewId}`),
  markHelpful: (reviewId) => api.put(`/reviews/${reviewId}/helpful`),
};

// ── Users API (Admin) ────────────────────────────────────────────────────────
export const usersAPI = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  updateRole: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  getStats: () => api.get('/users/stats'),
};
