// store/useRunSettingsStore.ts
import DummyPathData from '@/constants/DummyRunning.json';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PathPoint } from './useRunningStatusStore';

interface RunSettings {
  target_pace: number;
  start_time: number;
  arrival_time: number;
  planned_route: PathPoint[];

  setTargetPace: (pace: number) => void;
  setStartTime: (time: number) => void;
  setArrivalTime: (time: number) => void;
  setPlannedRoute: (route: PathPoint[]) => void;
  resetSettings: () => void;
}

export const useRunSettingsStore = create<RunSettings>()(
  persist(
    (set) => ({
      target_pace: 10,
      start_time: 0,
      arrival_time: 500,
      planned_route: DummyPathData,

      setTargetPace: (target_pace) => set({ target_pace }),
      setStartTime: (start_time) => set({ start_time }),
      setArrivalTime: (arrival_time) => set({ arrival_time }),
      setPlannedRoute: (planned_route) => set({ planned_route }),
      resetSettings: () =>
        set({
          target_pace: 0,
          start_time: 0,
          arrival_time: 0,
          planned_route: [],
        }),
    }),
    {
      name: 'run-settings-store',
    },
  ),
);
