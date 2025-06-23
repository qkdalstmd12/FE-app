import { Picker } from '@react-native-picker/picker';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Overlay from '../common/Overlay';

interface RunningFinishModalProps {
  effortLevel: number | null;
  setEffortLevel: (level: number) => void;
  comment: string;
  setComment: (comment: string) => void;
  setComplete: () => void;
  remainingDistance: number;
  onClose: () => void;
}

const commentValue = ['너무 힘들었음', '괜찮았음', '할만함', '오늘 컨디션이 별로였음'];

const getPrimaryColor = (remainingDistance: number) => (remainingDistance < 100 ? '#0084FF' : '#B3261E');
const getSecondColor = (remainingDistance: number) => (remainingDistance < 100 ? '#E3F2FF' : '#FDEAEA');
const getTextColor = (remainingDistance: number) => (remainingDistance < 100 ? '#0084FF' : '#B3261E');

const RunningFinishModal: React.FC<RunningFinishModalProps> = ({
  effortLevel,
  setEffortLevel,
  comment,
  setComment,
  setComplete,
  remainingDistance,
  onClose,
}) => {
  return (
    <Overlay>
      <View style={[styles.modalBox, { borderColor: getPrimaryColor(remainingDistance) }]}>
        <Text style={[styles.title, { color: getTextColor(remainingDistance) }]}>
          {remainingDistance < 100 ? '러닝 완료' : '러닝 중도 완료'}
        </Text>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>오늘의 러닝 만족도를 선택해주세요</Text>
          <View style={styles.levelRow}>
            {[1, 2, 3, 4, 5].map((number) => (
              <TouchableOpacity
                key={number}
                style={[
                  styles.levelButton,
                  effortLevel === number && {
                    backgroundColor: getPrimaryColor(remainingDistance),
                  },
                ]}
                onPress={() => setEffortLevel(number)}
              >
                <Text style={[styles.levelButtonText, effortLevel === number && { color: '#fff' }]}>{number}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>오늘 러닝은 어떠셨나요?</Text>
          {/* iOS와 Android에서 Picker UI가 다름 */}
          <View style={styles.pickerWrap}>
            <Picker
              selectedValue={comment}
              onValueChange={(value: any) => setComment(value)}
              style={styles.picker}
              itemStyle={styles.pickerItem}
            >
              {commentValue.map((option) => (
                <Picker.Item key={option} label={option} value={option} />
              ))}
            </Picker>
          </View>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            onPress={onClose}
            style={[styles.actionButton, { backgroundColor: getSecondColor(remainingDistance) }]}
          >
            <Text style={[styles.actionButtonText, { color: getTextColor(remainingDistance) }]}>닫기</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={setComplete}
            style={[styles.actionButton, { backgroundColor: getPrimaryColor(remainingDistance) }]}
          >
            <Text style={[styles.actionButtonText, { color: '#fff' }]}>러닝 완료</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Overlay>
  );
};

const styles = StyleSheet.create({
  modalBox: {
    width: '85%',
    borderRadius: 20,
    backgroundColor: '#fff',
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  section: {
    width: '100%',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#222',
    fontWeight: '600',
    marginBottom: 12,
  },
  levelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  levelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 10,
    marginHorizontal: 2,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  levelButtonText: {
    fontSize: 16,
    color: '#222',
    fontWeight: 'bold',
  },
  pickerWrap: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 8,
  },
  picker: {
    width: '100%',
    height: 44,
  },
  pickerItem: {
    fontSize: 15,
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 16,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RunningFinishModal;
