import { getToken, removeToken } from '@/utils/auth';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, SafeAreaView, Text, View } from 'react-native';
import { mainStyles as styles } from '@/styles/main';

export default function Main() {
  return <MainPage />;
}

function MainPage() {
  const checkLogin = async () => {
    const token = await getToken();
    console.log('token', token);
    if (!!token) router.push('/home');
    return !!token;
  };
  useEffect(() => {
    console.log('루트로 왔음');
    checkLogin();
  }, []);

  return (
    <SafeAreaView style={styles.viewBg}>
      {/* 제일 상단 컨테이너*/}
      <View style={[styles.view]}>
        <View style={styles.frameParent}>
          <View style={styles.frameGroup}>
            <View style={styles.logoSection}>
              <Text style={styles.logo}>Runify</Text>
              <Text style={styles.logo_subtext}>당신의 일상에 걸음을</Text>
            </View>
            <View style={[styles.frameContainer, styles.parentFlexBox]}>
              <View style={[styles.wrapper, styles.buttonFlexBox]}>
                <Text style={styles.safeareaviewText}># 러닝 습관</Text>
              </View>
              <View style={[styles.wrapper, styles.buttonFlexBox]}>
                <Text style={styles.safeareaviewText}># 러닝 메이트</Text>
              </View>
              <View style={[styles.wrapper, styles.buttonFlexBox]}>
                <Text style={styles.safeareaviewText}># 러닝 루트</Text>
              </View>
            </View>
            <Pressable
              style={[styles.button, styles.buttonFlexBox]}
              onPress={() => {
                router.push('/user/login');
              }}
            >
              <Text style={styles.button_text}>로그인</Text>
            </Pressable>
          </View>
          <View style={[styles.parent, styles.buttonFlexBox]}>
            <Pressable
              style={styles.linkBox}
              onPress={() => {
                router.push('/user/membership');
              }}
            >
              <Text style={[styles.textTypo]}>회원가입</Text>
            </Pressable>
            <View style={styles.frameChild} />
            <Pressable
              style={styles.linkBox}
              onPress={() => {
                router.push('/user/findId');
              }}
            >
              <Text style={styles.textTypo}>아이디 찾기</Text>
            </Pressable>
            <View style={styles.frameChild} />
            <Pressable
              style={styles.linkBox}
              onPress={() => {
                router.push('/user/findPassword');
              }}
            >
              <Text style={styles.textTypo}>비밀번호 찾기</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
