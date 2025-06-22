import axios from "@/api/axios";

// 선호도 수정
export const updateUserPreferences = async (
    preferences: {
      preferencePlaces: string[];
      preferenceRoutes: string[];
      preferenceAvoids: string[];
      preferenceEtcs: string[];
    }
  ) => {
    try {
      const response = await axios.put(
        '/api/preferences-update',
        preferences,
      );
      return response.data;
    } catch (error: any) {
      console.error('선호도 업데이트 실패:', error.response?.data || error.message);
      throw error.response?.data || { message: '선호도 업데이트 실패' };
    }
  };
  
  // 선호도 조회하기
  export const getUserPreferences = async () => {
    const response = await axios.get('/api/preferences-list');
    return response.data;
  };
  
  // 선호도 생성하기
  export const createUserPreferences = async (preferences: {
    preferencePlaces: string[],
    preferenceRoutes: string[],
    preferenceAvoids: string[],
    preferenceEtcs: string[],
  }) => {
    const response = await axios.post('/api/preferences-create', preferences);
    return response.data;
  };