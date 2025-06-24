import axios from '@/api/axios';
import { useRouteStore } from '@/store/routeStore';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';

export default function EditRouteScreen() {
  const { routeId } = useLocalSearchParams<{ routeId: string }>();

  const { selectNewRoute, todayRoutes } = useRouteStore();
  const [candidateRoutes, setCandidateRoutes] = useState<any[]>([]);
  const [selectedPath, setSelectedPath] = useState<number | null>(null);

  useEffect(() => {
    const loadCandidateRoutes = async () => {
      try {
        const res = await axios.get(`/api/routes-one/${routeId}`, {});
        const data = res?.data?.data;
        const routeList = data.paths;

        const mapped = routeList.map((r: any, idx: number) => ({
          id: r.route_id ?? r.pathId ?? idx,
          name: r.custom_name ?? `후보 루트 ${idx + 1}`,
          duration: r.duration ?? r.recommend?.expected_time ?? 0,
          coordinates: Array.isArray(r.coordinates)
            ? r.coordinates
            : Array.isArray(r.coord)
              ? r.coord
                  .map((point) => {
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
          feature: r.feture ?? {
            park: { count: 0 },
            river: { count: 0 },
            amenity: { count: 0 },
            cross: { count: 0 },
          },
        }));

        setCandidateRoutes(mapped);
        setSelectedPath(data.selectedPath);
      } catch (err) {
        console.error('추천 경로 불러오기 실패:', err);
        Alert.alert('오류', '추천 경로를 불러오지 못했습니다.');
      }
    };

    if (routeId) {
      loadCandidateRoutes();
    }
  }, [routeId]);

  const handleSelect = async (pathId: any) => {
    if (pathId == undefined) return;
    try {
      console.log(`/api/${routeId}/select-path/${pathId}`);
      await axios.patch(`/api/${routeId}/select-path/${pathId}`);
      console.log('수정 완료');
      Alert.alert('수정 완료', '경로가 성공적으로 변경되었습니다!');
      router.back();
    } catch (error) {
      console.error('경로 저장 실패:', error);
      Alert.alert('오류', '경로 저장에 실패했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>경로 추가</Text>
      </View>
      <FlatList
        data={candidateRoutes}
        keyExtractor={(item) => item?.id?.toString() ?? Math.random().toString()}
        renderItem={({ item }) => {
          const isSelected = item.id === selectedPath;
          return (
            <TouchableOpacity
              style={[
                styles.item,
                isSelected && styles.selectedItem, // 선택된 경로 스타일 적용
              ]}
              onPress={() => handleSelect(item.id)}
              activeOpacity={isSelected ? 1 : 0.7} // 선택된 경로는 클릭 비활성화
              disabled={isSelected} // 선택된 경로는 클릭 불가
            >
              <View style={styles.routeHeader}>
                <Text style={[styles.routeName, isSelected && styles.selectedRouteName]}>
                  {isSelected ? '선택된 경로' : item.name}
                </Text>
                {isSelected && <Ionicons name="checkmark-circle" size={20} color="#2563eb" style={{ marginLeft: 6 }} />}
              </View>
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
                <Text> 공원: {item.feature?.park?.count ?? 0}개</Text>
                <Text> 하천: {item.feature?.river?.count ?? 0}개</Text>
                <Text> 편의시설: {item.feature?.amenity?.count ?? 0}개</Text>
                <Text> 횡단보도: {item.feature?.cross?.count ?? 0}개</Text>
              </View>
            </TouchableOpacity>
          );
        }}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  backButton: { paddingRight: 10 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
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
