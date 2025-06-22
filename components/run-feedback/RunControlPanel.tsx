import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface RunControlPanelProps {
  isPaused: boolean;
  isTracking: boolean;
  start: () => void;
  pause: () => void;
  resume: () => void;
  finish: () => void;
}

const RunControlPanel: React.FC<RunControlPanelProps> = ({ isPaused, isTracking, start, pause, resume, finish }) => (
  <View style={styles.panel}>
    <TouchableOpacity onPress={start} style={[styles.button, { backgroundColor: '#0084FF' }]} disabled={isTracking}>
      <Text style={styles.buttonText}>시작</Text>
    </TouchableOpacity>
    <TouchableOpacity
      onPress={pause}
      style={[styles.button, { backgroundColor: '#56C947' }]}
      disabled={!isTracking || isPaused}
    >
      <Text style={styles.buttonText}>일시정지</Text>
    </TouchableOpacity>
    {isPaused && (
      <TouchableOpacity onPress={resume} style={[styles.button, { backgroundColor: '#a78bfa' }]}>
        <Text style={styles.buttonText}>재개</Text>
      </TouchableOpacity>
    )}
    <TouchableOpacity onPress={finish} style={[styles.button, { backgroundColor: '#B3261E' }]}>
      <Text style={styles.buttonText}>종료</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  panel: {
    position: 'absolute',
    top: 20,
    right: 20,
    flexDirection: 'row',
    gap: 8, // RN 0.71 이상에서만 지원, 하위 버전이면 marginRight 사용
    zIndex: 10,
  },
  button: {
    borderRadius: 10,
    paddingHorizontal: 19,
    paddingVertical: 5,
    marginLeft: 4,
    minWidth: 60,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default RunControlPanel;
