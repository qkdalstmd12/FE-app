import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router'; // 기존 navigation 대체
import React, { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { default as axios, default as axiosInstance } from '../../api/axios';
import { getToken } from '../../utils/auth';

const MyInfoEditScreen = () => {
  const [name, setName] = useState('');
  const [nickName, setNickName] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [runningType, setRunningType] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = await getToken();
        const response = await axiosInstance.get('/api/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { name, nickName, height, weight, runningType } = response.data;
        setName(name);
        setNickName(nickName);
        setHeight(String(height));
        setWeight(String(weight));
        setRunningType(runningType);
      } catch (error: any) {
        console.error('프로필 로드 실패:', error.response?.data || error.message);
        Alert.alert('오류', '사용자 정보를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleSave = async () => {
    if (!name || !nickName || !height || !weight || !runningType) {
      Alert.alert('알림', '모든 정보를 입력해주세요.');
      return;
    }

    try {
      await axios.put('/api/profile-update', {
        name,
        nickName,
        height: parseFloat(height),
        weight: parseFloat(weight),
        runningType,
      });
      Alert.alert('성공', '프로필이 업데이트되었습니다.');
      router.back();
    } catch (error: any) {
      console.error('프로필 업데이트 실패:', error.response?.data || error.message);
      Alert.alert('오류', '프로필 업데이트에 실패했습니다.');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.loadingText}>정보를 불러오는 중...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>내 정보 수정</Text>
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>이름</Text>
            <TextInput style={styles.textInput} value={name} onChangeText={setName} placeholder="이름 입력" />
            <Text style={styles.inputLabel}>닉네임</Text>
            <TextInput style={styles.textInput} value={nickName} onChangeText={setNickName} placeholder="닉네임 입력" />
            <Text style={styles.inputLabel}>키 (cm)</Text>
            <TextInput
              style={styles.textInput}
              value={height}
              onChangeText={setHeight}
              placeholder="키 입력"
              keyboardType="numeric"
            />
            <Text style={styles.inputLabel}>몸무게 (kg)</Text>
            <TextInput
              style={styles.textInput}
              value={weight}
              onChangeText={setWeight}
              placeholder="몸무게 입력"
              keyboardType="numeric"
            />
            <Text style={styles.inputLabel}>러닝 타입</Text>
            <TextInput
              style={styles.textInput}
              value={runningType}
              onChangeText={setRunningType}
              placeholder="JOGGING / RUNNING 등"
            />
          </View>

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
  scrollContent: { padding: 20 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontSize: 16, color: '#666' },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  backButton: { marginRight: 10 },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  inputSection: { marginBottom: 30 },
  inputLabel: { fontSize: 14, fontWeight: 'bold', marginBottom: 5 },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 6,
    alignItems: 'center',
  },
  saveButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default MyInfoEditScreen;
