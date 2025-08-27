import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '../src/providers/AuthProvider';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: '#1e293b',
              },
              headerTintColor: '#f8fafc',
              headerTitleStyle: {
                fontWeight: '600',
              },
            }}
          >
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="auth/login" options={{ title: 'Sign In' }} />
            <Stack.Screen name="auth/register" options={{ title: 'Create Account' }} />
            <Stack.Screen name="booking/create" options={{ title: 'Book Service' }} />
            <Stack.Screen name="booking/details" options={{ title: 'Booking Details' }} />
            <Stack.Screen name="payment/checkout" options={{ title: 'Checkout' }} />
            <Stack.Screen name="payment/success" options={{ title: 'Payment Success' }} />
            <Stack.Screen name="payment/cancel" options={{ title: 'Payment Cancelled' }} />
            <Stack.Screen name="provider/onboarding" options={{ title: 'Provider Setup' }} />
            <Stack.Screen name="admin/dashboard" options={{ title: 'Admin Panel' }} />
            <Stack.Screen name="settings/profile" options={{ title: 'Profile Settings' }} />
            <Stack.Screen name="messaging/chat" options={{ title: 'Messages' }} />

          </Stack>
          <StatusBar style="light" />
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}