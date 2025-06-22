import { useRunStore } from '@/store/run-feedback/useRunStore';
import { Coordinate } from '@/types/run-feedback/types';
import { calcDistance } from '@/utils/runUtils';
import { useCallback, useEffect, useRef, useState } from 'react';

interface UseRunTrackerProps {
  destination: Coordinate | null;
  targetPace: number;
}

function useRunTracker({ destination, targetPace }: UseRunTrackerProps) {
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isDone, setIsDone] = useState<boolean>(false);
  const [currentLocation, setCurrentLocation] = useState<Coordinate | null>(null);

  const lastLocationRef = useRef<Coordinate | null>(null);
  const timerRef = useRef<number | null>(null);
  const elapsedTimeRef = useRef<number>(0);

  const { remainingDistance, remainingTime, totalDistance, elapsedTime, averagePace, setTrackData } = useRunStore();

  const start = useCallback(() => {
    setIsTracking(true);
    setIsPaused(false);
    setTrackData({
      elapsedTime: 0,
      totalDistance: 0,
      averagePace: 0,
      remainingDistance: 0,
      remainingTime: 0,
    });
    lastLocationRef.current = null;
    setCurrentLocation(null);
  }, [setTrackData]);

  const pause = useCallback(() => {
    setIsPaused(true);
    setIsTracking(false);
  }, []);

  const resume = useCallback(() => {
    setIsTracking(true);
    setIsPaused(false);
    setIsDone(false);
  }, []);

  const finish = useCallback(() => {
    setIsPaused(false);
    setIsTracking(false);
    setIsDone(true);
    lastLocationRef.current = null;
    setCurrentLocation(null);
  }, []);

  const updateLocation = useCallback(
    (location: Coordinate | null) => {
      if (!isTracking || isPaused || !location) return;

      setCurrentLocation(location);

      if (lastLocationRef.current) {
        const dist = calcDistance(lastLocationRef.current, location);
        setTrackData({ totalDistance: totalDistance + dist });
      }
      lastLocationRef.current = location;

      if (destination && targetPace) {
        const remainDist = calcDistance(location, destination); // m
        const remainTimeSec = (remainDist / 1000) * targetPace * 60;
        setTrackData({
          remainingDistance: remainDist,
          remainingTime: remainTimeSec,
        });
      }
    },
    [isTracking, isPaused, setTrackData, totalDistance, destination, targetPace],
  );

  useEffect(() => {
    elapsedTimeRef.current = elapsedTime;
  }, [elapsedTime]);

  useEffect(() => {
    if (isTracking && !isPaused) {
      timerRef.current = setInterval(() => {
        setTrackData({ elapsedTime: elapsedTimeRef.current + 1 });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTracking, isPaused, setTrackData]);

  useEffect(() => {
    const distanceKm = totalDistance / 1000;
    const timeMin = elapsedTime / 60;
    setTrackData({ averagePace: distanceKm > 0 ? timeMin / distanceKm : 0 });
  }, [totalDistance, elapsedTime, setTrackData]);

  return {
    isTracking,
    isPaused,
    isDone,
    elapsedTime,
    distance: totalDistance,
    pace: averagePace,
    currentLocation,
    remainingDistance,
    remainingTime,
    finish,
    start,
    pause,
    resume,
    updateLocation,
  };
}

export default useRunTracker;
