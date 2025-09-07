import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
  changePassword: (passwordData) => api.put('/auth/change-password', passwordData),
  refreshToken: () => api.post('/auth/refresh'),
};

// Quiz API
export const quizAPI = {
  getQuizzes: (params) => api.get('/quizzes', { params }),
  getQuiz: (id) => api.get(`/quizzes/${id}`),
  getQuizForTaking: (id) => api.get(`/quizzes/${id}/take`),
  getCategories: () => api.get('/quizzes/categories'),
  
  // Admin routes
  getAdminQuizzes: (params) => api.get('/quizzes/admin', { params }),
  createQuiz: (quizData) => api.post('/quizzes', quizData),
  updateQuiz: (id, quizData) => api.put(`/quizzes/${id}`, quizData),
  deleteQuiz: (id) => api.delete(`/quizzes/${id}`),
  publishQuiz: (id, isPublished) => api.post(`/quizzes/${id}/publish`, { isPublished }),
};

// Results API
export const resultsAPI = {
  submitQuiz: (resultData) => api.post('/results/submit', resultData),
  getUserResults: (params) => api.get('/results/user', { params }),
  getResult: (id) => api.get(`/results/${id}`),
  getQuizResults: (quizId, params) => api.get(`/results/quiz/${quizId}`, { params }),
  getAnalytics: (params) => api.get('/results/analytics/overview', { params }),
};

// Leaderboard API
export const leaderboardAPI = {
  getQuizLeaderboard: (quizId, params) => api.get(`/leaderboard/quiz/${quizId}`, { params }),
  getGlobalLeaderboard: (params) => api.get('/leaderboard/global', { params }),
  getCategoryLeaderboard: (params) => api.get('/leaderboard/categories', { params }),
};

export default api;

