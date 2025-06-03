// MapView.web.tsx
import { PathPoint } from '@/store/run-feedback/useRunningStatusStore';
import {
  GoogleMap,
  MarkerF,
  PolylineF,
  useLoadScript,
} from '@react-google-maps/api';

import React, { useCallback, useEffect, useRef, useState } from 'react';

const libraries: ('geometry' | 'drawing' | 'places' | 'visualization')[] = [
  'geometry', // 픽셀 <-> 미터 변환을 위해 'geometry' 라이브러리가 필요합니다.
];

const startPointIconSvg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Ccircle cx='10' cy='10' r='8' fill='#39F' stroke='%23ffffff' stroke-width='2' /%3E%3C/svg%3E`;
const currentPositionIconSvg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30'%3E%3Cpath d='M15 0 L0 30 L30 30 Z' fill='%23000000' transform='rotate(180 15 15)' /%3E%3C/svg%3E`;

const circleMarkerSvg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='12' r='10' fill='%230000FF' stroke='%230000FF' stroke-width='2' opacity='0.2'/%3E%3C/svg%3E`;

 
interface MapViewComponentProps { 
  path: PathPoint[];
  initialRegion: PathPoint | null;
  showsUserLocation: boolean;
  currentLocation: PathPoint | null;
}

export default function MapViewComponent({
  path,
  initialRegion,
  showsUserLocation,
  currentLocation,
}: MapViewComponentProps) {

  console.log("실행")
  // Google Maps API 로더

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyBdxKYNR_nT9lS75aRoVxMM9BQ_IBbG5eU',
    libraries,
  });

  // 맵 인스턴스를 저장할 ref
  const mapRef = useRef<google.maps.Map | null>(null);

  // 줌 레벨 상태
  const [zoom, setZoom] = useState(18);

  // 맵 중심 상태
  const [center, setCenter] = useState({
    lat: initialRegion?.lat ?? 37.78825,
    lng: initialRegion?.lng ?? -122.4324,
  });

  // initialRegion이 변경될 때 맵 중심과 줌 설정
  useEffect(() => {
    console.log(initialRegion);
    if (initialRegion?.lat != null && initialRegion?.lng != null) {
      setCenter({ lat: initialRegion.lat, lng: initialRegion.lng });
      setZoom(18);
    }
  }, [initialRegion]);

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    // 줌 변경 이벤트 리스너: 줌 변경 시 'zoom' 상태를 업데이트하여 userLocationRadius의 useMemo가 재계산되도록 함
    map.addListener('zoom_changed', () => {
      if (mapRef.current) {
        const currentZoom = mapRef.current.getZoom();
        setZoom(currentZoom !== undefined ? currentZoom : 15);
      }
    });
    console.log('GoogleMap loaded', map);
  }, []);

  const onUnmount = useCallback((map: google.maps.Map) => {
    mapRef.current = null;
    console.log('GoogleMap unmounted', map);
  }, []);

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
        'Map ref is valid. Panning to current location:',
        currentLocation
      );
      mapRef.current.panTo({
        lat: currentLocation.lat,
        lng: currentLocation.lng,
      });
      setZoom(18); // 현재 위치로 이동 시 줌 레벨 조정
    } else {
      console.warn('지도 인스턴스를 찾을 수 없습니다.');
    }
  }, [currentLocation]);

  if (loadError)
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#333',
          color: '#fff',
          fontSize: '18px',
        }}
      >
        지도 로딩 중 오류가 발생했습니다. (API 키, 네트워크 확인)
      </div>
    );
  if (!isLoaded)
  {
    console.log(currentLocation);
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#333',
          color: '#fff',
          fontSize: '18px',
        }}
      >
        지도 로딩 중... {isLoaded+"ff"+currentLocation?.lat}
      </div>
    );
  }


  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={center}
        zoom={zoom}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        {path && path.length > 0 && (
          <>
            {/* 조깅 경로 폴리라인 */}
            <PolylineF
              path={path.map((p: PathPoint) => ({
                lat: p.lat,
                lng: p.lng,
              }))}
              options={{
                strokeColor: '#39F',
                strokeOpacity: 1,
                strokeWeight: 4,
              }}
            />

            {/* 시작점 마커 (분홍색 원) */}
{currentLocation && (
  <MarkerF
    position={{
      lat: currentLocation.lat,
      lng: currentLocation.lng,
    }}
    icon={{
      url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZENDSbC029gMUhfP882LZVxJ2J-JPeEkkZw&s',
      scaledSize: new window.google.maps.Size(40, 40),
      anchor: new window.google.maps.Point(20, 20),
    }}
  />
)}
          </>
        )}

        {/* 현재 위치 마커 (검은색 삼각형) */}
        {showsUserLocation && currentLocation && (
          <>
            <MarkerF
              title='현재 위치 (원형)'
              position={{
                lat: currentLocation.lat,
                lng: currentLocation.lng,
              }}
              icon={{
                url: circleMarkerSvg,
                scaledSize: new window.google.maps.Size(250, 250),
                anchor: new window.google.maps.Point(125, 125),
              }}
            />
          </>
        )}
      </GoogleMap>

      {/* 내 위치로 이동 버튼 */}
      <button
        onClick={recenterMap}
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          zIndex: 10,
          padding: '10px 15px',
          backgroundColor: '#ffffff',
          border: '1px solid #ccc',
          borderRadius: '5px',
          cursor: 'pointer',
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
          fontSize: '14px',
          fontWeight: 'bold',
        }}
      >
        내 위치로 이동
      </button>
    </div>
  );
}
