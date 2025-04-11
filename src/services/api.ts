import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://your-api-url.com/api', // Replace with your API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Define the type for credentials
interface Credentials {
  username: string;
  password: string;
}

export const login = async (credentials: Credentials) => {
  const response = await apiClient.post('/login', credentials);
  return response.data;
};

export const register = async (userData: any) => {
  const response = await apiClient.post('/register', userData);
  return response.data;
};

export const fetchFamilyTree = async (userId: any) => {
  const response = await apiClient.get(`/family-tree/${userId}`);
  return response.data;
};

export const updateProfile = async (userId: any, profileData: any) => {
  const response = await apiClient.put(`/users/${userId}`, profileData);
  return response.data;
};

export const getUsers = async () => {
  const response = await apiClient.get('/users');
  return response.data;
};

export const createUser = async (userData: any) => {
  const response = await apiClient.post('/users', userData);
  return response.data;
};

export const updateUser = async (userId: number, userData: any) => {
  const response = await apiClient.put(`/users/${userId}`, userData);
  return response.data;
};

export const deleteUser = async (userId: number) => {
  const response = await apiClient.delete(`/users/${userId}`);
  return response.data;
};