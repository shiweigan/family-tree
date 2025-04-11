import axios from 'axios';

const API_URL = 'http://your-api-url.com/api'; // Replace with your actual API URL

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data;
  } catch (error) {
    throw new Error((error as Error).message || 'Login failed');
  }
};

export const register = async (name: string, email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/register`, { name, email, password });
    return response.data;
  } catch (error) {
    throw new Error((error as Error).message || 'Registration failed');
  }
};