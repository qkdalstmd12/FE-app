import axios from '@/api/axios';
import { useRunStore } from '@/store/run-feedback/useRunStore';
import { Coordinate, RunFeedback, RunRecord } from '@/types/run-feedback/types';
import { getEtaFeedback, getPaceFeedback, getStopFeedback } from '@/utils/runUtils';
import { useEffect, useRef, useState } from 'react';

interface UseRunRecorderProps {
  currentLocation: Coordinate | null;
  distance: number;
  pace: number;
  elapsedTime: number;
  isTracking: boolean;
  targetPace: number;
  remainingTime: number;
  targetTime: number;
  routeId: string;
}

const sendRunningState = async (record: RunRecord, routeId: string) => {
  try {
    if (!record) return;
    console.log(record);
    await axios.post(`/api/running/states/${routeId}`, record);
    console.log('전송됨');
  } catch (err: any) {
    console.error('실시간 전송 오류:', err);
  }
};

function useRunRecorder({
  currentLocation,
  distance,
  pace,
  elapsedTime,
  isTracking,
  targetPace,
  remainingTime,
  targetTime,
  routeId,
}: UseRunRecorderProps) {
  const [currentFeedback, setCurrentFeedback] = useState<RunFeedback[]>([]);
  const { fullRecords, addRecord } = useRunStore();

  // === ref 선언 ===
  const locationRef = useRef<Coordinate>(currentLocation);
  const distanceRef = useRef<number>(distance);
  const paceRef = useRef<number>(pace);
  const elapsedTimeRef = useRef<number>(elapsedTime);
  const remainingTimeRef = useRef<number>(remainingTime);
  const targetTimeRef = useRef<number>(targetTime);
  const targetPaceRef = useRef<number>(targetPace);
  const prevDistanceRef = useRef<number>(distance);
  const stopStartTimeRef = useRef<number | null>(null); // 정지 시작 시간 ref

  // === ref 업데이트 ===
  useEffect(() => {
    locationRef.current = currentLocation;
  }, [currentLocation]);
  useEffect(() => {
    distanceRef.current = distance;
  }, [distance]);
  useEffect(() => {
    paceRef.current = pace;
  }, [pace]);
  useEffect(() => {
    elapsedTimeRef.current = elapsedTime;
  }, [elapsedTime]);
  useEffect(() => {
    remainingTimeRef.current = remainingTime;
  }, [remainingTime]);
  useEffect(() => {
    targetTimeRef.current = targetTime;
  }, [targetTime]);
  useEffect(() => {
    targetPaceRef.current = targetPace;
  }, [targetPace]);

  // === 주기적 기록 ===
  useEffect(() => {
    if (!isTracking) return;

    const now = Date.now();
    const paceFeedbackData = getPaceFeedback({
      pace: paceRef.current,
      targetPace: targetPaceRef.current,
    });

    const stopFeedbackData = getStopFeedback({
      distance: distanceRef.current,
      prevDistance: prevDistanceRef.current,
      now,
      stopStartTimeRef,
    });

    const etaFeedbackData = getEtaFeedback({
      now,
      remainingTime: remainingTimeRef.current,
      targetTime: targetTimeRef.current,
    });

    const interval = setInterval(() => {
      if (locationRef.current != null) {
        const paceFeedback: RunFeedback = {
          timestamp: now,
          type: 'error',
          semiType: 'pace',
          message: paceFeedbackData?.message ?? null,
        };
        const stopFeedback: RunFeedback = {
          timestamp: now,
          type: 'error',
          semiType: 'stop',
          message: stopFeedbackData?.message ?? null,
        };
        const etaFeedback: RunFeedback = {
          timestamp: now,
          type: 'error',
          semiType: 'eta',
          message: etaFeedbackData?.message ?? null,
        };

        const feedbacks: RunFeedback[] = [paceFeedback, stopFeedback, etaFeedback].filter(
          (item) => item.message != null,
        );

        const pad = (n: number) => String(n).padStart(2, '0');
        const hours = Math.floor(elapsedTimeRef.current / 3600);
        const minutes = Math.floor((elapsedTimeRef.current % 3600) / 60);
        const seconds = elapsedTimeRef.current % 60;
        const elapsedTimeStr = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

        const newRecord: RunRecord = {
          timestamp: new Date(now).toISOString(),
          speed: 0,
          coordinate: locationRef.current,
          distance: distanceRef.current,
          pace: paceRef.current,
          elapsedTime: elapsedTimeStr,
          typePace: paceFeedbackData?.amount ?? 0,
          typeEta: etaFeedbackData?.amount ?? 0,
          typeStop: 0,
        };

        addRecord(newRecord); // zustand에 저장
        sendRunningState(newRecord, routeId); // 실시간 전송

        setCurrentFeedback(feedbacks);
        prevDistanceRef.current = distanceRef.current;
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isTracking]);

  return { fullRecords, currentFeedback, setCurrentFeedback };
}

export default useRunRecorder;
