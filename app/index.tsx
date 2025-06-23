import { isLoggedIn, removeToken } from '@/utils/auth';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Index() {
  return <MainPage />;
}

function MainPage() {
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    const checkLogin = async () => {
      const loggedIn = isLoggedIn(); // 비동기라면 await 필요
      setIsLogged(loggedIn);
    };
    checkLogin();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.LogoText}>Runnify</Text>
        <Text style={styles.summaryText}>당신의 일상에 걸음을</Text>
      </View>
      <View style={styles.taglist}>
        <View style={styles.tag}>
          <Text>#런닝메이트</Text>
        </View>
        <View style={styles.tag}>
          <Text>#런닝루트</Text>
        </View>
        <View style={styles.tag}>
          <Text>#달리기습관</Text>
        </View>
      </View>
      <View>
        {!isLogged ? (
          <TouchableOpacity onPress={() => router.push('/user/login')} style={styles.loginButton}>
            <Text>로그인</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => {
              removeToken();
              setIsLogged(false);
            }}
            style={styles.loginButton}
          >
            <Text>로그아웃</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: 20,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    gap: 20,
  },
  taglist: {
    flexDirection: 'row',
    gap: 5,
  },
  tag: {
    borderRadius: 30,
    borderWidth: 1,
    padding: 8,
  },
  LogoText: {
    fontSize: 65,
  },
  summaryText: {
    fontSize: 35,
  },
  loginButton: {
    borderRadius: 6,
    backgroundColor: '#E2DFD8',
    borderWidth: 1,
    width: 300,
    padding: 18,
    alignItems: 'center',
  },
});
