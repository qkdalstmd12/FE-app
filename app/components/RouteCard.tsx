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
import axios from 'axios';

type RouteCardProps = {
  route: {
    id: number;
    name: string;
    duration: number;
    coordinates?: { latitude: number; longitude: number }[];
    start_point?: { lat: number; lng: number };
    end_point?: { lat: number; lng: number };
  };
  onEdit: () => void;
  onDelete: () => void;
};

export const RouteCard = ({ route, onEdit, onDelete }: RouteCardProps) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number }[]>([]);

  useEffect(() => {
    const fetchRoute = async () => {
      if (!route.start_point || !route.end_point) return;

      try {
        const res = await axios.get(
          `https://maps.googleapis.com/maps/api/directions/json?origin=${route.start_point.lat},${route.start_point.lng}&destination=${route.end_point.lat},${route.end_point.lng}&mode=walking&key=AIzaSyDnZywd8LD9BjRGAycnOENixD8fyM_lnjE`
        );

        const encoded = res.data.routes?.[0]?.overview_polyline?.points;
        if (encoded) {
          const decoded = decodePolyline(encoded);
          setCoordinates(decoded);
        }
      } catch (err) {
        console.error('Google Maps Directions API 호출 실패:', err);
      }
    };

    fetchRoute();
  }, [route]);

  return (
    <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
      <View style={styles.card}>
        <Pressable style={styles.menuButton} onPress={() => setMenuVisible(true)}>
          <Entypo name="dots-three-vertical" size={16} color="gray" />
        </Pressable>

        <View style={styles.textColumn}>
          <Text style={styles.name}>{route.name}</Text>
          <Text style={styles.duration}>{route.duration}분 러닝</Text>
        </View>

        {/* 지도 미리보기 */}
        <View style={styles.mapPreview}>
          <MapView
            style={{ width: 160, height: 160 }}
            scrollEnabled={true}
            zoomEnabled={true}      
            pitchEnabled={false}    
            rotateEnabled={false}
            initialRegion={{
        latitude: route.coordinates?.[0]?.latitude || 37.5665,
        longitude: route.coordinates?.[0]?.longitude || 126.9780,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
  }}
>
  {route.coordinates && (
    <>
      <Polyline
        coordinates={route.coordinates}
        strokeColor="#3B82F6"
        strokeWidth={3}
      />
      <Marker coordinate={route.coordinates[0]} />
    </>
  )}
</MapView>

        </View>

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


function decodePolyline(encoded: string) {
  let points: { latitude: number; longitude: number }[] = [];
  let index = 0, lat = 0, lng = 0;

  while (index < encoded.length) {
    let b, shift = 0, result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    let dlat = (result & 1) ? ~(result >> 1) : result >> 1;
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    let dlng = (result & 1) ? ~(result >> 1) : result >> 1;
    lng += dlng;

    points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
  }

  return points;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
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
  },
  mapPreview: {
    width: 160,
    height: 160,
    marginHorizontal: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  startButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginTop: 100,
  },
  startButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
