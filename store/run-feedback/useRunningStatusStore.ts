// store/useRunningStatusStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PathPoint {
  lat: number;
  lng: number;
  timestamp: number;
}

interface RunningState {
  distance: number;
  elapsed_time: number;
  pace: number;
  path: PathPoint[];

  setDistance: (distance: number) => void;
  setElapsedTime: (time: number) => void;
  setPace: (pace: number) => void;
  addPathPoint: (point: PathPoint) => void;
  resetRunning: () => void;
}

export const useRunningStatusStore = create<RunningState>()(
  persist(
    (set) => ({ 
      distance: 0,
      elapsed_time: 0,
      pace: 0,
      path: [],

      setDistance: (distance) => set({ distance }),
      setElapsedTime: (elapsed_time) => set({ elapsed_time }),
      setPace: (pace) => set({ pace }),
      addPathPoint: (point) => set((state) => ({ path: [...state.path, point] })),
      resetRunning: () =>
        set({
          distance: 0,
          elapsed_time: 0,
          pace: 0,
          path: [],
        }),
    }),
    {
      name: 'running-store',
    },
  ),
);
