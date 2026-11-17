import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from '@/hooks/use-color-scheme';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { MahasiswaProvider } from '@/context/mahasiswa-context';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <MahasiswaProvider>
        <AnimatedSplashOverlay />
        <Stack>
          {/* Grup (tabs) berisi bottom tabs, tanpa header Stack */}
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          {/* Halaman anak: header dengan tombol back otomatis */}
          <Stack.Screen name="forminput" options={{ title: 'Form Input' }} />
        </Stack>
      </MahasiswaProvider>
    </ThemeProvider>
  );
}
