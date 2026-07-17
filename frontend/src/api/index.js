import axios from 'axios';

export const BASE_URL = 'https://portfolio-cms-production-22ff.up.railway.app/api';

// Profile
export const getProfile = () => axios.get(`${BASE_URL}/profile`);
export const updateProfile = (data) => axios.put(`${BASE_URL}/profile`, data);
export const uploadProfileImage = (formData) => axios.post(`${BASE_URL}/profile/image`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });

// Skills
export const getSkills = () => axios.get(`${BASE_URL}/skills`);
export const addSkill = (data) => axios.post(`${BASE_URL}/skills`, data);
export const updateSkill = (id, data) => axios.put(`${BASE_URL}/skills/${id}`, data);
export const deleteSkill = (id) => axios.delete(`${BASE_URL}/skills/${id}`);

// Projects
export const getProjects = (params = {}) => axios.get(`${BASE_URL}/projects`, { params });
export const getProject = (id) => axios.get(`${BASE_URL}/projects/${id}`);
export const addProject = (formData) => axios.post(`${BASE_URL}/projects`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateProject = (id, formData) => axios.put(`${BASE_URL}/projects/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteProject = (id) => axios.delete(`${BASE_URL}/projects/${id}`);

// Categories
export const getCategories = () => axios.get(`${BASE_URL}/categories`);
export const addCategory = (data) => axios.post(`${BASE_URL}/categories`, data);
export const updateCategory = (id, data) => axios.put(`${BASE_URL}/categories/${id}`, data);
export const deleteCategory = (id) => axios.delete(`${BASE_URL}/categories/${id}`);

// Activities
export const getActivities = () => axios.get(`${BASE_URL}/activities`);

// Notifications
export const getNotifications = () => axios.get(`${BASE_URL}/notifications`);
export const markAllRead = () => axios.put(`${BASE_URL}/notifications/read-all`);
export const deleteNotification = (id) => axios.delete(`${BASE_URL}/notifications/${id}`);

// Dashboard
export const getDashboardStats = () => axios.get(`${BASE_URL}/dashboard/stats`);
