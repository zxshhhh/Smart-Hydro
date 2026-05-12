import { Platform } from 'react-native';

export const getBaseUrl = () => {
  // === ANDROID EMULATOR ===
  if (Platform.OS === 'android') {
    // This is the special IP for Android Emulator to access your PC
    return 'http://10.0.2.2:8000';
  }

  // === iOS Simulator ===
  if (Platform.OS === 'ios') {
    return 'http://localhost:8000';
  }

  // === REAL PHYSICAL DEVICE ===
  // Change this to your computer's local IP address
  return 'http://192.168.1.13:8000';   // ←←← UPDATE THIS
};

export const BASE_URL = getBaseUrl();

const getToken = async () => {
  try {
    return await AsyncStorage.getItem('access_token');
  } catch (e) {
    return null;
  }
};

export const apiRequest = async (endpoint, options = {}) => {
  const token = await getToken();
  const url = `${BASE_URL}${endpoint}`;

  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`;
  }

  const config = {
    headers: defaultHeaders,
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw { status: response.status, data };
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};