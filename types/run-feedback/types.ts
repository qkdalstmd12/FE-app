// stores/types.ts

export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface RunFeedback {
  timestamp: number;
  type: string;
  semiType: string;
  message: string | null;
}

export interface RunRecord {
  timeStamp: number;
  location: Coordinate;
  distance: number;
  pace: number;
  elapsedTime: number;
  feedbacks: RunFeedback[];
}

export interface SettingState {
  routePoints: Coordinate[];
  duration: number;
  estimatedEndTime: number;
  origin: Coordinate;
  destination: Coordinate;
  startPoint: string;
  endPoint: string;
  startTime: number;
  targetTime: number;
  targetPace: number;
  routeId: number;
}

export interface SettingStoreState extends SettingState {
  setSettingData: (data: Partial<SettingState>) => void;
  resetSettingData: () => void;
}

export interface RunStoreState {
  totalDistance: number;
  remainingDistance: number;
  remainingTime: number;
  averagePace: number;
  elapsedTime: number;
  fullRecords: RunRecord[];

  setTrackData: (data: Partial<Omit<RunStoreState, 'setTrackData' | 'addRecord' | 'clearTrackData'>>) => void;
  addRecord: (record: RunRecord) => void;
  clearTrackData: () => void;
}

export interface UseRunSettingResult {
  routePoints: Coordinate[];
  destination: Coordinate;
  origin: Coordinate;
  targetPace: number;
  targetTime: number;
  loading: boolean;
  error: string | null;
}
