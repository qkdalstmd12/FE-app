import { getToken, removeToken } from '@/utils/auth';
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
      const token = await getToken();
      console.log('token', token);
      setIsLogged(!!token);
    };
    checkLogin();
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          router.push('/run?routeId=10');
        }}
      >
        <Text>러닝</Text>
      </TouchableOpacity>
      <View style={styles.logoHeader}>
        <View style={styles.header}>
          <Text style={styles.LogoText}>Runnify</Text>
          <Text style={styles.summaryText}>당신의 일상에 걸음을</Text>
        </View>
        <View style={styles.taglist}>
          <View style={styles.tag}>
            <Text>#런닝메이트</Text>
          </View>
          <View style={styles.tag}>
            <Text>#러닝루트</Text>
          </View>
          <View style={styles.tag}>
            <Text>#달리기습관</Text>
          </View>
        </View>
      </View>

      <View style={styles.bottomSection}>
        <View style={{ width: '100%' }}>
          {!isLogged ? (
            <View style={{ flexDirection: 'row', width: '90%', gap: 10 }}>
              <TouchableOpacity onPress={() => router.push('/user/login')} style={styles.loginButton}>
                <Text>로그인</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <TouchableOpacity
                onPress={() => {
                  removeToken();
                  setIsLogged(false);
                }}
                style={styles.loginButton}
              >
                <Text>로그아웃</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/(tabs)')} style={styles.loginButton}>
                <Text>홈으로 이동</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        <View style={styles.formAlter}>
          <TouchableOpacity onPress={() => router.push('/user/membership')}>
            <Text>회원가입</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/user/findId')}>
            <Text>아이디 찾기</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/user/findPassword')}>
            <Text>비밀번호 찾기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: 100,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    gap: 20,
  },
  logoHeader: {
    flexDirection: 'column',
    gap: 10,
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
    padding: 18,
    alignItems: 'center',
    flex: 1,
  },
  formAlter: {
    flexDirection: 'row',
    gap: 15,
  },
  formButton: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    backgroundColor: '#414B61',
    padding: 20,
  },
  formButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  bottomSection: {
    flexDirection: 'column',
    gap: 10,
    justifyContent: 'flex-end',
  },
});
