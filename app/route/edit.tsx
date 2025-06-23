import axios from '@/api/axios';
import { useRouteStore } from '@/store/routeStore';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';

export default function EditRouteScreen() {
  const { routeId } = useLocalSearchParams<{ routeId: string }>();

  const { selectNewRoute, todayRoutes } = useRouteStore();
  const [candidateRoutes, setCandidateRoutes] = useState<any[]>([]);

  useEffect(() => {
    const loadCandidateRoutes = async () => {
      try {
        const res = await axios.get('/api/route/fixed/recommended', {
          params: {
            user_id: 'user_123',
            fixed_route_id: routeId,
          },
        });

        console.log('🟢 추천 경로 응답:', res.data);

        const routeList = Array.isArray(res.data) ? res.data : (res.data?.[routeId] ?? []);

        if (!Array.isArray(routeList)) {
          throw new Error('후보 경로 없음 또는 데이터 형식 오류');
        }

        const mapped = routeList.map((r: any, idx: number) => ({
          id: r.route_id ?? idx,
          name: r.custom_name ?? `후보 루트 ${idx + 1}`,
          duration: r.duration ?? r.recommend?.expected_time ?? 0,
          coordinates: Array.isArray(r.coordinates)
            ? r.coordinates
            : Array.isArray(r.coord)
              ? r.coord
                  .map((point: any) => {
                    if (Array.isArray(point)) {
                      const [lat, lng] = point;
                      return { latitude: lat, longitude: lng };
                    } else if (point.latitude && point.longitude) {
                      return { latitude: point.latitude, longitude: point.longitude };
                    } else {
                      return null;
                    }
                  })
                  .filter(Boolean)
              : [],

          feature: r.feature ?? {
            park: { count: 0 },
            river: { count: 0 },
            amenity: { count: 0 },
            cross: { count: 0 },
          },
        }));

        setCandidateRoutes(mapped);
      } catch (err) {
        console.error('추천 경로 불러오기 실패:', err);
        Alert.alert('오류', '추천 경로를 불러오지 못했습니다.');
      }
    };

    if (routeId) {
      loadCandidateRoutes();
    }
  }, [routeId]);

  const handleSelect = async (newRouteId: number) => {
    const oldRoute = todayRoutes.find((r) => r.id === Number(routeId));
    const newRoute = candidateRoutes.find((r) => r.id === newRouteId);

    if (!newRoute || !oldRoute) return;

    try {
      await axios.post('/api/route/save', null, {
        params: {
          user_id: 'user_123',
          route_id: newRouteId,
          custom_name: oldRoute.name,
        },
      });

      selectNewRoute(Number(routeId), newRoute);
      Alert.alert('수정 완료', '경로가 성공적으로 변경되었습니다!');
      router.back();
    } catch (error) {
      console.error('경로 저장 실패:', error);
      Alert.alert('오류', '경로 저장에 실패했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>추천 경로 목록</Text>
      <FlatList
        data={candidateRoutes}
        keyExtractor={(item) => item?.id?.toString() ?? Math.random().toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => handleSelect(item.id)}>
            <Text style={styles.routeName}>{item.name}</Text>
            <Text style={styles.routeTime}>{item.duration}분 소요</Text>

            {item.coordinates.length > 0 && (
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: item.coordinates[0].latitude,
                  longitude: item.coordinates[0].longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                scrollEnabled={false}
                zoomEnabled={false}
              >
                <Polyline coordinates={item.coordinates} strokeColor="#3B82F6" strokeWidth={4} />
                <Marker coordinate={item.coordinates[0]} title="출발" />
                <Marker coordinate={item.coordinates[item.coordinates.length - 1]} title="도착" />
              </MapView>
            )}

            {/* Feature Info */}
            <View style={styles.featureBox}>
              <Text> 공원: {item.feature?.park?.count ?? 0}</Text>
              <Text> 하천: {item.feature?.river?.count ?? 0}</Text>
              <Text> 편의시설: {item.feature?.amenity?.count ?? 0}</Text>
              <Text> 횡단보도: {item.feature?.cross?.count ?? 0}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={{ color: '#666' }}>추천 경로가 없습니다.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  item: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
  },
  routeName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  routeTime: {
    color: '#666',
    marginBottom: 8,
  },
  map: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
  featureBox: {
    marginTop: 8,
    gap: 2,
  },
});
