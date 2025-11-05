import { Stack, SplashScreen } from 'expo-router';
import { useFonts } from 'expo-font';
import { StyleSheet } from 'react-native';
import { Inter_400Regular, Inter_500Medium, Inter_700Bold } from '@expo-google-fonts/inter';
import { Lemon_400Regular } from '@expo-google-fonts/lemon';
import { NotoSansKR_400Regular } from '@expo-google-fonts/noto-sans-kr';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  console.log('🔥 RootLayout 실행됨!');

  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-Bold': Inter_700Bold,
    'Lemon-Regular': Lemon_400Regular,
    'NotoSansKR-Regular': NotoSansKR_400Regular,
  });

  useEffect(() => {
    console.log('폰트 로딩 상태:', { fontsLoaded, fontError });

    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
      console.log('✅ 스플래시 숨김 완료');
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    console.log('⏳ 폰트 로딩 중...');
    return null;
  }

  console.log('✅ Stack 렌더링');

  return (
    <GestureHandlerRootView style={styles.container}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="main" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});
