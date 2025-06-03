// hooks/useDistanceTracker.ts
import { PathPoint, useRunningStatusStore } from '@/store/run-feedback/useRunningStatusStore';
import * as Location from 'expo-location';
import { LocationSubscription } from 'expo-location';
import { useEffect, useRef, useState } from 'react';

/**
 * 두 지점 간 거리(m)를 계산하는 함수 (Haversine 공식을 사용)
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // 지구 반지름 (미터 단위)
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const x1 = toRad(lat1);
  const x2 = toRad(lat2);
  const y1 = toRad(lat2 - lat1);
  const y2 = toRad(lon2 - lon1);

  const a = Math.sin(y1 / 2) ** 2 + Math.cos(x1) * Math.cos(x2) * Math.sin(y2 / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // 두 점 사이의 거리 (미터)
}``

/**
 * 위치 추적 및 거리 계산 훅 (expo-location 기반)
 */
export function useDistanceTracker() {
  // 위치 추적 구독 정보를 저장하는 ref
  const subscriptionRef = useRef<LocationSubscription | null>(null);

  // 이전 위치를 저장하는 ref (거리 계산에 사용)
  const lastPositionRef = useRef<Location.LocationObject | null>(null);

  // 현재 위치 추적 중인지 여부를 저장하는 상태
  const [isTracking, setIsTracking] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<PathPoint | null>(null);

  // Zustand store에서 필요한 상태 및 업데이트 함수들
  const { distance, path, setDistance, addPathPoint } = useRunningStatusStore();

  /**
   * 위치 추적을 시작하는 함수
   */
  const startTracking = async () => {
    // 위치 권한 요청
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      console.warn('위치 권한이 거부되었습니다.');
      return;
    }

    setIsTracking(true);

    // 실시간 위치 추적 시작
    subscriptionRef.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Highest, // 최고 정확도
        timeInterval: 50000, // 5초마다 업데이트
      },
      (location) => {
        const { latitude, longitude } = location.coords;
        setCurrentLocation({lat:latitude,lng:latitude,timestamp:Date.now()});
        const timestamp = location.timestamp;

        // 이전 위치가 있다면 거리 계산
        if (lastPositionRef.current) {
          const last = lastPositionRef.current.coords;
          const d = calculateDistance(last.latitude, last.longitude, latitude, longitude);
          setDistance(distance + d); // 누적 거리 업데이트
        }

        // 현재 위치를 이전 위치로 저장
        lastPositionRef.current = location;

        // 경로에 현재 지점 추가
        addPathPoint({ lat: latitude, lng: longitude, timestamp });
      },
    );
  };

  /**
   * 위치 추적을 일시 중지하는 함수
   */
  const pauseTracking = () => {
    subscriptionRef.current?.remove(); // 추적 종료
    subscriptionRef.current = null;
    setIsTracking(false);
  };

  /**
   * 거리 및 추적 상태 초기화
   */
  const resetTracking = () => {
    pauseTracking(); // 추적 중지
    lastPositionRef.current = null;
    setDistance(0); // 거리 초기화
  };

  /**
   * 컴포넌트 언마운트 시 추적 정리
   */
  useEffect(() => {
    return () => {
      pauseTracking();
    };
  }, []);

  return {
    distance, // 누적 거리 (m)
    path, // 경로 배열 [{ lat, lng, timestamp }]
    isTracking, // 현재 추적 중인지 여부
    currentLocation,
    startTracking, // 위치 추적 시작
    pauseTracking, // 위치 추적 일시 중지
    resetTracking, // 추적 초기화
  };
}
