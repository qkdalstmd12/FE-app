import { fetchCandidateRoutes } from '@/api/route';
import { create } from 'zustand';

type Route = {
  id: number;
  name: string;
  duration: number;
  coordinates?: { latitude: number; longitude: number }[];
};

type RouteStore = {
  todayRoutes: Route[];
  candidateRoutes: Route[];
  deleteRoute: (id: number) => void;
  selectNewRoute: (oldId: number, newRoute: Route) => void;
  addRoute: (route: Route) => void;
  setTodayRoutes: (routes: Route[]) => void;
  loadCandidateRoutes: (routeId: number) => void;
};

export const useRouteStore = create<RouteStore>((set) => ({
  todayRoutes: [],
  candidateRoutes: [],
  deleteRoute: (id) =>
    set((state) => ({
      todayRoutes: state.todayRoutes.filter((route) => route.id !== id),
    })),
  selectNewRoute: (oldId, newRoute) =>
    set((state) => {
      const updatedRoutes = state.todayRoutes.map((r) => (r.id === oldId ? { ...newRoute, id: oldId } : r));
      return { todayRoutes: updatedRoutes };
    }),
  addRoute: (route) =>
    set((state) => ({
      todayRoutes: [...state.todayRoutes, route],
    })),
  setTodayRoutes: (routes) => set(() => ({ todayRoutes: routes })),
  loadCandidateRoutes: async (routeId: number) => {
    try {
      const response = await fetchCandidateRoutes(routeId);
      set(() => ({ candidateRoutes: response }));
    } catch (err) {
      console.error('후보 경로 불러오기 실패:', err);
    }
  },
}));
