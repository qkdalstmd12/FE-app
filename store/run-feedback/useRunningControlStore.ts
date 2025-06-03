// store/run-feedback/useRunningControlStore.ts
import { create } from 'zustand';

interface RunningControlState {
  isRunning: boolean;
  isPaused: boolean;
  startTime: number | null;
  setRunning: () => void;
  pauseRunning: () => void;
  resumeRunning: () => void;
  resetRunning: () => void;
}
 
export const useRunningControlStore = create<RunningControlState>((set) => ({
  isRunning: false,
  isPaused: false,
  startTime: null,

  setRunning: () => {
    set({
      isRunning: true,
      isPaused: false,
      startTime: Date.now(),
    });
  },

  pauseRunning: () => {
    set((state) => ({
      isPaused: true,
      isRunning: false,
    }));
  },

  resumeRunning: () => {
    set((state) => ({
      isPaused: false,
      isRunning: true,
      // 유지: startTime은 그대로 둠
    }));
  },

  resetRunning: () => {
    set({
      isRunning: false,
      isPaused: false,
      startTime: null,
    });
  },
}));
