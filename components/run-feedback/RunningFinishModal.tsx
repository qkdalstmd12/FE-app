import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
  const primaryColor = getPrimaryColor(remainingDistance);
  const secondColor = getSecondColor(remainingDistance);
  const textColor = getTextColor(remainingDistance);

  // 커스텀 드롭다운 열림 여부
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <Overlay>
      <View style={[styles.modalBox, { borderColor: primaryColor }]}>
        <Text style={[styles.title, { color: textColor }]}>
          {remainingDistance < 100 ? '러닝 완료' : '러닝 중도 완료'}
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>오늘의 러닝 만족도를 선택해주세요</Text>
          <View style={styles.levelRow}>
            {[1, 2, 3, 4, 5].map((number) => (
              <TouchableOpacity
                key={number}
                style={[styles.levelButton, effortLevel === number && { backgroundColor: primaryColor }]}
                onPress={() => setEffortLevel(number)}
              >
                <Text style={[styles.levelButtonText, effortLevel === number && { color: '#fff' }]}>{number}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>오늘 러닝은 어떠셨나요?</Text>
          <TouchableOpacity
            style={[styles.dropdownToggle, { borderColor: primaryColor }]}
            onPress={() => setDropdownOpen(!dropdownOpen)}
            activeOpacity={0.7}
          >
            <Text style={{ color: comment ? '#222' : '#999' }}>{comment || '선택해주세요'}</Text>
          </TouchableOpacity>

          {dropdownOpen && (
            <ScrollView style={[styles.dropdownList, { borderColor: primaryColor }]} nestedScrollEnabled>
              {commentValue.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setComment(item);
                    setDropdownOpen(false);
                  }}
                >
                  <Text style={styles.dropdownItemText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity onPress={onClose} style={[styles.actionButton, { backgroundColor: secondColor }]}>
            <Text style={[styles.actionButtonText, { color: textColor }]}>닫기</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={setComplete} style={[styles.actionButton, { backgroundColor: primaryColor }]}>
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
  dropdownToggle: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  dropdownList: {
    maxHeight: 120,
    marginTop: 8,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#222',
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
