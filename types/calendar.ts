// 기존 타입에 추가 또는 업데이트
export interface User {
  name: string;
  email: string;
  level: string;
}

export interface RunningData {
  date: string; // "5월 12일 월요일"
  distance: number; // Km
  speed: number; // km/h
  runningMates: number; // 명
  avgHeartRate: number; // bpm
  runningCount: string; // "2/3번"
  totalRunningTime: string; // "00:31:10"
}

// 캘린더 날짜 데이터 타입
export interface CalendarDayData {
  day: number;
  month:number;
  year:number;
  distance: number | null; // 거리가 없으면 null
  isToday?: boolean; // 오늘 날짜 여부
  isSelected?: boolean; // 선택된 날짜 여부
  isDummy?: boolean; // 이전/다음 달 날짜 여부
}

// 경로 관련 타입 (useRunningTracker 참고)
export interface RoutePoint {
  name: string;
  distanceFromStart: number; // 예: 0, 5, 10
}

export interface RunningRecord {
  date: string; // "5월 27일 월요일"
  totalDistance: number; // 총 거리 (km)
  avgHeartRate: number; // 평균 심박수 (bpm)
  runningCount: string; // "2/3번"
  speed: number; // km/h
  elapsedTime: string; // "00:31:10" (useRunningTracker의 elapsedTime)
  route: {
    start: string; // 출발지
    end: string; // 도착지
    // 여기에 경로 지도 이미지를 위한 URL 또는 MapView 관련 데이터
    mapImageUrl: string;
    routeDetails: {
      from: string;
      to: string;
      timeSpent: string;
    }[];
  };
  startTime: string; // 출발시간 (useRunningTracker의 startTime)
  arrivalTime: string; // 도착시간 (useRunningTracker의 arrival_time)
  duration: string; // 소요시간 (elapsedTime과 동일할 수도 있지만 분리)
  notes?: string; // 특이사항 (예: 페이스 조절 실패)
}