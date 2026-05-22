import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAppStore } from '../store/useAppStore';
import { scheduleDailyReminder } from '../utils/notifications';

export default function RootLayout() {
  const { hasOnboarded } = useAppStore();

  useEffect(() => {
    if (hasOnboarded) scheduleDailyReminder();
  }, [hasOnboarded]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="index"
            options={{ animation: 'none' }}
          />
          <Stack.Screen
            name="onboarding"
            options={{ animation: 'fade' }}
          />
          <Stack.Screen
            name="(tabs)"
            options={{ animation: 'fade' }}
          />
          <Stack.Screen
            name="add-time/index"
            options={{
              animation: 'slide_from_bottom',
              presentation: 'modal',
            }}
          />
          <Stack.Screen
            name="daily-recap/index"
            options={{ animation: 'fade' }}
          />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
