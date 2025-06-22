import { formatDistance, formatTime } from '@/utils/runUtils';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface RunningInfoPanelProps {
  distance: number;
  pace: number;
  remainingTime: number;
}

const RunningInfoPanel: React.FC<RunningInfoPanelProps> = ({ distance, pace, remainingTime }) => (
  <View style={styles.panel}>
    <View style={styles.infoBlock}>
      <Text style={styles.label}>누적 거리</Text>
      <Text style={styles.value}>{formatDistance(distance)} km</Text>
    </View>
    <View style={styles.infoBlock}>
      <Text style={styles.label}>페이스</Text>
      <Text style={styles.value}>{pace ? pace.toFixed(2) : '-'} 분/km</Text>
    </View>
    <View style={styles.infoBlock}>
      <Text style={styles.label}>예상 남은 시간</Text>
      <Text style={styles.value}>{remainingTime !== null ? formatTime(Math.round(remainingTime)) : '-'}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  panel: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    elevation: 4,
  },
  infoBlock: {
    alignItems: 'center',
    gap: 8, // RN 0.71 이상, 하위 버전이면 marginBottom 사용
  },
  label: {
    fontSize: 14,
    color: '#444',
    marginBottom: 8,
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
});

export default RunningInfoPanel;
