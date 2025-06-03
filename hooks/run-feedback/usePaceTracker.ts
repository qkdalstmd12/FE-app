import { useRunningStatusStore } from '@/store/run-feedback/useRunningStatusStore';
import { useEffect, useRef, useState } from 'react';

export function usePaceTracker() {
  const [elapsedTime, setElapsedTime] = useState(0); // sec
  const [pace, setPace] = useState(0); // min/km
  const distance = useRunningStatusStore((s) => s.distance);
  const setElapsedTimeStore = useRunningStatusStore((s) => s.setElapsedTime);

  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    console.log(elapsedTime)
    intervalRef.current = window.setInterval(() => {
      setElapsedTime((prev) => {
        const updated = prev + 1;
        console.log("러닝 중 시간 흐름",updated);
        setElapsedTimeStore(updated);

        const timeMin = updated / 60;
        const distKm = distance / 1000;
        setPace(distKm > 0 ? timeMin / distKm : 0);

        return updated;
      });
    }, 50000);

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [distance, setElapsedTimeStore]);

  return { elapsedTime, pace };
}
