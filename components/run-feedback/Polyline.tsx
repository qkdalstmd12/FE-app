import { Coordinate } from '@/types/run-feedback/types';
import React from 'react';
import { LatLng, Polygon } from 'react-native-maps';

function hasAllKeys(obj: any, keys: string[]) {
  return keys.every((key) => obj && Object.prototype.hasOwnProperty.call(obj, key));
}
function findObjectWithKeys(obj: any, keySet: string[]): any | null {
  function search(current: any): any | null {
    if (typeof current !== 'object' || current === null) return null;
    if (hasAllKeys(current, keySet)) return current;
    for (const key in current) {
      const result = search(current[key]);
      if (result) return result;
    }
    return null;
  }
  return search(obj);
}

interface OptimizedPolylineProps {
  coordinates: Coordinate[];
  color: string;
  dashed?: boolean;
}

const OptimizedPolyline: React.FC<OptimizedPolylineProps> = React.memo(function OptimizedPolyline({
  coordinates,
  color,
  dashed,
}) {
  // 타입 가드로 null 완전 제거
  const validLatLngs: LatLng[] = coordinates
    .map((coord) => {
      const location = findObjectWithKeys(coord, ['latitude', 'longitude']);
      if (!location) return undefined;
      return location;
    })
    .filter((v): v is LatLng => !!v); 

  if (validLatLngs.length < 2) return null; // 최소 2점 필요

  return (
    <Polygon
      coordinates={validLatLngs}
      strokeColor={'red'}
      strokeWidth={4}
      lineDashPattern={dashed ? [10, 10] : undefined}
    />
  );
});
OptimizedPolyline.displayName = 'OptimizedPolyline';

export default OptimizedPolyline;
