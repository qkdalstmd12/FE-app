import { createRoutine } from '@/api/user/routine';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// 루틴 객체 타입 정의
interface Routine {
  title: string;
  location: string;
  days: number[];
  start: string;
  end: string;
}

// 서버에 보낼 형식
interface ServerRoutine {
  place: string;
  destination: string;
  time: string;
  day: string[];
}

const defaultRoutine: Routine = {
  title: '',
  location: '',
  days: [],
  start: '',
  end: '',
};

const dayNames = ['월', '화', '수', '목', '금', '토', '일'];

const dayIdxToServerDay = (idx: number): string => {
  switch (idx) {
    case 0:
      return 'MONDAY';
    case 1:
      return 'TUESDAY';
    case 2:
      return 'WEDNESDAY';
    case 3:
      return 'THURSDAY';
    case 4:
      return 'FRIDAY';
    case 5:
      return 'SATURDAY';
    case 6:
      return 'SUNDAY';
    default:
      return '';
  }
};

const toServerRoutine = (routine: Routine): ServerRoutine => ({
  place: routine.title,
  destination: routine.location,
  time: routine.start,
  day: routine.days.map(dayIdxToServerDay),
});

export default function RoutineSetup() {
  const [routines, setRoutines] = useState<Routine[]>([
    { ...defaultRoutine, title: '회사', location: '' },
    { ...defaultRoutine, title: '헬스장', location: '' },
  ]);

  const toggleDay = (routineIdx: number, dayIdx: number) => {
    setRoutines((prev) =>
      prev.map((r, i) =>
        i === routineIdx
          ? {
              ...r,
              days: r.days.includes(dayIdx) ? r.days.filter((d) => d !== dayIdx) : [...r.days, dayIdx],
            }
          : r,
      ),
    );
  };

  const addRoutine = () => setRoutines((prev) => [...prev, { ...defaultRoutine }]);

  const sendRoutine = async (serverRoutine: ServerRoutine) => {
    try {
      const response = createRoutine(serverRoutine);
    } catch (error) {
      console.error('루틴 전송 실패:', error);
      throw error;
    }
  };

  const submitAllRoutines = async () => {
    router.push('/user/preference');
    try {
      for (const routine of routines) {
        const serverRoutine = toServerRoutine(routine);
        await sendRoutine(serverRoutine);
      }
      alert('루틴이 성공적으로 저장되었습니다!');
    } catch {
      alert('루틴 저장 중 오류가 발생했습니다.');
    }
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        <Text style={styles.title}>루틴 설정</Text>
        <ScrollView style={{ maxHeight: 400 }}>
          {routines.map((routine, idx) => (
            <View key={idx} style={styles.routineBox}>
              <TextInput
                style={styles.input}
                placeholder="장소"
                value={routine.title}
                onChangeText={(text) =>
                  setRoutines((prev) => prev.map((r, i) => (i === idx ? { ...r, title: text } : r)))
                }
              />
              <TextInput
                style={[styles.input, { marginBottom: 12 }]}
                placeholder="목적지"
                value={routine.location}
                onChangeText={(text) =>
                  setRoutines((prev) => prev.map((r, i) => (i === idx ? { ...r, location: text } : r)))
                }
              />
              <View style={styles.timeRow}>
                <TextInput
                  style={styles.timeInput}
                  placeholder="시작"
                  value={routine.start}
                  onChangeText={(text) =>
                    setRoutines((prev) => prev.map((r, i) => (i === idx ? { ...r, start: text } : r)))
                  }
                />
                <TextInput
                  style={styles.timeInput}
                  placeholder="종료"
                  value={routine.end}
                  onChangeText={(text) =>
                    setRoutines((prev) => prev.map((r, i) => (i === idx ? { ...r, end: text } : r)))
                  }
                />
              </View>
              <View style={styles.dayRow}>
                {dayNames.map((d, dIdx) => (
                  <TouchableOpacity
                    key={d}
                    style={[styles.dayBtn, routine.days.includes(dIdx) && styles.dayBtnActive]}
                    onPress={() => toggleDay(idx, dIdx)}
                  >
                    <Text style={[styles.dayBtnText, routine.days.includes(dIdx) && styles.dayBtnTextActive]}>{d}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
        <TouchableOpacity style={styles.addBtn} onPress={addRoutine}>
          <Text style={styles.addBtnText}>+ 고정 스케줄 추가</Text>
        </TouchableOpacity>
        <View style={styles.bottomRow}>
          <TouchableOpacity onPress={submitAllRoutines} style={styles.startBtn}>
            <Text style={styles.startBtnText}>저장하기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// 스타일만 카드형 모달, 버튼, 여백, 컬러 등 "미학적"으로 개선
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // 모달 느낌
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '90%',
    maxWidth: 370,
    backgroundColor: '#F5F6F8',
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 22,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.14,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 18,
    color: '#222',
    letterSpacing: -0.5,
  },
  routineBox: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 18,
    width: 290,
    alignSelf: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 2 },
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
    backgroundColor: '#fafbfc',
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    gap: 10,
  },
  timeInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 10,
    width: 120,
    fontSize: 15,
    backgroundColor: '#fafbfc',
  },
  dayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 2,
    gap: 3,
  },
  dayBtn: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 16,
    backgroundColor: '#eee',
    marginHorizontal: 2,
    minWidth: 32,
    alignItems: 'center',
  },
  dayBtnActive: {
    backgroundColor: '#5A5A9E',
  },
  dayBtnText: {
    fontSize: 15,
    color: '#555',
  },
  dayBtnTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  addBtn: {
    marginTop: 6,
    marginBottom: 14,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1.2,
    borderColor: '#bbb',
    paddingVertical: 12,
    width: 290,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  addBtnText: {
    color: '#444',
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: -0.1,
  },
  bottomRow: {
    width: '100%',
    alignItems: 'center',
    marginTop: 4,
  },
  startBtn: {
    backgroundColor: '#5A5A9E',
    borderRadius: 8,
    paddingVertical: 15,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 2 },
  },
  startBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: -0.2,
  },
});
