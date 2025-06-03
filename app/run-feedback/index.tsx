import MapViewComponent from '@/components/run-feedback/MapView.native';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { RunningState, useRunningTracker } from '@/hooks/run-feedback/useRunningTracker';

export default function Index() {
  const {
    pace,
    elapsedTime,
    distance,
    path,
    currentLocation,
    currentAlert,
    alerts,
    runningState,
    setRunningState
  } = useRunningTracker();


  useEffect(() => {
    setRunningState(RunningState.start);
  }, [])


  const formatTime = (totalSec: number) => {
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${min < 10 ? '0' : ''}${min}m ${sec < 10 ? '0' : ''}${sec}s`;
  };
  


  if (runningState === RunningState.running && !currentLocation) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>현재 위치를 불러오는 중...</Text>
      </View>
    );
  }


  return (
    <View style={styles.container}>
      {/* 상단 내비게이션 바 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.activityMode}>
          <Ionicons name="walk" size={18} color="#fff" />
          <Text style={styles.activityModeText}> Jogging</Text>
        </View>
        <TouchableOpacity style={styles.headerBtn}>
          <Ionicons name="ellipsis-horizontal" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* 지도 컴포넌트 */}
      <MapViewComponent
        path={path}
        initialRegion={currentLocation}
        showsUserLocation={true}
        currentLocation={currentLocation}
      />

      {/* 하단 통계 및 컨트롤 패널 */}
      <View style={styles.panel}>
        <Text style={styles.distance}>
          {(distance).toFixed(2)}/5.00 miles
        </Text>
        <Text style={styles.stats}>
          <Text style={styles.statItem}>👣 {(distance * 1400).toFixed(0)}{pace}</Text>
          <Text style={styles.statItem}>🔥 {(distance * 60).toFixed(1)} {distance}</Text>
          <Text style={styles.statItem}>⏱ {formatTime(elapsedTime)}</Text>
        </Text>

        <View style={styles.controls}>
          {runningState === RunningState.running ? (
            <TouchableOpacity
              style={[styles.btn, styles.stopBtn]}
              onPress={()=>{console.log("러닝 중")}}
            >
              <Text style={styles.btnText}>■</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.btn, styles.playBtn]}
              onPress={()=>setRunningState(RunningState.start)}
            >
              <Text style={styles.btnText}>▶</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.btn, styles.resetBtn]}
            onPress={()=>setRunningState(RunningState.none)}
          >
            <Text style={styles.btnText}>↺</Text>
          </TouchableOpacity>
        </View>

        {currentAlert && (
          <Text style={{ color: 'red', marginTop: 10, textAlign: 'center' }}>
            ⚠ {currentAlert.message}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 10,
  },
  headerBtn: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  activityMode: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  activityModeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  panel: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  distance: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  stats: {
    fontSize: 14,
    marginTop: 6,
    color: '#555',
    textAlign: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  statItem: {
    marginHorizontal: 5,
    paddingVertical: 2,
  },
  controls: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  btn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  stopBtn: {
    backgroundColor: '#f44',
  },
  playBtn: {
    backgroundColor: '#4f4',
  },
  resetBtn: {
    backgroundColor: '#aaa',
  },
  btnText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
});