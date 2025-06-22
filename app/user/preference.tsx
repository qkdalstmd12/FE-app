import { createUserPreferences } from '@/api/user/preference';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// 카테고리/옵션 데이터
const PREFERENCE_DATA = [
  {
    label: '선호 장소',
    options: ['산책로', '실내', '카페', '관악/서초'],
  },
  {
    label: '선호 경로',
    options: ['산책로', '빠르게 돌 수', '경치 좋은 곳', '러닝/운동 경로', '조용한 길'],
  },
  {
    label: '피하고 싶은 경로',
    options: ['산책로', '언덕/경사로', '계단', '아무도 없는 곳', '인적이 드문 곳'],
  },
  {
    label: '기타',
    options: ['산책로', '반려동물 동반', '분식/야외좌석 접근성', '편의시설 유무 (화장실, 정수기 등)'],
  },
];

// 체크박스 컴포넌트
const Checkbox = ({
  checked,
  onPress,
}: {
  checked: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      width: 22,
      height: 22,
      borderRadius: 5,
      borderWidth: 2,
      borderColor: '#bbb',
      backgroundColor: checked ? '#414B61' : '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 8,
    }}
  >
    {checked && (
      <View
        style={{
          width: 12,
          height: 12,
          backgroundColor: '#fff',
          borderRadius: 2,
        }}
      />
    )}
  </TouchableOpacity>
);

export default function PreferencePage() {
  // 각 카테고리별로 선택된 옵션 인덱스 배열 관리
  const [selected, setSelected] = useState<number[][]>(
    PREFERENCE_DATA.map(() => [])
  );

  // 체크박스 토글
  const toggleCheck = (catIdx: number, optIdx: number) => {
    setSelected(prev =>
      prev.map((arr, i) =>
        i === catIdx
          ? arr.includes(optIdx)
            ? arr.filter(idx => idx !== optIdx)
            : [...arr, optIdx]
          : arr
      )
    );
  };



  const submitPreference = async () => {
    const selectedLabels = selected.map((selectedIdxArr, catIdx) => {
      if (selectedIdxArr.length === 0) return ['NONE'];
      return selectedIdxArr.map(idx => PREFERENCE_DATA[catIdx].options[idx]);
    });

    const selectedArray = {
        preferencePlaces: selectedLabels[0],
        preferenceRoutes: selectedLabels[1],
        preferenceAvoids: selectedLabels[2],
        preferenceEtcs: selectedLabels[3],
      }

    try {
        const response = await createUserPreferences(selectedArray);
        router.push("/")
    } catch (error) {
        router.push("/")
        
    }
}

  return (
    <View style={styles.overlay}>
      <View style={styles.formContainer}>
        <View style={styles.formHeader}>
          <Text style={styles.headerText}>선호도 설정</Text>
        </View>
        <ScrollView
          style={{ width: '100%', maxHeight: 500 }}
          contentContainerStyle={{ paddingBottom: 24 }}
        >
          {PREFERENCE_DATA.map((cat, catIdx) => (
            <View key={cat.label} style={styles.formLabel}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 6,
                }}
              >
                <Text style={styles.inputLabelText}>{cat.label}</Text>
              </View>
              <View
                style={{
                  backgroundColor: '#F5F6F8',
                  borderRadius: 12,
                  padding: 12,
                }}
              >
                {cat.options.map((opt, optIdx) => (
                  <TouchableOpacity
                    key={opt}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 8,
                    }}
                    onPress={() => toggleCheck(catIdx, optIdx)}
                  >
                    <Checkbox
                      checked={selected[catIdx].includes(optIdx)}
                      onPress={() => toggleCheck(catIdx, optIdx)}
                    />
                    <Text style={{ fontSize: 16 }}>{opt}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            marginTop: 16,
          }}
        >
          <TouchableOpacity style={styles.formButton} onPress={()=>router.back()}>
            <Text style={styles.formButtonText}>이전단계로</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.formButton} onPress={submitPreference}>
            <Text style={styles.formButtonText}>다음단계로</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    borderRadius: 21,
    width: '90%',
    flexDirection: 'column',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    gap: 30,
  },
  formHeader: {
    flexDirection: 'row',
    width: '100%',
    gap: 30,
  },
  headerText: {
    fontSize: 24,
  },
  inputLabelText: {
    fontSize: 13,
    marginHorizontal: 5,
  },
  formLabel: {
    flexDirection: 'column',
    gap: 10,
    marginBottom: 18,
    width: '100%',
  },
  formButton: {
    width: '48%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    backgroundColor: '#414B61',
    padding: 16,
    color: 'white',
  },
  formButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
