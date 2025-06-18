import axios from 'axios';

const GOOGLE_MAPS_API_KEY = 'AIzaSyDnZywd8LD9BjRGAycnOENixD8fyM_lnjE';

export const fetchRoutePolyline = async (start: string, end: string) => {
  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(
    start
  )}&destination=${encodeURIComponent(end)}&mode=walking&key=${GOOGLE_MAPS_API_KEY}`;
  const res = await axios.get(url);
  return res.data.routes?.[0]?.overview_polyline?.points;
};
