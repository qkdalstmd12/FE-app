// stores/useSettingStore.ts
import { SettingState, SettingStoreState } from '@/types/run-feedback/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// 초기 상태
const initialState: SettingState = {
  routePoints: [],
  duration: 0,
  estimatedEndTime: 0,
  origin: { latitude: 0, longitude: 0 },
  destination: { latitude: 0, longitude: 0 },
  startTime: 0,
  targetTime: 0,
  targetPace: 0,
  routeId: 0,
  startPoint: '',
  endPoint: '',
};

// Zustand Store 생성
const useSettingStore = create<SettingStoreState>()(
  persist(
    (set) => ({
      ...initialState,

      setSettingData: (data) => {
        set((state) => ({
          ...state,
          ...data,
        }));
        setTimeout(() => {}, 0);
      },

      resetSettingData: () => {
        set(initialState);
      },
    }),
    {
      name: 'setting-store',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export default useSettingStore;
