import axios from '@/api/axios';
import useSettingStore from '@/store/run-feedback/useSettingStore';
import { UseRunSettingResult } from '@/types/run-feedback/types';
import { formatTimeStamp } from '@/utils/runUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

const initStorage = async (key: string) => {
  console.log('실행 왜 안되냐');
  const data = await AsyncStorage.removeItem('run-strage');
  // console.log('data', data);
};

export default function useRunSetting(routeId: string): UseRunSettingResult {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initStorage('setting-store');
    if (!routeId) {
      setError('경로 ID가 없습니다.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    fetchSettings();
  }, [routeId]);

  const {
    routePoints,
    destination,
    origin,
    targetPace,
    targetTime,
    routeId: storedRouteId,
    setSettingData,
  } = useSettingStore();

  const fetchSettings = async () => {
    const timestampMillis = new Date().getTime();
    formatTimeStamp(timestampMillis);

    try {
      if (Number(routeId) === storedRouteId) {
        console.log(storedRouteId);
        setLoading(false);
        // return;
      }

      const { data } = await axios.get(`api/running-settings/${routeId}`);
      console.log('fetch', data);
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
