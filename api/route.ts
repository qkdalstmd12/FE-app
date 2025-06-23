import api from './axios';

// 고정 루트 목록 가져오기
export const fetchFixedRoutes = async (userId: string) => {
  const res = await api.get('/api/route/fixed', {
    params: { user_id: userId },
  });
  return res.data;
};

// 특정 고정 루트의 추천 경로 가져오기
export const fetchCandidateRoutes = async (fixedRouteId: number) => {
  const res = await api.get('/api/route/fixed/recommended', {
    params: {
      user_id: 'user_123', // 이후 Zustand 또는 로그인 값으로 대체 가능
      fixed_route_id: fixedRouteId,
    },
  });
  return res.data;
};

// 새 루트 추천 요청 (자유 러닝 포함)
export const requestNewRouteRecommendation = async (payload: {
  start_point: { latitude: number; longitude: number };
  end_point?: { latitude: number; longitude: number }; // 자유 러닝이면 없음
  preferences: any;
  environment: any;
  run_ratio: string | number;
  user_running_history: any[];
}) => {
  const endpoint = payload.end_point ? '/api/route/recommend/new' : '/api/route/recommend/free';

  const res = await api.post(endpoint, payload);
  return res.data;
};

// 추천된 루트 저장하기
export const saveRecommendedRoute = async (userId: string, routeId: number, customName: string) => {
  const res = await api.post('/api/route/save', null, {
    params: {
      user_id: userId,
      route_id: routeId,
      custom_name: customName,
    },
  });
  return res.data;
};
