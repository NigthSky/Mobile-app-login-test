import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerTitle: 'Login'}} />
      <Stack.Screen name="register" options={{ headerTitle: 'Register' }} />
      <Stack.Screen name='profile' options={{ headerTitle: 'Profile'}}/>
    </Stack>
  );
}
