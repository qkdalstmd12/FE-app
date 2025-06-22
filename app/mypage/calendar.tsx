// import axios from '@/api/axios';
import axios from '@/api/axios';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';

LocaleConfig.locales['ko'] = {
  monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
  monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
  dayNames: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
  today: '오늘',
};

LocaleConfig.defaultLocale = 'ko';

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<any>(null);
  const [distanceArray, setDistanceArray] = useState<number[] | null>(null);
  const [historyData, setHistoryData] = useState<any>(null);
  const [modal, setModal] = useState<boolean>(false);
  const fetchDistances = async () => {
    const yearMonth = `${selectedDate.year}-${selectedDate.month.toString().padStart(2, 0)}`;
    try {
      console.log('호출', selectedDate.dateString);
      const { data } = await axios.get(`api/history/monthly-distances?yearMonth=${yearMonth}`);
      console.log(data);
      setDistanceArray(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchHistory = async (date) => {
    try {
      console.log(date);
      const { data } = await axios.get(`api/history/daily?date=${date}`);
      setHistoryData(data);
      console.log(data);
    } catch (error) {
      setHistoryData(null);
      console.log(error);
    }
  };
  useEffect(() => {
    const today = new Date();
    const initialDay = {
      dateString: today.toISOString().split('T')[0],
      day: today.getDate(),
      month: today.getMonth() + 1, // getMonth() is 0-based
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
      <CalendarComponent setSelectedDate={setSelectedDate} selectedDate={selectedDate} distanceArray={distanceArray} />
      <InfoSection date={selectedDate?.dateString} history={historyData} />
    </View>
  );
}

const Day = ({ date, distance, state, marking, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.dayContainer, marking && styles.markingContainer]}>
      <Text>{date.day}</Text>
      <Text>{parseFloat((distance ?? 0).toFixed(1)).toString()}km</Text>
    </TouchableOpacity>
  );
};

const InfoSection = ({ date, history }: any) => {
  if (!history)
    return (
      <View>
        <Text>오늘의 기록이 없습니다</Text>
      </View>
    );
  return (
    <View>
      <View>
        <Text>{date}</Text>
        <Text>{history?.totalDistance}</Text>
        <Text>{history?.runCount}</Text>
        <Text>{history?.avgSpeed}</Text>
        <Text>{history?.totalRunTime}</Text>
      </View>
    </View>
  );
};

type CalendarProps = {
  selectedDate: any;
  distanceArray: number[];
  setSelectedDate: React.Dispatch<React.SetStateAction<string>>;
};

const CalendarComponent = ({ distanceArray, selectedDate, setSelectedDate }: CalendarProps) => {
  return (
    <Calendar
      style={styles.calendar}
      // 캘린더 내 스타일 수정
      markedDates={{
        [selectedDate?.dateString]: {
          selected: true,
          marked: true,
          selectedColor: '#00adf5',
        },
      }}
      // 이전 달, 다음 달 날짜 숨기기
      hideExtraDays={false}
      // 달 포맷 지정
      monthFormat={'M월'}
      // 달이 바뀔 때 바뀐 달 출력
      onMonthChange={(month) => {
        console.log(month);
      }}
      dayComponent={({ date, state, marking }) => (
        <Day
          date={date}
          distance={distanceArray?.[Number(date?.day)]}
          state={state}
          marking={marking}
          onPress={() => setSelectedDate(date ?? '')}
        />
      )}
      // 달 이동 화살표 구현 왼쪽이면 왼쪽 화살표 이미지, 아니면 오른쪽 화살표 이미지
      renderArrow={(direction) => (direction === 'left' ? <Text>{'<-'}</Text> : <Text>{'->'}</Text>)}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  calendar: {
    width: '100%',
    alignSelf: 'center',
  },
  markingContainer: {
    backgroundColor: 'red',
  },
  dayContainer: {
    aspectRatio: 1, // 정사각형
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderColor: '#8239D0',
    borderWidth: 1,
    width: '95%',
    borderRadius: 10,
  },
  infoText: {
    color: 'black',
  },
});
