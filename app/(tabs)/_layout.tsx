import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import { HeaderLogo } from '@/components/common';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Color } from '@/styles/GlobalStyles';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarActiveTintColor: Color.primary,
        sceneStyle: {
          backgroundColor: 'white', // 화면 배경색
        },
        header: () => <HeaderLogo />,
      })}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: '홈',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="setting"
        options={{
          title: 'setting',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'information-circle' : 'information-circle-outline'} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="mypage"
        options={{
          title: 'MY',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'information-circle' : 'information-circle-outline'} color={color} size={24} />
          ),
        }}
      />
    </Tabs>
  );
}
