import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  TouchableWithoutFeedback,
} from 'react-native';
import { Entypo } from '@expo/vector-icons';
import MapView, { Polyline, Marker } from 'react-native-maps';
import { fetchRouteFromGoogle } from '../utils/googleDirections';


type RouteCardProps = {
  route: {
    id: number;
    name: string;
    duration: number;
    coordinates?: { latitude: number; longitude: number }[];
    start_point?: { lat: number; lng: number };
    end_point?: { lat: number; lng: number };
    feature?: {
      park?: { count: number };
      river?: { count: number };
      amenity?: { count: number };
      cross?: { count: number };
    };
  };
  onEdit: () => void;
  onDelete: () => void;
};

export const RouteCard = ({ route, onEdit, onDelete }: RouteCardProps) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [pathCoords, setPathCoords] = useState(route.coordinates ?? []);

  const feature = route.feature ?? {
    park: { count: 0 },
    river: { count: 0 },
    amenity: { count: 0 },
    cross: { count: 0 },
  };

  useEffect(() => {
    const fetchPath = async () => {
      if (!route.coordinates && route.start_point && route.end_point) {
        const coords = await fetchRouteFromGoogle(route.start_point, route.end_point);
        setPathCoords(coords);
      }
    };
    if (showMap) fetchPath();
  }, [showMap]);

  return (
    <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
      <View style={styles.card}>
        <Pressable style={styles.menuButton} onPress={() => setMenuVisible(true)}>
          <Entypo name="dots-three-vertical" size={16} color="gray" />
        </Pressable>

        <View style={styles.textColumn}>
          <Text style={styles.name}>{route.name}</Text>
          <Text style={styles.duration}>{route.duration}분 러닝</Text>

          <View style={styles.featureBox}>
            <Text> 공원: {feature.park?.count ?? 0}</Text>
            <Text> 하천: {feature.river?.count ?? 0}</Text>
            <Text> 편의시설: {feature.amenity?.count ?? 0}</Text>
            <Text> 횡단보도: {feature.cross?.count ?? 0}</Text>
          </View>

          <TouchableOpacity style={styles.mapToggleButton} onPress={() => setShowMap(!showMap)}>
            <Text style={styles.mapToggleText}>{showMap ? '지도 숨기기' : '지도 보기'}</Text>
          </TouchableOpacity>
        </View>

        {showMap && pathCoords.length > 0 && (
          <View style={styles.mapPreview}>
            <MapView
              style={styles.map}
              scrollEnabled={true}
              zoomEnabled={true}
              pitchEnabled={false}
              rotateEnabled={false}
              initialRegion={{
                latitude: pathCoords[0]?.latitude || 37.5665,
                longitude: pathCoords[0]?.longitude || 126.9780,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Polyline coordinates={pathCoords} strokeColor="#3B82F6" strokeWidth={3} />
              <Marker coordinate={pathCoords[0]} />
              <Marker coordinate={pathCoords[pathCoords.length - 1]} />
            </MapView>
          </View>
        )}

        <TouchableOpacity style={styles.startButton}>
          <Text style={styles.startButtonText}>경로 시작</Text>
        </TouchableOpacity>

        {menuVisible && (
          <TouchableWithoutFeedback>
            <View style={styles.menuBox}>
              <TouchableOpacity onPress={() => { setMenuVisible(false); onEdit(); }}>
                <Text style={styles.menuItem}>수정</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { setMenuVisible(false); onDelete(); }}>
                <Text style={[styles.menuItem, { color: '#EF4444' }]}>삭제</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'column',
    position: 'relative',
    borderWidth: 1.5,
    borderColor: '#ccc',
  },
  menuButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 8,
  },
  menuBox: {
    position: 'absolute',
    paddingHorizontal: 20,
    top: 36,
    right: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 8,
    zIndex: 10,
  },
  menuItem: {
    paddingVertical: 6,
    fontSize: 16,
  },
  textColumn: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  duration: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 4,
  },
  featureBox: {
    marginTop: 8,
    gap: 2,
  },
  mapToggleButton: {
    marginTop: 10,
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#eee',
    borderRadius: 6,
  },
  mapToggleText: {
    color: '#333',
    fontSize: 14,
  },
  mapPreview: {
    width: '100%',
    height: 200,
    marginTop: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  startButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginTop: 16,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
