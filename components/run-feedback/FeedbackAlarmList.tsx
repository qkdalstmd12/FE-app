import { RunFeedback } from '@/types/run-feedback/types';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface AlarmModalProps {
  alarm: RunFeedback;
  deleteAlarm: () => void;
}

const guide: Record<string, string> = {
  pace: '페이스를 조절해보세요',
  eta: '페이스를 조절해보세요',
  good: '지금처럼 쭉 하세요!',
  stop: '다시 되돌아오세요',
};

const color = {
  error: { borderColor: '#B3261E', color: '#B3261E' },
  normal: { borderColor: '#56C947', color: '#56C947' },
} as const;

const icon = {
  error: <MaterialCommunityIcons name="alert-circle" size={22} color="#B3261E" />,
  normal: <MaterialCommunityIcons name="check-circle" size={22} color="#56C947" />,
} as const;

const getAlarmType = (type: string): keyof typeof color => (type === 'normal' ? 'normal' : 'error');

const AlarmModal: React.FC<AlarmModalProps> = ({ alarm, deleteAlarm }) => {
  const alarmType = getAlarmType(alarm.type);
  const alarmColor = color[alarmType];
  const alarmIcon = icon[alarmType];

  return (
    <TouchableOpacity
      onPress={deleteAlarm}
      activeOpacity={0.85}
      style={[styles.container, { borderColor: alarmColor.borderColor }]}
    >
      <View style={styles.content}>
        {alarmIcon}
        <View style={styles.textBox}>
          <Text style={styles.title}>{alarm.message}</Text>
          <Text style={styles.subtitle}>{guide[alarm.semiType] || ''}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={deleteAlarm}>
        <MaterialIcons name="close" size={22} color={alarmColor.color} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 18,
    borderWidth: 2,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.8)',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    // gap은 RN 0.71 이상에서만 지원, 하위 버전이면 marginRight 사용
    // gap: 12,
  },
  textBox: {
    flexDirection: 'column',
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 16,
    color: '#222',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 13,
    color: '#4B5563',
    marginTop: 2,
  },
});

export default AlarmModal;
