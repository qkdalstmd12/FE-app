import { PathPoint } from '@/store/run-feedback/useRunningStatusStore';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, {
  Circle,
  Region as MapRegion,
  Marker,
  Polyline,
} from 'react-native-maps';

interface MapViewComponentProps {
  path: PathPoint[];
  initialRegion?: PathPoint;
  showsUserLocation: boolean;
  currentLocation: PathPoint | null;
}

export default function MapViewComponent({
  path,
  initialRegion,
  showsUserLocation,
  currentLocation,
}: MapViewComponentProps) {
  const mapRef = useRef<MapView | null>(null);

  const [region, setRegion] = useState<MapRegion>({
    latitude: initialRegion?.lat ?? 37.78825,
    longitude: initialRegion?.lng ?? -122.4324,
    latitudeDelta: initialRegion?.lat ?? 0.005,
    longitudeDelta: initialRegion?.lng ?? 0.005,
  });

  useEffect(() => {
    if (initialRegion?.lat != null && initialRegion?.lng != null) {
      setRegion({
        latitude: initialRegion.lat,
        longitude: initialRegion.lng,
        latitudeDelta: initialRegion.lat ?? 0.005,
        longitudeDelta: initialRegion.lng ?? 0.005,
      });
    }
  }, [initialRegion]);

  const onMapReady = useCallback(() => {
    console.log('React Native MapView ready');
  }, []);

  useEffect(()=>{
    recenterMap();
  },[])



  const recenterMap = useCallback(() => {
    console.log('recenterMap called', currentLocation);
    if (!currentLocation) {
      console.warn(
        '현재 위치 데이터를 찾을 수 없어 지도를 이동할 수 없습니다.'
      );
      return;
    }

    if (mapRef.current) {
      console.log(
        'Map ref is valid. Animating to current location:',
        currentLocation
      );
      mapRef.current.animateToRegion(
        {
          latitude: currentLocation.lat,
          longitude: currentLocation.lng,
          latitudeDelta: 0.010,
          longitudeDelta: 0.010,
        },
        500
      );
    } else {
      console.warn('지도 인스턴스를 찾을 수 없습니다.');
    }
  }, [currentLocation]);

  // 시작점 아이콘 (빨간색 핀 모양으로 변경)
  const StartPointMarkerIcon = () => (
    <View style={styles.startPointPin}>
      <View style={styles.startPointPinHead} />
      <View style={styles.startPointPinTail} />
    </View>
  );

  // 도착점 아이콘 (도착 텍스트)
  const EndPointMarkerIcon = () => (
    <View style={styles.endPointMarker}>
      <Text style={styles.endPointText}>도착</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={Platform.OS === 'android' ? 'google' : undefined}
        region={region}
        showsUserLocation={false} // 사용자 위치 표시를 Marker와 Circle로 직접 구현
        followUserLocation={false} // 직접 구현하므로 false
        zoomEnabled={true}
        scrollEnabled={true}
        rotateEnabled={false}
        pitchEnabled={false}
        onMapReady={onMapReady}
      >
        {path && path.length > 0 && (
          <>
            {/* 조깅 경로 폴리라인 */}
            <Polyline
              coordinates={path.map((p: PathPoint) => ({
                latitude: p.lat,
                longitude: p.lng,
              }))}
              strokeColor='#39F' // 이미지와 유사한 파란색
              strokeWidth={4}
              lineDashPattern={[0]} // 점선 제거 (이미지에는 실선)
            />

            {/* 시작점 마커 */}
            {path[0] && (
              <Marker
                coordinate={{
                  latitude: path[0].lat,
                  longitude: path[0].lng,
                }}
                anchor={{ x: 0.5, y: 1 }} // 핀의 아래쪽이 지점과 일치하도록 조정
              >
                <StartPointMarkerIcon />
              </Marker>
            )}

            {/* 도착점 마커 */}
            {path.length > 1 && path[path.length - 1] && (
              <Marker
                coordinate={{
                  latitude: path[path.length - 1].lat,
                  longitude: path[path.length - 1].lng,
                }}
                anchor={{ x: 0.5, y: 0.5 }} // 마커 중앙 정렬
              >
                <EndPointMarkerIcon />
              </Marker>
            )}
          </>
        )}

        {/* 현재 위치 마커 및 정확도 반경 */}
        {currentLocation && ( 
          <>
            {/* 정확도 반경 (투명도 있는 파란색 원) */}
            <Circle
              center={{
                latitude: currentLocation.lat,
                longitude: currentLocation.lng,
              }}
              radius={100} // 예시 반경 (미터 단위). 이미지와 유사하게 조정 필요
              strokeWidth={1}
              strokeColor={'#0000FF'}
              fillColor={'rgba(0,0,255,0.1)'} // 이미지와 유사한 투명한 파란색
            />

            {/* 현재 위치를 나타내는 작은 파란색 점 */}
            <Marker
              coordinate={{
                latitude: currentLocation.lat,
                longitude: currentLocation.lng,

              }}

              
              anchor={{ x: 0.5, y: 0.5 }} // 마커 중앙 정렬
              
            >
              <View style={styles.currentLocationDot} />
            </Marker>
          </>
        )}
      </MapView>

      <TouchableOpacity onPress={recenterMap} style={styles.recenterButton}>
        <Text style={styles.recenterButtonText}>내 위치로 이동</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  recenterButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    zIndex: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#ffffff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  recenterButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  // 현재 위치를 나타내는 작은 파란색 점
  currentLocationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#007AFF', // 파란색
    borderColor: '#FFFFFF',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 3,
  },
  // 현재 위치 마커 스타일 (검은색 삼각형) - 파란색 점 위에 겹쳐지도록
  currentLocationTriangleContainer: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 8, // 삼각형 크기 조정
    borderRightWidth: 8,
    borderBottomWidth: 16, // 삼각형 크기 조정
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#000000',
    // transform: [{ rotate: '180deg' }], // 필요에 따라 방향 조정 (이미지는 위를 향함)
  },
  // 시작점 마커 스타일 (빨간색 핀 모양)
  startPointPin: {
    alignItems: 'center',
  },
  startPointPinHead: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'red', // 빨간색
    borderColor: 'white',
    borderWidth: 2,
  },
  startPointPinTail: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: 'red', // 핀과 같은 색상
    marginTop: -2, // 머리와 꼬리 연결
  },
  // 도착점 마커 스타일
  endPointMarker: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 5,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  endPointText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333333',
  },
  // 좌측 상단 컨트롤 버튼
  topLeftControls: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20, // iOS 노치 디자인 고려
    left: 20,
    zIndex: 10,
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  controlButton: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  controlButtonText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
  },
  // 우측 상단 "stop" 버튼
  stopButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20, // iOS 노치 디자인 고려
    right: 20,
    zIndex: 10,
    backgroundColor: 'red',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  stopButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
