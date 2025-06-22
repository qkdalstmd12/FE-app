import { Coordinate } from '@/types/run-feedback/types';
import React, { useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { LatLng, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import OptimizedPolyline from './Polyline';

interface RunMapSectionProps {
  paths: any;
  currentLocation?: Coordinate | null;
  MarkerVisible?: boolean;
  initzoom?: number;
}

const toLatLng = (coord: Coordinate): LatLng => ({
  latitude: coord.latitude,
  longitude: coord.longitude,
});

// 중심좌표(centroid) 계산 함수
const calculateCentroid = (coordinates: Coordinate[]): Coordinate => {
  if (!coordinates || coordinates.length === 0) {
    return { latitude: 37.78825, longitude: -122.4324 }; // fallback
  }
  const latSum = coordinates.reduce((sum, c) => sum + c.latitude, 0);
  const lonSum = coordinates.reduce((sum, c) => sum + c.longitude, 0);
  return {
    latitude: latSum / coordinates.length,
    longitude: lonSum / coordinates.length,
  };
};

const RunMapSection: React.FC<RunMapSectionProps> = ({
  paths,
  currentLocation = null,
  MarkerVisible = true,
  initzoom = 15,
}) => {
  const mapRef = useRef<MapView>(null);

  // 초기 region 계산 함수
  const getInitialRegion = () => {
    if (currentLocation) {
      return {
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
    }
    if (paths && paths.length > 0 && paths[0].coordinates && paths[0].coordinates.length > 0) {
      // const centroid = calculateCentroid(paths[0].coordinates);
      return {
        latitude: paths[0].coordinates[0].latitude,
        longitude: paths[0].coordinates[0].longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
    }
    // fallback
    return {
      latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
  };

  const recenterMap = () => {
    if (mapRef.current && currentLocation) {
      mapRef.current.animateToRegion(
        {
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        },
        500,
      );
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFill}
        initialRegion={getInitialRegion()}
        showsUserLocation={false}
        showsMyLocationButton={false}
        zoomEnabled
        scrollEnabled
      >
        {paths.map((path: any, idx: number) => (
          <OptimizedPolyline key={idx} coordinates={path.coordinates} color={path.color} dashed={path.dashed} />
        ))}
        {MarkerVisible && currentLocation && <Marker coordinate={toLatLng(currentLocation)} />}
      </MapView>
      {MarkerVisible && (
        <TouchableOpacity style={styles.button} onPress={recenterMap}>
          <Text style={styles.buttonText}>내 위치로 이동</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  button: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    zIndex: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    elevation: 2,
  },
  buttonText: { fontWeight: 'bold', fontSize: 14 },
});

export default RunMapSection;
