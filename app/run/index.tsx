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
import Ionicons from '@expo/vector-icons/Ionicons';

import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function RunPage() {
  const { routeId } = useLocalSearchParams<{ routeId: string }>();
  const { routePoints, origin, destination, targetPace, targetTime } = useRunSetting(routeId);
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

  const { location } = useUserLocation({ isTracking });

  const { fullRecords, currentFeedback, setCurrentFeedback } = useRunRecorder({
    currentLocation: location,
    routeId,
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

  const { evaluateResult } = useRunSessionFinalizer({
    routeId,
    isComplete,
    effortLevel: effortLevel ?? 0,
    comment,
  });

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (isTracking && location) {
      updateLocation(location);
    }
  }, [isTracking, location, updateLocation]);

  // evaluateResult가 생기면 모달 자동 오픈
  useEffect(() => {
    if (evaluateResult) setShowModal(true);
  }, [evaluateResult]);

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        {routePoints.length > 0 && (
          <RunMapSection
            currentLocation={location}
            paths={[
              { coordinates: routePoints, color: 'blue', dashed: true },
              { coordinates: fullRecords, color: 'purple' },
            ]}
          />
        )}
        <TouchableOpacity style={styles.navigation} onPress={() => router.back()}>
          <Ionicons name="arrow-undo" size={24} color="black" />
        </TouchableOpacity>

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
      <View>
        <Text>{elapsedTime}</Text>
      </View>
      <RunningInfoPanel distance={distance} pace={pace} remainingTime={remainingTime} />
      {isDone && !evaluateResult && (
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

      {/* 결과 모달 */}
      <Modal
        visible={!!evaluateResult && showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.resultModal}>
            <Text style={styles.resultTitle}>🏁 러닝 결과</Text>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>총 거리</Text>
              <Text style={styles.resultValue}>{evaluateResult?.distance ?? '-'} km</Text>
            </View>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>소요 시간</Text>
              <Text style={styles.resultValue}>{evaluateResult?.duration ?? '-'} 분</Text>
            </View>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>평균 페이스</Text>
              <Text style={styles.resultValue}>{evaluateResult?.averagePace ?? '-'} 분/km</Text>
            </View>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>정지 횟수</Text>
              <Text style={styles.resultValue}>{evaluateResult?.stopCount ?? '-'}</Text>
            </View>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>집중 점수</Text>
              <Text style={styles.resultValue}>{evaluateResult?.focusScore ?? '-'}</Text>
            </View>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>노력 레벨</Text>
              <Text style={styles.resultValue}>{evaluateResult?.effortLevel ?? '-'}</Text>
            </View>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>피드백</Text>
              <Text style={styles.resultValue}>{evaluateResult?.feedback_summary?.main ?? '-'}</Text>
            </View>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>조언</Text>
              <Text style={styles.resultValue}>{evaluateResult?.feedback_summary?.advice ?? '-'}</Text>
            </View>
            <Pressable
              style={styles.closeButton}
              onPress={() => {
                setShowModal(false);
                router.push('/');
              }}
            >
              <Text style={styles.closeButtonText}>닫기</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', position: 'relative' },
  mapContainer: { flex: 1 },
  alarmList: {
    position: 'absolute',
    top: 80,
    right: 10,
    left: 10,
    maxHeight: 200,
    zIndex: 9,
  },
  navigation: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    width: 50,
    height: 50,
    top: 10,
    left: 10,
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  navigationText: {
    fontSize: 40,
  },
  // --- 결과 모달 스타일 ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(30,30,30,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultModal: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 28,
    width: '85%',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 16,
    alignItems: 'center',
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 16,
  },
  resultRow: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 8,
    justifyContent: 'space-between',
  },
  resultLabel: {
    fontSize: 15,
    color: '#555',
    fontWeight: '600',
  },
  resultValue: {
    fontSize: 15,
    color: '#222',
    fontWeight: 'bold',
    maxWidth: '60%',
    textAlign: 'right',
  },
  closeButton: {
    marginTop: 18,
    alignSelf: 'center',
    backgroundColor: '#4A90E2',
    paddingHorizontal: 36,
    paddingVertical: 12,
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
