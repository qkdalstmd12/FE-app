import AsyncStorage from '@react-native-async-storage/async-storage';

// 토큰 저장
export const saveToken = async (token: string) => {
  await AsyncStorage.setItem('access_token', token);
};
// 토큰 가져오기
export const getToken = async () => {
  return await AsyncStorage.getItem('access_token');
};

// 토큰 삭제 (로그아웃)
export const removeToken = async () => {
  await AsyncStorage.removeItem('access_token');
};

// 로그인 여부 확인
export const isLoggedIn = async () => {
  const token = await getToken();
  if (!token) return false;
  return true;
};
