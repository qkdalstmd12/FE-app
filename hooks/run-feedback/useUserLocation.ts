import { Coordinate } from '@/types/run-feedback/types';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

export default function useUserLocation(props: { isTracking: boolean }) {
  const [location, setLocation] = useState<Coordinate | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    const getPermissionAndWatch = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('위치 권한이 거부되었습니다.');
          return;
        }
        if (props.isTracking) {
          subscription = await Location.watchPositionAsync(
            {
              accuracy: Location.Accuracy.High,
              timeInterval: 1000,
              distanceInterval: 1,
            },
            (loc) => {
              setLocation({
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
              });
            },
          );
        }
      } catch (e: any) {
        setError(e.message || '위치 정보를 가져올 수 없습니다.');
      }
    };

    getPermissionAndWatch();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [props.isTracking]);

  return { location, error };
}
