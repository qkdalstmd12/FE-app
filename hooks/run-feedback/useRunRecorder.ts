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
}

const sendRunningState = async (record: RunRecord) => {
  try {
    if (!record) return;
    await axios.post('/running/state', record);
  } catch (err: any) {
    console.error('실시간 전송 오류:', err.message);
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

    const interval = setInterval(() => {
      if (locationRef.current != null) {
        const now = Date.now();
        const paceFeedback: RunFeedback = {
          timestamp: now,
          type: 'error',
          semiType: 'pace',
          message: getPaceFeedback({
            pace: paceRef.current,
            targetPace: targetPaceRef.current,
          }),
        };
        const stopFeedback: RunFeedback = {
          timestamp: now,
          type: 'error',
          semiType: 'stop',
          message: getStopFeedback({
            distance: distanceRef.current,
            prevDistance: prevDistanceRef.current,
            now,
            stopStartTimeRef,
          }),
        };
        const etaFeedback: RunFeedback = {
          timestamp: now,
          type: 'error',
          semiType: 'eta',
          message: getEtaFeedback({
            now,
            remainingTime: remainingTimeRef.current,
            targetTime: targetTimeRef.current,
          }),
        };

        const feedbacks: RunFeedback[] = [paceFeedback, stopFeedback, etaFeedback].filter(
          (item) => item.message != null,
        );

        const newRecord: RunRecord = {
          timeStamp: now,
          location: locationRef.current,
          distance: distanceRef.current,
          pace: paceRef.current,
          elapsedTime: elapsedTimeRef.current,
          feedbacks,
        };

        addRecord(newRecord); // zustand에 저장
        sendRunningState(newRecord); // 실시간 전송

        setCurrentFeedback(feedbacks);
        prevDistanceRef.current = distanceRef.current;
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isTracking]);

  return { fullRecords, currentFeedback, setCurrentFeedback };
}

export default useRunRecorder;
