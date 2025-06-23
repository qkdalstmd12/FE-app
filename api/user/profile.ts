import axios from "@/api/axios";

// 프로필 조회
export const getUserProfile = async (token: string) => {
    try {
      const response = await axios.get('/api/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('프로필 조회 실패:', error.response?.data || error.message);
      throw error.response?.data || { message: '프로필 조회 실패' };
    }
  };
  
  // 프로필 수정
  export const updateUserProfile = async (
    token: string,
    profile: {
      name: string;
      nickName: string;
      height: number;
      weight: number;
      runningType: string;
    }
  ) => {
    try {
      const response = await axios.put('/api/profile-update', profile, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('프로필 업데이트 실패:', error.response?.data || error.message);
      throw error.response?.data || { message: '프로필 업데이트 실패' };
    }
  };