import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';

LocaleConfig.locales['ko'] = {
  monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
  monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
  dayNames: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
  today: '오늘',
};
LocaleConfig.defaultLocale = 'ko';

// 더미 러닝 기록 데이터
const dummyHistory = {
  totalDistance: 9.63,
  runCount: 3,
  avgSpeed: 7.6,
  totalRunTime: '01:15:00',
  runningSessionDTO: [
    {
      runningSettingsResponse: {
        startPoint: null,
        endPoint: null,
      },
      runningHistoryDTO: {
        distance: 3.21,
        duration: 25,
        averagePace: 7.6,
        stopCount: 3,
        feedbackSummaryDTO: {
          main: '초반과 후반 속도 차이가 있어요.',
          advice: '다음엔 초반 속도를 더 조절해보세요.',
          earlySpeedDeviation: 1.2,
        },
        focusScore: 78,
        effortLevel: 4,
        comment: '테스트 러닝 - 처음은 괜찮았는데 막판에 좀 힘들었어요!',
        completedTime: '10:30:00',
        elapsedTime: null,
      },
    },
    {
      runningSettingsResponse: {
        startPoint: 'string',
        endPoint: 'string',
      },
      runningHistoryDTO: {
        distance: 3.21,
        duration: 25,
        averagePace: 7.6,
        stopCount: 3,
        feedbackSummaryDTO: {
          main: '초반과 후반 속도 차이가 있어요.',
          advice: '다음엔 초반 속도를 더 조절해보세요.',
          earlySpeedDeviation: 1.2,
        },
        focusScore: 78,
        effortLevel: 4,
        comment: '9번 러닝',
        completedTime: '10:30:00',
        elapsedTime: '00:30:00',
      },
    },
    {
      runningSettingsResponse: {
        startPoint: '영남대학교',
        endPoint: '반월당',
      },
      runningHistoryDTO: {
        distance: 3.21,
        duration: 25,
        averagePace: 7.6,
        stopCount: 3,
        feedbackSummaryDTO: {
          main: '초반과 후반 속도 차이가 있어요.',
          advice: '다음엔 초반 속도를 더 조절해보세요.',
          earlySpeedDeviation: 1.2,
        },
        focusScore: 78,
        effortLevel: 4,
        comment: '테스트 러닝 - 처음은 괜찮았는데 막판에 좀 힘들었어요!',
        completedTime: '10:30:00',
        elapsedTime: '00:30:00',
      },
    },
  ],
};

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<any>(null);
  const [distanceArray, setDistanceArray] = useState<number[] | null>(null);
  const [historyData, setHistoryData] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSession, setSelectedSession] = useState<any>(null);

  // 실제 API 연동을 원하면 아래 fetchHistory, fetchDistances 사용
  // 지금은 더미 데이터 사용
  const fetchDistances = async () => {
    if (!selectedDate) return;
    const yearMonth = `${selectedDate.year}-${selectedDate.month.toString().padStart(2, 0)}`;
    try {
      const { data } = await axios.get(`api/history/monthly-distances?yearMonth=${yearMonth}`);
      setDistanceArray(data);
    } catch (error) {
      setDistanceArray(null);
      setDistanceArray([
        3.21, 3.21, 3.21, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ]);
    }
  };

  const fetchHistory = async (date) => {
    try {
      const { data } = await axios.get(`api/history/daily?date=${date}`);
      setHistoryData(data);
    } catch (error) {
      setHistoryData(null);
      setHistoryData(dummyHistory);
    }
  };

  useEffect(() => {
    const today = new Date();
    const initialDay = {
      dateString: today.toISOString().split('T')[0],
      day: today.getDate(),
      month: today.getMonth() + 1,
      year: today.getFullYear(),
      timestamp: today.getTime(),
    };
    setSelectedDate(initialDay);
  }, []);

  useEffect(() => {
    if (!selectedDate) return;
    const date = `${selectedDate.year}-${selectedDate.month.toString().padStart(2, 0)}-${selectedDate.day.toString().padStart(2, 0)}`;
    fetchHistory(date);
  }, [selectedDate]);

  useEffect(() => {
    if (!selectedDate) return;
    fetchDistances();
  }, [selectedDate?.month]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>캘린더</Text>
      </View>
      <View style={styles.calendarCard}>
        <CalendarComponent
          setSelectedDate={setSelectedDate}
          selectedDate={selectedDate}
          distanceArray={distanceArray}
        />
      </View>
      <View style={styles.infoCard}>
        <InfoSection
          date={selectedDate?.dateString}
          history={historyData}
          onCardPress={(session) => {
            setSelectedSession(session);
            setModalVisible(true);
          }}
        />
      </View>
      <SessionModal visible={modalVisible} session={selectedSession} onClose={() => setModalVisible(false)} />
    </View>
  );
}

const Day = ({ date, distance, state, marking, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.dayContainer, marking && styles.markingContainer, state === 'disabled' && styles.dayDisabled]}
    >
      <Text style={[styles.dayText, state === 'disabled' && styles.dayTextDisabled]}>{date.day}</Text>
      <Text style={styles.dayDistance}>{parseFloat((distance ?? 0).toFixed(1)).toString()}km</Text>
    </TouchableOpacity>
  );
};

// 러닝 세션 카드 리스트/모달
function InfoSection({ date, history, onCardPress }) {
  if (!history)
    return (
      <View style={styles.infoEmpty}>
        <Text style={styles.infoEmptyText}>오늘의 기록이 없습니다</Text>
      </View>
    );
  return (
    <View>
      <Text style={styles.infoDate}>{date}</Text>
      <ScrollView horizontal contentContainerStyle={styles.sessionList} showsHorizontalScrollIndicator={false}>
        {history.runningSessionDTO?.map((session, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.sessionCard}
            activeOpacity={0.85}
            onPress={() => onCardPress(session)}
          >
            <Text style={styles.sessionLabel}>출발지</Text>
            <Text style={styles.sessionValue}>{session.runningSettingsResponse.startPoint ?? '-'}</Text>
            <Text style={styles.sessionLabel}>도착지</Text>
            <Text style={styles.sessionValue}>{session.runningSettingsResponse.endPoint ?? '-'}</Text>
            <Text style={styles.sessionLabel}>총 거리</Text>
            <Text style={styles.sessionValue}>{session.runningHistoryDTO.distance} km</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

// 모달 컴포넌트
function SessionModal({ visible, session, onClose }) {
  if (!session) return null;
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>러닝 상세 정보</Text>
          <Text style={styles.modalLabel}>
            출발지: <Text style={styles.modalValue}>{session.runningSettingsResponse.startPoint ?? '-'}</Text>
          </Text>
          <Text style={styles.modalLabel}>
            도착지: <Text style={styles.modalValue}>{session.runningSettingsResponse.endPoint ?? '-'}</Text>
          </Text>
          <Text style={styles.modalLabel}>
            총 거리: <Text style={styles.modalValue}>{session.runningHistoryDTO.distance} km</Text>
          </Text>
          <Text style={styles.modalLabel}>
            평균 페이스: <Text style={styles.modalValue}>{session.runningHistoryDTO.averagePace}</Text>
          </Text>
          <Text style={styles.modalLabel}>
            소요 시간: <Text style={styles.modalValue}>{session.runningHistoryDTO.duration} 분</Text>
          </Text>
          <Text style={styles.modalLabel}>
            정지 횟수: <Text style={styles.modalValue}>{session.runningHistoryDTO.stopCount}</Text>
          </Text>
          <Text style={styles.modalLabel}>
            집중 점수: <Text style={styles.modalValue}>{session.runningHistoryDTO.focusScore}</Text>
          </Text>
          <Text style={styles.modalLabel}>
            노력 레벨: <Text style={styles.modalValue}>{session.runningHistoryDTO.effortLevel}</Text>
          </Text>
          <Text style={styles.modalLabel}>
            완료 시간: <Text style={styles.modalValue}>{session.runningHistoryDTO.completedTime}</Text>
          </Text>
          <Text style={styles.modalLabel}>
            코멘트: <Text style={styles.modalValue}>{session.runningHistoryDTO.comment}</Text>
          </Text>
          <Text style={styles.modalLabel}>
            피드백 요약: <Text style={styles.modalValue}>{session.runningHistoryDTO.feedbackSummaryDTO.main}</Text>
          </Text>
          <Text style={styles.modalLabel}>
            피드백 조언: <Text style={styles.modalValue}>{session.runningHistoryDTO.feedbackSummaryDTO.advice}</Text>
          </Text>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>닫기</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

type CalendarProps = {
  selectedDate: any;
  distanceArray: number[];
  setSelectedDate: React.Dispatch<React.SetStateAction<string>>;
};

const CalendarComponent = ({ distanceArray, selectedDate, setSelectedDate }: CalendarProps) => {
  return (
    <Calendar
      style={styles.calendar}
      markedDates={{
        [selectedDate?.dateString]: {
          selected: true,
          marked: true,
          selectedColor: '#4A90E2',
        },
      }}
      hideExtraDays={false}
      monthFormat={'M월'}
      onMonthChange={() => {}}
      dayComponent={({ date, state, marking }) => (
        <Day
          date={date}
          distance={distanceArray?.[Number(date?.day) - 1]}
          state={state}
          marking={marking}
          onPress={() => setSelectedDate(date ?? '')}
        />
      )}
      renderArrow={(direction) =>
        direction === 'left' ? (
          <MaterialCommunityIcons name="arrow-left-drop-circle" size={30} color="#4A90E2" />
        ) : (
          <MaterialCommunityIcons name="arrow-right-drop-circle" size={30} color="#4A90E2" />
        )
      }
      theme={{
        backgroundColor: 'transparent',
        calendarBackground: 'transparent',
        textSectionTitleColor: '#4A90E2',
        selectedDayBackgroundColor: '#4A90E2',
        selectedDayTextColor: '#fff',
        todayTextColor: '#FF6347',
        dayTextColor: '#222',
        textDisabledColor: '#ccc',
        arrowColor: '#4A90E2',
        monthTextColor: '#222',
        textMonthFontWeight: 'bold',
        textMonthFontSize: 18,
        textDayFontWeight: '500',
        textDayFontSize: 16,
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E3F2FF',
    flex: 1,
    paddingTop: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 18,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    elevation: 2,
  },
  backButton: {
    paddingRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  calendarCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    marginHorizontal: 18,
    marginTop: 18,
    padding: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 8,
  },
  calendar: {
    backgroundColor: 'transparent',
    borderRadius: 18,
    padding: 0,
  },
  dayContainer: {
    aspectRatio: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(74,144,226,0.07)',
    borderColor: '#4A90E2',
    borderWidth: 0.5,
    width: 36,
    borderRadius: 10,
    margin: 1,
    padding: 0,
  },
  markingContainer: {
    backgroundColor: '#B3E5FC',
    borderWidth: 1.5,
    borderColor: '#4A90E2',
  },
  dayDisabled: {
    backgroundColor: '#F0F0F0',
    borderColor: '#E0E0E0',
  },
  dayText: {
    fontSize: 15,
    color: '#222',
    fontWeight: 'bold',
  },
  dayTextDisabled: {
    color: '#ccc',
    fontWeight: 'normal',
  },
  dayDistance: {
    fontSize: 10,
    color: '#4A90E2',
    marginTop: 2,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    marginHorizontal: 18,
    marginTop: 18,
    marginBottom: 18,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 8,
    minHeight: 120,
  },
  infoEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  infoEmptyText: {
    color: '#aaa',
    fontSize: 16,
    fontWeight: '600',
  },
  infoDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 10,
    marginLeft: 4,
  },
  sessionList: {
    flexDirection: 'row',
    paddingVertical: 8,
    gap: 10,
  },
  sessionCard: {
    backgroundColor: '#E3F2FF',
    borderRadius: 14,
    padding: 16,
    marginRight: 12,
    minWidth: 120,
    alignItems: 'flex-start',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  sessionLabel: {
    color: '#888',
    fontSize: 13,
    marginTop: 2,
  },
  sessionValue: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(30,30,30,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 24,
    width: '85%',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 14,
    alignSelf: 'center',
  },
  modalLabel: {
    fontSize: 15,
    color: '#333',
    marginTop: 4,
  },
  modalValue: {
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  closeButton: {
    marginTop: 18,
    alignSelf: 'center',
    backgroundColor: '#4A90E2',
    paddingHorizontal: 28,
    paddingVertical: 10,
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
