// hooks/useRunningTracker.ts
import DummyPathData from '@/constants/DummyRunning.json';
import { useAlertStore } from '@/store/run-feedback/useAlertStore';
import { useRunSettingsStore } from '@/store/run-feedback/useRunSettingStore';
import { useEffect, useState } from 'react';
import { useAlertTracker } from './useAlertTracker';
import { useDistanceTracker } from './useDistanceTracker';
import { usePaceTracker } from './usePaceTracker';

export enum RunningState{
  start,running,pause,none
}

export function useRunningTracker() {

  // 러닝 스테이트 관리
  const [runningState,setRunningState] = useState<RunningState>(RunningState.none)

  // 러닝 스테이트에 따라 러닝 시작

  useEffect(() => {
    if ((runningState) === RunningState.start) 
    {
      console.log("러닝 시작")
      startTracking();
      setRunningState(RunningState.running)
    }
  }, [runningState])

  // 러닝 세팅
  const { target_pace , arrival_time, planned_route } = useRunSettingsStore();


  // 러닝 시작
  const { pace, elapsedTime } = usePaceTracker(); 
  const { distance, path,    startTracking,
    pauseTracking,
    resetTracking}= useDistanceTracker();
  const { addAlert, alerts } = useAlertStore();

  const currentLocation = {lat:35.8416658,lng:128.7381176,timestamp:Date.now()};



  

  const { currentAlert } = useAlertTracker({
    distance,
    pace,
    elapsedTime,
    path:DummyPathData,
    arrivalTime: arrival_time,
    targetPace: target_pace,
    destination: {lat:35.8416658,lng:128.7381176,timestamp:Date.now()},
    addAlert,
  });

return {
  pace,
  elapsedTime,
  distance,
  path, 
  currentLocation,
  currentAlert,
  alerts,
  runningState,
  setRunningState
}};