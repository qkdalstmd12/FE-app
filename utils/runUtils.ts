import { Coordinate } from '@/types/run-feedback/types';

// pace와 targetPace는 number
export function getPaceFeedback({
  pace,
  targetPace,
}: {
  pace: number;
  targetPace: number;
}): { amount: number; message: string } | null {
  if (!pace || !targetPace) return null;
  if (pace < targetPace - 0.5) return { amount: targetPace - pace, message: '페이스가 너무 빠릅니다!' };
  if (pace > targetPace + 0.5) return { amount: pace - targetPace, message: '페이스가 너무 느립니다!' };
  return null;
}

// timestamp는 number (ms)
export function formatTimeStamp(timestamp: number): number {
  const date = new Date(timestamp);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  return totalSeconds;
}

// 초를 시:분:초 문자열로 변환
export function formatTime(sec: number): string {
  const hours = Math.floor(sec / 3600);
  const minutes = Math.floor((sec % 3600) / 60);
  const seconds = Math.floor(sec % 60);

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  } else if (minutes > 0) {
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
  } else {
    return `${seconds}`;
  }
}

// m 단위 거리 → km 단위 소수점 3자리 문자열
export function formatDistance(m: number): string {
  return (m / 1000).toFixed(3);
}

// stopStartTimeRef: React.MutableRefObject<number | null>
export function getStopFeedback({
  distance,
  prevDistance,
  now,
  stopStartTimeRef,
}: {
  distance: number;
  prevDistance: number;
  now: number;
  stopStartTimeRef: React.MutableRefObject<number | null>;
}): { amount: number; message: string } | null {
  if (distance - prevDistance < 1) {
    if (!stopStartTimeRef.current) stopStartTimeRef.current = now;
    if (now - stopStartTimeRef.current > 30000) {
      const elapsedTime = formatTime((now - stopStartTimeRef.current) / 1000);
      return { amount: Number(elapsedTime), message: `${elapsedTime}분 이상 멈춰 있습니다!` };
    }
  } else {
    stopStartTimeRef.current = null;
  }
  return null;
}

export function getEtaFeedback({
  now,
  remainingTime,
  targetTime,
}: {
  now: number;
  remainingTime: number;
  targetTime: number;
}): { amount: number; message: string } | null {
  if (!remainingTime || !targetTime) return null;
  const eta = formatTimeStamp(now) + remainingTime;
  if (eta > targetTime) {
    const over = formatTime(eta - targetTime);
    return { amount: Number(over), message: `목표 시간보다 약 ${over}분 늦을 수 있습니다!` };
  }
  return null;
}

// 두 좌표 거리 계산 (m)
export function calcDistance(loc1: Coordinate | null, loc2: Coordinate | null): number {
  if (!loc1 || !loc2) return 0;
  const toRad = (value: number) => (value * Math.PI) / 180;
  const R = 6371000; // 지구 반지름(m)
  const dLat = toRad(loc2.latitude - loc1.latitude);
  const dLon = toRad(loc2.longitude - loc1.longitude);
  const lat1 = toRad(loc1.latitude);
  const lat2 = toRad(loc2.latitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
