import { getRoutineList } from '@/api/user/routine';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// 장소별 색상 매핑
const colorMap = {
  COMPANY: '#FFD600',
  GYM: '#00C853',
  default: '#40C4FF',
};

function RoutineCard({ routine }) {
  const color = colorMap[routine.place] || colorMap.default;
  return (
    <View style={[styles.card, { borderLeftColor: color }]}>
      <View style={styles.content}>
        <Text style={styles.days}>{routine.day.join(', ')}</Text>
        <Text style={styles.time}>시간: {routine.time}</Text>
        <Text style={styles.place}>장소: {routine.place}</Text>
        <Text style={styles.destination}>
          {routine.destination !== 'string' ? `목적지: ${routine.destination}` : '목적지 정보 없음'}
        </Text>
      </View>
      <TouchableOpacity onPress={() => router.push(`/route/add?routineId=${routine.routineId}`)}>
        <Text>경로 추가</Text>
      </TouchableOpacity>
    </View>
  );
}

function getTodayString() {
  const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  const today = new Date();
  return days[today.getDay()];
}

export default function RoutineListScreen() {
  const [routineData, setRoutineData] = useState<any>(null);
  const fetchRoutine = async () => {
    const todayString = getTodayString();
    try {
      const data = await getRoutineList();
      const filteredData = routineData.filter((routine: { day: string | string[] }) =>
        routine.day.includes(todayString),
      );
      setRoutineData(data);
      console.log(data);
      console.log(data);
    } catch (error) {
      setRoutineData([]);
    }
  };
  useEffect(() => {
    fetchRoutine();
  }, []);
  return (
    <View style={styles.container}>
      <Text style={styles.header}>오늘의 루틴</Text>
      <View>
        <Text>전체</Text>
      </View>
      <FlatList
        data={routineData}
        keyExtractor={(item) => item.routineId.toString()}
        renderItem={({ item }) => <RoutineCard routine={item} />}
        contentContainerStyle={{ paddingBottom: 32 }}
      />
      <TouchableOpacity>
        <Text>루틴 추가</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    marginBottom: 14,
    padding: 20,
    paddingRight: 50,
    borderLeftWidth: 8,
    elevation: 2,
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  content: {
    marginLeft: 4,
  },
  days: {
    color: '#FF7A7A',
    fontWeight: 'bold',
    marginBottom: 3,
  },
  time: {
    color: '#666',
    marginBottom: 3,
  },
  place: {
    fontWeight: 'bold',
    marginBottom: 3,
  },
  destination: {
    color: '#aaa',
  },
});
