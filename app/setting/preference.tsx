// app/user/preference.tsx
import { updateUserPreferences } from '@/api/user/preference';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  LayoutAnimation,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface PreferenceOption {
  id: string;
  label: string;
}

const places: PreferenceOption[] = [
  { id: 'NONE', label: '상관없음' },
  { id: 'PARK', label: '공원' },
  { id: 'CAFE', label: '카페' },
  { id: 'RIVER', label: '강변/하천' },
];

const pathStyles: PreferenceOption[] = [
  { id: 'NONE', label: '상관없음' },
  { id: 'FASTEST', label: '빠른 길 우선' },
  { id: 'SCENIC', label: '경치 좋은 길' },
  { id: 'EXERCISE', label: '러닝 / 운동 경로' },
  { id: 'QUIET', label: '조용한 길' },
];

const avoidPaths: PreferenceOption[] = [
  { id: 'NONE', label: '상관없음' },
  { id: 'SLOPE', label: '언덕 / 경사로' },
  { id: 'STAIRS', label: '계단' },
  { id: 'DARK', label: '어두운 길' },
  { id: 'ISOLATED', label: '인적이 드문 곳' },
];

const additionalOptions: PreferenceOption[] = [
  { id: 'NONE', label: '상관없음' },
  { id: 'PET', label: '반려동물 동반' },
  { id: 'ACCESSIBLE', label: '휠체어/유모차 접근성' },
  { id: 'CONVENIENCE', label: '편의시설 경유' },
];

const PreferenceSettingsScreen = () => {
  const router = useRouter();

  const [selectedPlaces, setSelectedPlaces] = useState<string[]>(['NONE']);
  const [selectedPathStyles, setSelectedPathStyles] = useState<string[]>(['NONE']);
  const [selectedAvoidPaths, setSelectedAvoidPaths] = useState<string[]>(['NONE']);
  const [selectedAdditionalOptions, setSelectedAdditionalOptions] = useState<string[]>(['NONE']);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleToggle = (id: string, selected: string[], setSelected: (val: string[]) => void) => {
    if (id === 'NONE') {
      setSelected(['NONE']);
    } else {
      let updated = selected.includes(id)
        ? selected.filter((i) => i !== id)
        : [...selected.filter((i) => i !== 'NONE'), id];
      if (updated.length === 0) updated = ['NONE'];
      setSelected(updated);
    }
  };

  const getLabel = (ids: string[], list: PreferenceOption[]) =>
    ids.includes('NONE')
      ? '상관없음'
      : ids
          .map((i) => list.find((l) => l.id === i)?.label)
          .filter(Boolean)
          .join(', ');

  const renderSection = (
    title: string,
    options: PreferenceOption[],
    selected: string[],
    setSelected: (val: string[]) => void,
    key: string,
  ) => (
    <View key={key} style={styles.inputSection}>
      <TouchableOpacity style={styles.sectionToggleButton} onPress={() => toggleSection(key)}>
        <Text style={styles.inputLabel}>{title}</Text>
        <Ionicons name={expandedSection === key ? 'chevron-up' : 'chevron-down'} size={20} color="#666" />
      </TouchableOpacity>
      {expandedSection !== key && <Text style={styles.selectedSummaryText}>{getLabel(selected, options)}</Text>}
      {expandedSection === key && (
        <View style={styles.checkboxListContainer}>
          {options.map((opt) => (
            <TouchableOpacity
              key={opt.id}
              style={styles.checkboxRow}
              onPress={() => handleToggle(opt.id, selected, setSelected)}
            >
              <MaterialCommunityIcons
                name={selected.includes(opt.id) ? 'checkbox-marked' : 'checkbox-blank-outline'}
                size={24}
                color="#007AFF"
              />
              <Text style={styles.checkboxLabel}>{opt.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  const handleSave = async () => {
    try {
      await updateUserPreferences({
        preferencePlaces: selectedPlaces,
        preferenceRoutes: selectedPathStyles,
        preferenceAvoids: selectedAvoidPaths,
        preferenceEtcs: selectedAdditionalOptions,
      });

      Alert.alert('완료', '선호도가 저장되었습니다.');
      router.back();
    } catch (e: any) {
      Alert.alert('오류', e.message || '저장 실패');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>선호도 설정</Text>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {renderSection('장소', places, selectedPlaces, setSelectedPlaces, 'places')}
          {renderSection('길 스타일', pathStyles, selectedPathStyles, setSelectedPathStyles, 'paths')}
          {renderSection('피하고 싶은 경로', avoidPaths, selectedAvoidPaths, setSelectedAvoidPaths, 'avoids')}
          {renderSection(
            '기타 옵션',
            additionalOptions,
            selectedAdditionalOptions,
            setSelectedAdditionalOptions,
            'etcs',
          )}
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>저장</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  backButton: { paddingRight: 10 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  scrollContent: { paddingHorizontal: 15, paddingTop: 20, paddingBottom: 20 },
  inputSection: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    elevation: 1,
  },
  sectionToggleButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
  },
  inputLabel: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  selectedSummaryText: { marginTop: 8, color: '#666' },
  checkboxListContainer: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: Dimensions.get('window').width / 2 - 30,
    marginBottom: 12,
  },
  checkboxLabel: { marginLeft: 8, color: '#333' },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default PreferenceSettingsScreen;
