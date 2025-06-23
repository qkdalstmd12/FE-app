import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

// 기록 기반 통계 계산
const runningData = [100.6632089042602, 55.59746332254485];

const totalDistanceKm = runningData.reduce((sum, m) => sum + m / 1000, 0).toFixed(2);
const totalCalories = Math.round(Number(totalDistanceKm) * 60); // 1km당 60kcal 소모

export default function HeaderGreeting() {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Image source={require('../../assets/runner.png')} style={styles.image} resizeMode="contain" />
        <View style={{ marginLeft: 12 }}>
          <Text style={styles.greeting}>안녕하세요! 김민수님!</Text>
          <Text style={styles.sub}>오늘도 달릴 준비가 되셨나요?</Text>
        </View>
      </View>

      <View style={styles.statBox}>
        <Text style={styles.statText}>
          지금까지 <Text style={styles.highlight}>{totalDistanceKm}km</Text> 걸으셨고
        </Text>
        <Text style={styles.statText}>
          총 <Text style={styles.highlight}>{totalCalories}kcal</Text>를 소모하셨어요!
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
  },
  greeting: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  sub: {
    fontSize: 14,
    marginTop: 4,
  },
  statBox: {
    backgroundColor: '#f2f2f2',
    padding: 12,
    borderRadius: 10,
    marginTop: 16,
  },
  statText: {
    fontSize: 14,
    marginBottom: 4,
  },
  highlight: {
    color: '#00B894',
    fontWeight: 'bold',
  },
});
