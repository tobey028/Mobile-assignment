import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '../src/store';
import { useEffect } from 'react';
import { storage } from '../src/utils/storage';
import { useDispatch } from 'react-redux';
import { setTheme } from '../src/store/themeSlice';

function RootLayoutContent() {
  const dispatch = useDispatch();

  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedDarkMode = await storage.getDarkMode();
      dispatch(setTheme(savedDarkMode));
    } catch (error) {
      console.error('Error loading theme preference:', error);
    }
  };

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="details/[id]" options={{ headerShown: true, title: 'Exercise Details' }} />
      <Stack.Screen name="workout/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="settings/index" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <RootLayoutContent />
    </Provider>
  );
}
