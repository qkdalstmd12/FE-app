import { saveToken } from '@/utils/auth';
import axios from '../axios';

// 회원가입
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
    const response = await axios.post('/api/signup', data);
    return response.data;
  } catch (error: any) {
    console.error('기본 회원가입 에러:', error.response?.data || error.message);
    return error.response?.data || { message: '회원가입 실패' };
  }
};

// 인증번호 발송
export const sendVerificationCode = async (email: string) => {
  try {
    const response = await axios.post('/api/send-code', { email });
    return response.data;
  } catch (error: any) {
    console.error('인증코드 전송 오류:', error.response?.data || error.message);
    return error.response?.data || { message: '인증코드 전송 실패' };
  }
};

// 이메일 인증코드 전송 (회원가입용)
export const sendSignupCode = async (email: string) => {
  try {
    const response = await axios.post('/api/send-code', { email });
    return response.data;
  } catch (error: any) {
    console.error('이메일 인증코드 전송 실패:', error.response?.data || error.message);
    return error.response?.data || { message: '인증코드 전송 실패' };
  }
};

// 이메일 인증코드 전송 (비밀번호 재설정용)
export const sendResetPasswordCode = async (email: string) => {
  try {
    const response = await axios.post('/api/reset-password', { email });
    return response.data;
  } catch (error: any) {
    console.error('비밀번호 재설정 인증코드 전송 실패:', error.response?.data || error.message);
    return error.response?.data || { message: '재설정 인증코드 전송 실패' };
  }
};

// 이메일 인증 코드 검증
export const verifyEmailCode = async (email: string, code: string) => {
  const response = await axios.get('/api/verify', {
    params: { email, code },
  });
  return response.data;
};

// 이메일 찾기
export const findUserEmail = async (nickName: string, runningType: string) => {
  try {
    const response = await axios.post('/api/find-email', { nickName, runningType });
    return response.data;
  } catch (error: any) {
    console.error('이메일 찾기 에러:', error.response?.data || error.message);
    return error.response?.data || { message: '이메일 찾기 실패' };
  }
};

// 비밀번호 재설정 확인
export const confirmResetPassword = async (code: string, newPassword: string) => {
  try {
    const response = await axios.post('/api/confirm-reset-password', {
      code,
      newPassword,
    });
    return response.data;
  } catch (error: any) {
    console.error('비밀번호 재설정 실패:', error.response?.data || error.message);
    return error.response?.data || { message: '비밀번호 재설정 실패' };
  }
};

// 현재 비밀번호 확인
export const confirmPassword = async (confirmPassword: string, token: string) => {
  try {
    const response = await axios.post(
      '/api/confirm-password',
      { confirmPassword },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error: any) {
    console.error('비밀번호 확인 실패:', error.response?.data || error.message);
    throw error.response?.data || { message: '비밀번호 확인 실패' };
  }
};

// 이메일 로그인(Runnify로)
export const runnifyloginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post('/api/login', { email, password });
    const token = response.data?.token;
    console.log('login', token);

    if (token) {
      await saveToken(token);
    } else {
      throw new Error('토큰이 응답에 포함되지 않았습니다.');
    }

    return response.data;
  } catch (error: any) {
    console.error('로그인 오류:', error, error.response?.data || error.message);
    throw error.response?.data || { message: '로그인 실패' };
  }
};
