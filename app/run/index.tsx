import {
  FeedbackAlarmList,
  RunControlPanel,
  RunMapSection,
  RunningFinishModal,
  RunningInfoPanel,
} from '@/components/run-feedback';
import {
  useRunningTracker,
  useRunRecorder,
  useRunSessionFinalizer,
  useRunSetting,
  useUserLocation,
} from '@/hooks/run-feedback';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

export default function RunPage() {
  const { routePoints, origin, destination, targetPace, targetTime } = useRunSetting('1');

  console.log('route', routePoints, 'origin', origin, 'dst', destination);
  const {
    isTracking,
    isPaused,
    isDone,
    elapsedTime,
    distance,
    pace,
    currentLocation,
    remainingDistance,
    remainingTime,
    start,
    finish,
    pause,
    resume,
    updateLocation,
  } = useRunningTracker({ destination, targetPace });

  console.log(routePoints);

  const { location } = useUserLocation({ isTracking });

  const { fullRecords, currentFeedback, setCurrentFeedback } = useRunRecorder({
    currentLocation: location,
    distance,
    pace,
    elapsedTime,
    isTracking,
    targetPace,
    remainingTime,
    targetTime,
  });

  const [effortLevel, setEffortLevel] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useRunSessionFinalizer({
    routeId: '1',
    isComplete,
    effortLevel: effortLevel ?? 0,
    comment,
  });

  useEffect(() => {
    if (isTracking && location) {
      updateLocation(location);
    }
  }, [isTracking, location, updateLocation]);

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <RunMapSection
          currentLocation={location}
          paths={[
            { routePoints, color: 'blue', dashed: true },
            { coordinates: fullRecords, color: 'purple' },
          ]}
        />
        <RunControlPanel
          isTracking={isTracking}
          isPaused={isPaused}
          start={start}
          pause={pause}
          resume={resume}
          finish={finish}
        />
        <ScrollView style={styles.alarmList}>
          {currentFeedback.map((alarm, idx) => (
            <FeedbackAlarmList
              key={alarm.timestamp + alarm.semiType}
              alarm={alarm}
              deleteAlarm={() => setCurrentFeedback(currentFeedback.filter((fb) => fb !== alarm))}
            />
          ))}
        </ScrollView>
      </View>
      <RunningInfoPanel distance={distance} pace={pace} remainingTime={remainingTime} />
      {isDone && (
        <RunningFinishModal
          effortLevel={effortLevel}
          setEffortLevel={setEffortLevel}
          comment={comment}
          setComment={setComment}
          setComplete={() => {
            setIsComplete(true);
          }}
          remainingDistance={remainingDistance}
          onClose={resume}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  mapContainer: { flex: 1 },
  alarmList: {
    position: 'absolute',
    top: 80,
    right: 10,
    left: 10,
    maxHeight: 200,
    zIndex: 9,
  },
});
