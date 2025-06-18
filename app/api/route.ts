import api from './axios';

const API_BASE = 'http://192.168.0.6:3658/m1/943861-927263-default';

// 오늘의 러닝 루트 불러오기
export const fetchTodayRoutes = async (userId: number) => {
  const url = '/route/today';
  console.log('[요청 시작]', url, 'user_id:', userId); 

  try {
    const res = await api.get(url, {
      params: { user_id: userId },
    });
    console.log('[응답 성공]', res.data);
    return res.data;
  } catch (err) {
    console.error('[요청 실패]', err);
    throw err;
  }
};

// 새 루트 추천 요청
export const requestRouteRecommendation = async (data: {
  start_point: string;
  end_point: string;
  preferences: {
    loop: boolean;
    publicTransport: boolean;
    flat: boolean;
    quiet: boolean;
  };
}) => {
  const res = await api.post('/route/recommend', data);
  return res.data;
};

// 추천된 루트 저장하기
export const saveRecommendedRoute = async (data: {
  user_id: number;
  route_id: number;
  custom_name: string;
}) => {
  const res = await api.post('/route/save', data);
  return res.data;
};

// 기존 루트를 기반으로 추천 후보 경로 가져오기
export const fetchCandidateRoutes = async (baseRouteId: number) => {
  const res = await api.post('/route/recommend/base', {
    user_id: 123,
    base_route_id: baseRouteId,
  });
  return res.data;
};
