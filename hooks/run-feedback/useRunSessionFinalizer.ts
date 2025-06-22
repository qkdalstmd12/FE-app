import axios from '@/api/axios';
import { useRunStore } from '@/store/run-feedback/useRunStore';
import { RunRecord } from '@/types/run-feedback/types';
import { useEffect, useState } from 'react';

interface UseRunSessionFinalizerProps {
  routeId: string;
  isComplete: boolean;
  effortLevel: number;
  comment: string;
}

interface Entries {
  routeId: string;
  effortLevel: number;
  comment: string;
  totalDistance: number;
  averagePace: number;
  elapsedTime: number;
  completedTime: number;
  runningTrackPoint: RunRecord[];
}

function useRunSessionFinalizer({ routeId, isComplete, effortLevel, comment }: UseRunSessionFinalizerProps) {
  const [evaluateResult, setEvaluateResult] = useState<any>(null);

  const sendFinalRecords = async () => {
    const { fullRecords, elapsedTime, averagePace, totalDistance, clearTrackData } = useRunStore.getState();

    if (fullRecords.length === 0) return;

    const entries: Entries = {
      routeId,
      effortLevel,
      comment,
      totalDistance,
      averagePace,
      elapsedTime,
      completedTime: Date.now(),
      runningTrackPoint: fullRecords,
    };

    try {
      const response = await axios.post('/running/complete', entries);
      if (response) {
        clearTrackData();
        // 필요하다면 setEvaluateResult(response.data); 등으로 결과 저장 가능
      }
    } catch (err: any) {
      console.error('전체 기록 전송 실패:', err.message || err);
    }
  };

  useEffect(() => {
    if (isComplete) sendFinalRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isComplete]);

  return { evaluateResult };
}

export default useRunSessionFinalizer;
