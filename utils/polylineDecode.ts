import Polyline from '@mapbox/polyline';

export const decodePolyline = (encoded: string) =>
  Polyline.decode(encoded).map(([lat, lng]) => ({
    latitude: lat,
    longitude: lng,
  }));
