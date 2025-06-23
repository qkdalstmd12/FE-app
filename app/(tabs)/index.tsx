import axios from '@/api/axios';
import { RouteCard } from '@/components/route/RouteCard';
import { useRouteStore } from '@/store/routeStore';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
export default function MainScreen() {
  const { todayRoutes, deleteRoute, setTodayRoutes } = useRouteStore();

  useEffect(() => {
    const loadRoutes = async () => {
      try {
        const res = await axios.get('/api/route/routes-list', {});

        console.log('[오늘의 루트 응답]', res.data);

        const mappedRoutes = res.data.map((r: any, idx: number) => ({
          id: r.route_id ?? idx,
          name: `${r?.startPoint ?? '출발지'} → ${r?.endPoint ?? '도착지'}`,
          duration: r.selected_path?.recommend?.expected_time ?? 0,
          coordinates: (r.selected_path?.coord ?? []).map(([latitude, longitude]: [number, number]) => ({
            latitude,
            longitude,
          })),
          feature: r.selected_path?.feature ?? {
            park: { count: 0 },
            river: { count: 0 },
            amenity: { count: 0 },
            cross: { count: 0 },
          },
        }));

        setTodayRoutes(mappedRoutes);
      } catch (err) {
        console.error('루트 불러오기 실패:', err);
      }
    };

    loadRoutes();
  }, []);

  const handleEdit = (routeId: number) => {
    router.push(`/route/edit?routeId=${routeId}`);
  };

  const handleDelete = (routeId: number) => {
    Alert.alert('삭제 확인', '이 경로를 삭제할까요?', [
      { text: '취소' },
      { text: '삭제', onPress: () => deleteRoute(routeId) },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>오늘의 러닝</Text>

      {todayRoutes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>오늘의 러닝이 없어요!</Text>
          <TouchableOpacity onPress={() => router.push('/route/add')} style={styles.button}>
            <Text style={styles.buttonText}>경로 추천받기</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={todayRoutes}
            keyExtractor={(item, index) => item?.id?.toString?.() ?? index.toString()}
            renderItem={({ item }) =>
              item?.id ? (
                <RouteCard route={item} onEdit={() => handleEdit(item.id)} onDelete={() => handleDelete(item.id)} />
              ) : null
            }
          />
          <TouchableOpacity style={styles.addButton} onPress={() => router.push('/route/add')}>
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
  summaryButton: {
    marginTop: 16,
    backgroundColor: '#3B82F6',
    padding: 12,
    borderRadius: 8,
  },
  summaryButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
