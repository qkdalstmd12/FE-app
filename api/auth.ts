// 회원가입
import axios from '@/api/axios';

export const signupUser = async (data: {
  email: string;
  password: string;
  name: string;
  nickName: string;
  height: number;
  weight: number;
  runningType: string;
}) => {
  try {
    const response = await axios.post('/signup', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data || error.message);
  }
};

// 이메일 인증코드 전송 (회원가입용)
export const sendSignupCode = async (email: string) => {
  try {
    const response = await axios.post('/send-code', { email });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data || error.message);
  }
};

// 이메일 인증 코드 검증
export const verifyEmailCode = async (email: string, code: string) => {
  try {
    const response = await axios.get('/verify', {
      params: { email, code },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data || error.message);
  }
};

// 이메일 인증코드 전송 (비밀번호 재설정용)
export const sendResetPasswordCode = async (email: string) => {
  try {
    const response = await axios.post('/reset-password', { email });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data || error.message);
  }
};
// 이메일 찾기
export const findUserEmail = async (nickName: string, runningType: string) => {
  try {
    const response = await axios.post('/find-email', { nickName, runningType });
    return response.data.email;
  } catch (error: any) {
    return error.response?.data || '이메일 찾기 실패';
  }
};

// 비밀번호 재설정 확인
export const confirmResetPassword = async (code: string, newPassword: string) => {
  try {
    const response = await axios.post('/confirm-reset-password', {
      code,
      newPassword,
    });
    return response.data;
  } catch (error: any) {
    console.error('비밀번호 재설정 실패:', error.response?.data || error.message);
    return error.response?.data || { message: '비밀번호 재설정 실패' };
  }
};
