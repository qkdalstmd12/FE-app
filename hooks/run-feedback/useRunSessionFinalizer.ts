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
  completeTime: any;
  runningPaths: RunRecord[];
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
      completeTime: new Date().toISOString(),
      runningPaths: fullRecords,
    };

    try {
      console.log('전체기록', entries);

      const response = await axios.post('api/running/complete', entries);
      console.log(response);
      setEvaluateResult(response.data);
      if (response) {
        clearTrackData();
        console.log('전송 완료');
        // 필요하다면 setEvaluateResult(response.data); 등으로 결과 저장 가능
      }
    } catch (err: any) {
      console.error('전체 기록 전송 실패:', err.message || err);
      clearTrackData();
      setEvaluateResult({
        routeId: 9,
        distance: 3.21,
        duration: 25,
        averagePace: 7.6,
        stopCount: 3,
        feedbackSummaryDTO: {
          main: '초반과 후반 속도 차이가 있어요.',
          advice: '다음엔 초반 속도를 더 조절해보세요.',
          earlySpeedDeviation: 1.2,
        },
        focusScore: 78,
      });
    }
  };

  useEffect(() => {
    if (isComplete) sendFinalRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isComplete]);

  return { evaluateResult };
}

export default useRunSessionFinalizer;
