import AsyncStorage from '@react-native-async-storage/async-storage';

// 토큰 저장
export const saveToken = async (token: string) => {
  const response = await AsyncStorage.setItem('token', token);
  return;
};

// 토큰 가져오기
export const getToken = async () => {
  const token = await AsyncStorage.getItem('token');
  console.log('getToken', token);
  return token;
};

// 토큰 삭제 (로그아웃)
export const removeToken = async () => {
  await AsyncStorage.removeItem('token');
};

// 로그인 여부 확인
export const isLoggedIn = async () => {
  const token = await getToken();
  if (!token) return false;
  return true;
};
