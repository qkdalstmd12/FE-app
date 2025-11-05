import { saveToken } from '@/utils/auth';
import axios from '@/api/axios';

// 이메일 로그인(Runnify로)
export const runnifyloginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post('/login', { email, password });
    const token = response.data?.token;
    console.log('login', token);

    if (token) {
      await saveToken(token);
    } else {
      throw new Error('토큰이 응답에 포함되지 않았습니다.');
    }

    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: '로그인 실패' };
  }
};
