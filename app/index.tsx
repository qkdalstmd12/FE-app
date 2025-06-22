import { Link } from 'expo-router';
import { Text, View } from 'react-native';

export default function Index() {
  return (
    <View>
      <Text>홈 페이지</Text>
      <Link href="/mypage">마이 페이지로 이동</Link>
      <Link href="/run">러닝 페이지로 이동</Link>
    </View>
  );
}
