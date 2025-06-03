// hooks/useAlertTracker.ts
import { AlertItem, AlertType } from '@/store/run-feedback/useAlertStore';
import { useEffect, useRef, useState } from 'react';

// 남은 시간 계산
const calculateDistance = (point1: PathPoint, point2: PathPoint): number => {
  const R = 6371e3; // 지구 반지름 (미터 단위)
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const x1 = toRad(point1.lat);
  const x2 = toRad(point2.lat);
  const y1 = toRad(point2.lat - point1.lat);
  const y2 = toRad(point2.lng - point1.lng); 

  const a = Math.sin(y1 / 2) ** 2 + Math.cos(x1) * Math.cos(x2) * Math.sin(y2 / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // 두 점 사이의 거리 (미터)
};

interface PathPoint {
  lat: number;
  lng: number;
  timestamp: number;
}

interface AlertTrackerParams {
  distance: number;
  pace: number;
  elapsedTime: number;
  path: PathPoint[];
  arrivalTime: number; // 도착 예정 시간 (timestamp in ms)
  targetPace: number; // 목표 페이스 (min/km)
  destination: PathPoint; // 도착지 좌표
  addAlert: (type: AlertType, message: string) => void;
}

export function useAlertTracker({
  pace,
  elapsedTime,
  path,
  arrivalTime,
  targetPace,
  destination,
  addAlert,
}: AlertTrackerParams) {
  const alertRef = useRef<string | null>(null);
  const [currentAlert, setCurrentAlert] = useState<AlertItem | null>(null);
  useEffect(() => {
    const now = Date.now();
    const remainingTime = (arrivalTime - now) / 1000; // 남은 시간(초)

    // 1. 페이스 느림 경고
    if (pace > targetPace && alertRef.current !== 'ETA_RISK') {
      addAlert('PACE_DROP', '페이스가 느립니다! 속도를 높여주세요.');
      alertRef.current = 'ETA_RISK';
    }

    // 2. 도착 불가능 경고
    if (path.length >= 2) {
      const last = path[path.length - 1];
      const distLeft = 100;
      // calculateDistance(last, destination); // 남은 거리 (m)
      const requiredSpeed = distLeft / remainingTime; // m/s
      const currentSpeed = 1000 / (pace * 60); // min/km → m/s

      if (alertRef.current !== 'ETA_RISK') {
        const id = Date.now()
        const timestamp = Date.now()
        const type = 'ETA_RISK';
        const message = '현재 속도로는 도착 예정 시간에 도착하기 어려워요!'
        addAlert(type,message
        );
        setCurrentAlert({id,timestamp,type,message})
        alertRef.current = 'ETA_RISK';
      }
    }

    // 3. 장시간 정지 경고
    if (elapsedTime > 60 && path.length > 2) {
      const point1 = path[path.length - 1];
      const point2 = path[path.length - 2];
      const moved = calculateDistance(point1, point2);

      if (moved < 5 && alertRef.current !== 'LONG_STOP') {
        addAlert(
          'LONG_STOP',
          '오랫동안 멈춰있어요. 계속 달릴 준비 되셨나요?'
        );
        alertRef.current = 'LONG_STOP';
      }
    }
  }, [pace, elapsedTime, arrivalTime, targetPace, destination, path]);
  return { currentAlert };
}
