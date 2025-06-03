// store/useAlertStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AlertType = 'PACE_DROP' | 'ETA_RISK' | 'LONG_STOP';

export interface AlertItem {
  id: number;
  type: AlertType;
  message: string;
  timestamp: number;
}

interface AlertState {
  alerts: AlertItem[];
  addAlert: (type: AlertType, message: string) => void;
  clearAlerts: () => void;
}

let alertIdCounter = 1;

export const useAlertStore = create<AlertState>()(
  persist(
    (set) => ({
      alerts: [],
      addAlert: (type, message) =>
        set((state) => ({
          alerts: [
            ...state.alerts,
            {
              id: alertIdCounter++,
              type,
              message,
              timestamp: Date.now(),
            },
          ],
        })),
      clearAlerts: () => set({ alerts: [] }),
    }),
    {
      name: 'alert-store',
    },
  ),
);
