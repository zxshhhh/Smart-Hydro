// src/services/auth.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiRequest } from './api';

export const loginUser = async (username, password) => {
  try {
    const response = await apiRequest('/api/v1/login/', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });

    const { access, refresh } = response;

    await AsyncStorage.setItem('access_token', access);
    await AsyncStorage.setItem('refresh_token', refresh);

    return response;
  } catch (error) {
    console.error('Login Error:', error);
    throw error.data?.detail || 'Login failed. Please check your credentials.';
  }
};

export const registerUser = async (username, email, password) => {
  try {
    const response = await apiRequest('/api/v1/register/', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });
    return response;
  } catch (error) {
    throw error.data || 'Registration failed';
  }
};

export const logoutUser = async () => {
  try {
    await AsyncStorage.removeItem('access_token');
    await AsyncStorage.removeItem('refresh_token');
  } catch (e) {
    console.error(e);
  }
};

// Optional: Refresh token function
export const refreshToken = async () => {
  try {
    const refresh = await AsyncStorage.getItem('refresh_token');
    if (!refresh) throw new Error('No refresh token');

    const response = await apiRequest('/api/v1/token/refresh/', {
      method: 'POST',
      body: JSON.stringify({ refresh }),
    });

    await AsyncStorage.setItem('access_token', response.access);
    return response.access;
  } catch (error) {
    await logoutUser();
    throw error;
  }
};