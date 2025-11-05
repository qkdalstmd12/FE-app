import { createRoutine } from '@/api/user/routine';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FormContent, FormField, FormFieldType, FormPage } from '@/components/common';
import { useFormStateManager } from '@/hooks/common';
import { RoutineField, routineFields } from '@/types/auth';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// 루틴 객체 타입 정의
interface Add {
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

const defaultRoutine: Add = {
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

const titleToPlaceEnum = (title: string): ServerRoutine['place'] => {
  const map: { [key: string]: ServerRoutine['place'] } = {
    회사: 'COMPANY',
    헬스장: 'GYM',
    학교: 'SCHOOL',
    집: 'HOME',
  };
  return map[title] ?? 'ETC';
};

const toServerRoutine = (routine: Add): ServerRoutine => ({
  place: routine.title,
  destination: routine.location,
  time: routine.start,
  day: routine.days.map(dayIdxToServerDay),
});

export default function RoutineSetupPage() {
  const [routines, setRoutines] = useState<Add[]>([
    { ...defaultRoutine, title: '회사', location: '' },
    { ...defaultRoutine, title: '헬스장', location: '' },
  ]);

  const { states, changeStates, resetStates } = useFormStateManager<RoutineField>(routineFields);

  const handleSubmitRoutine = async (serverRoutine: ServerRoutine) => {
    try {
      const response = createRoutine(serverRoutine);
    } catch (error) {
      console.error('루틴 전송 실패:', error);
      throw error;
    }
  };

  const handleSubmitAllRoutines = async () => {
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
    <FormPage submit={handleSubmitAllRoutines} title={'루틴을 생성해주세요'} reset={null} submitText={'생성하기'}>
      <FormContent
        states={states}
        handleChangeValue={changeStates}
        handleResetForm={resetStates}
        submitText={'생성하기'}
      >
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            key={0}
            style={styles.checkboxRow}
            onPress={() => changeStates('routineType', [['value', 'fix']])}
          >
            <MaterialCommunityIcons
              style={styles.checkboxStyle}
              name={states['routineType']['value'] === 'fix' ? 'checkbox-marked' : 'checkbox-blank-outline'}
              size={24}
            />
            <Text style={styles.checkboxLabel}>{value}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            key={1}
            style={styles.checkboxRow}
            onPress={() => changeStates('routineType', [['value', 'daily']])}
          >
            <MaterialCommunityIcons
              style={styles.checkboxStyle}
              name={states['routineType']['value'] === 'daily' ? 'checkbox-marked' : 'checkbox-blank-outline'}
              size={24}
            />
            <Text style={styles.checkboxLabel}>{value}</Text>
          </TouchableOpacity>
        </View>
        <FormField
          type={FormFieldType.option}
          label={'장소 유형'}
          placeholder={'장소 유형을 선택해주세요'}
          fieldKey={'place'}
        />
        <View style={styles.timeRow}></View>
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
        <FormField
          type={FormFieldType.input}
          label={'시작시간'}
          placeholder={'시간을 입력해주세요'}
          fieldKey={'time'}
        />
      </FormContent>
    </FormPage>
  );
}

// 스타일만 카드형 모달, 버튼, 여백, 컬러 등 "미학적"으로 개선
const styles = StyleSheet.create({
  scrollContainer: {
    padding: 20,
    backgroundColor: 'white',
  },
  formContainer: {
    borderRadius: 21,
    flexDirection: 'column',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: '#414B61',
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
    gap: 10,
    flexDirection: 'row',
  },
  startBtn: {
    backgroundColor: '#414B61',
    borderRadius: 8,
    paddingVertical: 15,
    flex: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 2 },
  },
  startBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    letterSpacing: -0.2,
  },
});
