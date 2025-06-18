import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import HeaderGreeting from '../components/Greeting';
import { RouteCard } from '../components/RouteCard';
import { useRouteStore } from '../store/routeStore';
import { RootStackParamList } from '../navigation/AppNavigator';
import axios from 'axios';

type MainScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MainScreen'>;

export default function MainScreen() {
  const navigation = useNavigation<MainScreenNavigationProp>();
  const { todayRoutes, deleteRoute, setTodayRoutes } = useRouteStore();

  //오늘의 루트 불러오기
  useEffect(() => {
    const loadRoutes = async () => {
      try {
        const res = await axios.get( 'http://192.168.0.6:3658/m1/943861-927263-default/api/route/fixed',
  { params: { user_id: '123' } }
);
        console.log('[오늘의 루트 응답]', res.data);
        console.log('응답 원본:', JSON.stringify(res.data, null, 2));

        const mappedRoutes = res.data.map((r: any, idx: number) => ({
          id: r.route_id ?? r.id ?? idx,
          name: r.custom_name ?? r.name ?? `루트${idx + 1}`,
          duration: r.duration ?? r.time ?? 0,
          coordinates: r.coordinates ?? [],
        }));

        setTodayRoutes(mappedRoutes);
      } catch (err) {
        console.error('루트 불러오기 실패:', err);
      }
    };

    loadRoutes();
  }, []);

  const handleEdit = (routeId: number) => {
    navigation.navigate('EditRouteScreen', { routeId });
  };

  const handleDelete = (routeId: number) => {
    Alert.alert('삭제 확인', '이 경로를 삭제할까요?', [
      { text: '취소' },
      { text: '삭제', onPress: () => deleteRoute(routeId) },
    ]);
  };

  return (
    <View style={styles.container}>
      <HeaderGreeting />
      <Text style={styles.title}>오늘의 러닝</Text>

      {todayRoutes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>오늘의 러닝이 없어요!</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('AddRouteScreen')}
            style={styles.button}
          >
            <Text style={styles.buttonText}>경로 추천받기</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {console.log('todayRoutes:', todayRoutes)}

          <FlatList
            data={todayRoutes}
            keyExtractor={(item, index) =>
              item?.id?.toString?.() ?? index.toString()
            }
            renderItem={({ item }) =>
              item?.id ? (
                <RouteCard
                  route={item}
                  onEdit={() => handleEdit(item.id)}
                  onDelete={() => handleDelete(item.id)}
                />
              ) : null
            }
          />

          {/*통계 보기 버튼 */}
          <TouchableOpacity
            style={{
              marginTop: 16,
              backgroundColor: '#3B82F6',
              padding: 12,
              borderRadius: 8,
            }}
            onPress={() => navigation.navigate('RunningSummaryScreen')}
          >
            <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>
              통계 보기
            </Text>
          </TouchableOpacity>

          {/*러닝 경로 추가 버튼 */}
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('AddRouteScreen')}
          >
            <Text style={styles.addButtonText}>러닝 경로 추가</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    marginBottom: 16,
    color: '#666',
  },
  button: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
  },
  addButton: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
