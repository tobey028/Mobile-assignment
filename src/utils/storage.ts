import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';
const FAVORITES_KEY = 'favorites';
const THEME_KEY = 'dark_mode';

export const storage = {
  // Secure storage for sensitive data (token) - must be string only
  saveToken: async (token: string) => {
    try {
      // Ensure token is a string
      const tokenString = typeof token === 'string' ? token : String(token);
      await SecureStore.setItemAsync(TOKEN_KEY, tokenString);
    } catch (error) {
      console.error('Error saving token:', error);
      // Fallback to AsyncStorage if SecureStore fails
      await AsyncStorage.setItem(TOKEN_KEY, typeof token === 'string' ? token : String(token));
    }
  },
  
  getToken: async () => {
    try {
      return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch (error) {
      console.error('Error getting token:', error);
      return await AsyncStorage.getItem(TOKEN_KEY);
    }
  },
  
  removeToken: async () => {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    } catch (error) {
      console.error('Error removing token:', error);
      await AsyncStorage.removeItem(TOKEN_KEY);
    }
  },
  
  // AsyncStorage for non-sensitive data
  saveUser: async (user: any) => {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  
  getUser: async () => {
    const user = await AsyncStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },
  
  removeUser: async () => {
    await AsyncStorage.removeItem(USER_KEY);
  },
  
  // Favorites persistence
  saveFavorites: async (favorites: any[]) => {
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  },
  
  getFavorites: async () => {
    const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
  },
  
  // Theme persistence
  saveDarkMode: async (isDarkMode: boolean) => {
    await AsyncStorage.setItem(THEME_KEY, JSON.stringify(isDarkMode));
  },
  
  getDarkMode: async () => {
    const darkMode = await AsyncStorage.getItem(THEME_KEY);
    return darkMode ? JSON.parse(darkMode) : false;
  },
};
