// stores/useRunStore.ts
import { RunStoreState } from '@/types/run-feedback/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// 3. Zustand 상태 타입 정의

// 4. Zustand store 생성
export const useRunStore = create<RunStoreState>()(
  persist(
    (set) => ({
      totalDistance: 0,
      remainingDistance: 0,
      remainingTime: 0,
      averagePace: 0,
      elapsedTime: 0,
      fullRecords: [],

      setTrackData: (data) => {
        set((state) => ({
          ...state,
          ...data,
        }));
        setTimeout(() => {}, 0);
      },

      addRecord: (record) =>
        set((state) => ({
          fullRecords: [...state.fullRecords, record],
        })),

      clearTrackData: () => {
        set(() => ({
          totalDistance: 0,
          remainingDistance: 0,
          remainingTime: 0,
          averagePace: 0,
          elapsedTime: 0,
          fullRecords: [],
        }));
      },
    }),
    {
      name: 'run-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
