import axios from 'axios';
import { decodePolyline } from './polylineDecode';

export const fetchRouteFromGoogle = async (start: { lat: number; lng: number }, end: { lat: number; lng: number }) => {
  const API_KEY = 'AIzaSyDnZywd8LD9BjRGAycnOENixD8fyM_lnjE';

  const res = await axios.get('https://maps.googleapis.com/maps/api/directions/json', {
    params: {
      origin: `${start.lat},${start.lng}`,
      destination: `${end.lat},${end.lng}`,
      mode: 'walking',
      key: API_KEY,
    },
  });

  const encoded = res.data.routes?.[0]?.overview_polyline?.points;
  if (!encoded) return [];

  return decodePolyline(encoded);
};
