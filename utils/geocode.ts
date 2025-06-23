import axios from 'axios';

const GOOGLE_MAPS_API_KEY = 'AIzaSyDnZywd8LD9BjRGAycnOENixD8fyM_lnjE';

export const geocodeAddress = async (address: string) => {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address,
  )}&key=${GOOGLE_MAPS_API_KEY}`;
  const res = await axios.get(url);
  const loc = res.data.results?.[0]?.geometry?.location;
  if (!loc) throw new Error('좌표 변환 실패');
  return { lat: loc.lat, lng: loc.lng };
};
