import axios from '@/api/axios';
import useSettingStore from '@/store/run-feedback/useSettingStore';
import { UseRunSettingResult } from '@/types/run-feedback/types';
import { formatTimeStamp } from '@/utils/runUtils';
import { useEffect, useState } from 'react';

export default function useRunSetting(routeId: string): UseRunSettingResult {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const {
    routePoints,
    destination,
    origin,
    targetPace,
    targetTime,
    routeId: storedRouteId,
    setSettingData,
  } = useSettingStore();

  useEffect(() => {
    if (!routeId) {
      setError('경로 ID가 없습니다.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    fetchSettings();
  }, [routeId]);

  const fetchSettings = async () => {
    const timestampMillis = new Date().getTime();
    formatTimeStamp(timestampMillis);

    try {
      if (Number(routeId) === storedRouteId) {
        console.log(storedRouteId);
        setLoading(false);
        return;
      }

      const { data } = await axios.get(`/api/running-setting?routeId=${routeId}`);
      console.log('data', data);

      const targetTime = formatTimeStamp(data.estimatedArrivalTime);
      const startTime = formatTimeStamp(data.startTime);

      setSettingData(data);
      setSettingData({
        routeId: Number(routeId),
        targetTime,
        startTime,
        origin: routePoints[0],
        destination: routePoints[1],
      });

      setLoading(false);
    } catch (err: any) {
      setError(err.message || '알 수 없는 오류');
      setLoading(false);
      console.log(err);
    }
  };

  useEffect(() => {
    // 디버깅용: 스토어 상태 확인
    // console.log('스토어 현재 상태:', useSettingStore.getState());
  }, []);

  return {
    routePoints,
    destination,
    origin,
    targetPace,
    targetTime,
    loading,
    error,
  };
}
