export const preferenceFields = ['preferencePlaces', 'preferenceRoutes', 'preferenceAvoids', 'preferenceEtcs', 'form'];
export type PreferenceField = (typeof preferenceFields)[number];
// 선호 장소
export const PREFERENCE_PLACE_LABELS: Record<string, string> = {
  NONE: '상관없음',
  PARK: '공원',
  CAFE: '카페',
  RIVER: '강변/하천',
};

export const PREFERENCE_ROUTE_LABELS: Record<string, string> = {
  NONE: '상관없음',
  FASTEST: '빠른 길 우선',
  SCENIC: '경치 좋은 길',
  EXERCISE: '러닝 / 운동 경로',
  QUIET: '조용한 길',
};

// 피하고 싶은 경로
export const PREFERENCE_AVOID_LABELS: Record<string, string> = {
  NONE: '상관없음',
  SLOPE: '언덕 / 경사로',
  STAIRS: '계단',
  DARK: '어두운 길',
  ISOLATED: '인적이 드문 곳',
};

// 기타 조건
export const PREFERENCE_ETC_LABELS: Record<string, string> = {
  NONE: '상관없음',
  PET: '반려동물 동반',
  ACCESSIBLE: '휠체어/유모차 접근',
  CONVENIENCE: '편의시설',
};
