import axios from '@/api/axios';
import { RunMapSection } from '@/components/run-feedback';
import { FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';

import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  ImageSourcePropType,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface HistoryAnalysis {
  distanceDiff: number;
  totalDistance: number;
  runCount: number;
  avgSpeed: number;
  totalRunTime: number;
}
enum DateFormatter {
  default,
  korean,
}

const getColorByIndex = (idx: number): string => {
  const hue = (idx * 47) % 360; // 47은 소수로, idx가 커져도 색이 겹치지 않게 함
  return `hsl(${hue}, 80%, 50%)`; // 밝고 선명한 색상
};

const profileImg: ImageSourcePropType = {
  uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTML0gExaohZHdZW3609F12nUmVc14WXYNx_w&s',
};
const getDateFormat = (format: string, flag: DateFormatter) => {
  const today = new Date();

  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
  const dd = String(today.getDate()).padStart(2, '0');

  const koreanDays = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];

  if (flag === DateFormatter.korean) {
    const dayOfWeek = koreanDays[today.getDay()];
    return `${mm}월 ${dd}일 ${dayOfWeek}`;
  }

  if (format === 'year') return `${yyyy}`;
  if (format === 'month') return `${yyyy}-${mm}`;
  return `${yyyy}-${mm}-${dd}`;
};

const MyPage: React.FC = () => {
  const [profileData, setProfileData] = useState<any[] | null>(null);
  const [historyData, setHistoryData] = useState<any>(null);
  const [analysisData, setAnalysisData] = useState<HistoryAnalysis | null>(null);

  const fetchHistory = async () => {
    const todayFormat = getDateFormat('date', DateFormatter.default);

    try {
      const { data } = await axios.get(`api/history/daily?userId=${1}&date=${todayFormat}`);
      console.log(data.length);
      setHistoryData(data.runningSessionDTO);
      setAnalysisData(data);
      console.log(data.runningSessionDTO.length);
      console.log(data);
    } catch {}
  };

  const fetchProfile = async () => {
    try {
      const { data } = await axios.get(`api/profile`);
      setProfileData(data);
    } catch {}
  };

  useEffect(() => {
    fetchHistory();
    fetchProfile();
    console.log('fetch');
  }, []);
  const data = [
    {
      title: '총 거리',
      value: analysisData?.totalDistance.toFixed(2) ?? 0,
    },
    {
      title: '총 러닝 횟수',
      value: analysisData?.runCount ?? 0,
    },
    {
      title: '평균 페이스',
      value: analysisData?.avgSpeed.toFixed(2) ?? 0,
    },
    {
      title: '총 러닝 시간',
      value: analysisData?.totalRunTime ?? 0,
    },
  ];
  return (
    <ScrollView>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>나의 기록</Text>
      </View>
      <View style={styles.container}>
        {/* 프로필 영역 */}
        <View style={styles.profileSection}>
          <Image source={profileImg} style={styles.profileImg} />
          <View style={styles.profileInfo}>
            <Text style={styles.levelText}>{profileData?.runningType ?? '러닝 타입'}</Text>
            <Text style={styles.profileName}>{profileData?.nickName ?? '이름'}</Text>
            <Text style={styles.profileEmail}>{profileData?.name}</Text>
          </View>
        </View>

        {/* 오늘의 기록 */}
        <View style={styles.summarySection}>
          <Text style={styles.dateText}>{getDateFormat('day', DateFormatter.korean)}</Text>
          <View style={styles.distanceSection}>
            <View>
              <Text style={styles.defaultText}>오늘은</Text>
              <Text style={styles.distanceText}>{analysisData?.distanceDiff.toFixed(2) ?? 0}km</Text>
              <Text style={styles.defaultText}>달리셨네요</Text>
            </View>
            <View style={styles.increaseDistance}>
              <FontAwesome5 name="arrow-circle-up" size={24} color={'#0084FF'} />
              <Text style={styles.increateDistanceText}>{analysisData?.distanceDiff.toFixed(0) ?? 0}km</Text>
            </View>
          </View>
        </View>

        {/* 네비게이션 바 */}
        <View style={styles.navigationSection}>
          <TouchableOpacity onPress={() => router.push('/mypage/calendar')}>
            <Text style={styles.navigationText}>러닝 캘린더</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/mypage/summary')}>
            <Text style={styles.navigationText}>러닝 리포트</Text>
          </TouchableOpacity>
        </View>

        {/* 기록 섹션 */}
        <FlatList
          columnWrapperStyle={{
            justifyContent: 'space-between',
            marginBottom: 10,
          }}
          data={data}
          numColumns={2}
          renderItem={({ item }) => <HistoryItem title={item.title} value={item.value} />}
        />
        {historyData !== null && historyData.length > 0 && (
          <View style={styles.historyMap}>
            <RunMapSection
              paths={historyData?.map((history: any, index: number) => ({
                coordinates: history?.runningSettingsResponse.routePoints,
                color: getColorByIndex(index),
              }))}
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const HistoryItem = ({ title, value }: any) => {
  return (
    <View style={styles.historyInfo}>
      <Text style={styles.historycolumText}>{title}</Text>
      <Text style={styles.defaultText}>{value}</Text>
    </View>
  );
};

export default MyPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'column',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 25,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    width: '100%',
  },
  backButton: {
    paddingRight: 10,
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  profileSection: { width: '100%', alignItems: 'center', marginVertical: 18, flexDirection: 'row', gap: 30 },
  profileInfo: { flexDirection: 'column', gap: 5 },
  profileImg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
    backgroundColor: '#eee',
  },
  levelText: {
    color: 'white',
    paddingHorizontal: 10,
    paddingVertical: 2,
    backgroundColor: '#0084FF',
    fontSize: 13,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  profileName: { fontSize: 24, marginTop: 4, marginBottom: 2 },
  profileEmail: { fontSize: 10, color: '#C7C7CC' },
  summarySection: { flexDirection: 'column', gap: 20, width: '100%', paddingHorizontal: 10 },
  dateText: { color: '#0084FF', fontSize: 24 },
  distanceSection: { flexDirection: 'row', gap: 50 },
  defaultText: { fontSize: 24 },
  distanceText: { fontSize: 48, color: '#0084FF' },
  increaseDistance: { flexDirection: 'row', color: '#0084FF', gap: 4 },
  increateDistanceText: { fontSize: 20, color: '#0084FF' },
  navigationSection: {
    flexDirection: 'row',
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 10,
    borderColor: '#C7C7CC',
    gap: 60,
    paddingVertical: 22,
    width: '100%',
    justifyContent: 'center',
  },
  navigationText: { fontSize: 20 },
  historyInfo: {
    backgroundColor: '#E3F2FF',
    flexDirection: 'column',
    gap: 10,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingVertical: 14,
    borderRadius: 10,
    width: 150,
    margin: 10,
    marginTop: 0,
  },
  historycolumText: { fontSize: 14 },
  historyMap: { width: '100%', height: 200 },
});
