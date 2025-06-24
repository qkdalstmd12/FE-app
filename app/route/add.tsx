import axios from '@/api/axios';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';

const GOOGLE_MAPS_API_KEY = 'AIzaSyDnZywd8LD9BjRGAycnOENixD8fyM_lnjE';

export default function AddRouteScreen() {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [startSuggestions, setStartSuggestions] = useState<string[]>([]);
  const [endSuggestions, setEndSuggestions] = useState<string[]>([]);
  const [loop, setLoop] = useState(true);
  const [publicTransport, setPublicTransport] = useState(true);
  const [flatPath, setFlatPath] = useState(true);
  const [notCrowded, setNotCrowded] = useState(true);
  const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number }[]>([]);
  const [duration, setDuration] = useState<number | null>(null);
  const [region, setRegion] = useState({
    latitude: 35.0,
    longitude: 128.0,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const geocodeAddress = async (address: string): Promise<{ lat: number; lng: number }> => {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`;
    const res = await axios.get(url);
    const loc = res.data.results?.[0]?.geometry?.location;
    if (!loc) throw new Error('지오코딩 실패');
    return { lat: loc.lat, lng: loc.lng };
  };

  const fetchSuggestions = async (input: string, setter: (s: string[]) => void) => {
    if (!input) return setter([]);
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${GOOGLE_MAPS_API_KEY}`;
    try {
      const res = await axios.get(url);
      const suggestions = res.data.predictions.map((p: any) => p.description);
      setter(suggestions);
    } catch (e) {
      console.error('자동완성 실패', e);
    }
  };

  const handleStart = async () => {
    if (!start) return Alert.alert('출발지를 입력해주세요');

    try {
      const start_point = await geocodeAddress(start);
      const end_point = end ? await geocodeAddress(end) : undefined;

      const preferences = {
        cycle: loop,
        park_ratio_preference: flatPath ? 1.0 : 0.5,
        usePublicTransport: publicTransport,
        avoidCrowdedAreas: notCrowded,
      };

      const environment = {
        temperature: 20,
        humidity: 50,
        weather: 'cloudy',
      };

      const payload = end_point
        ? { start_point, end_point, ...preferences, environment, run_ratio: 1.0, user_running_history: [] }
        : { start_point, preferences, environment, run_ratio: 1.0 };

      const response = await axios.post('/api/routes-create', payload);

      const { duration: d, coordinates: rawCoords } = response.data;
      const routeCoords = rawCoords?.map((c: any) => ({
        latitude: c.lat ?? c.latitude,
        longitude: c.lng ?? c.longitude,
      }));

      if (!routeCoords || !Array.isArray(routeCoords)) return Alert.alert('경로 정보가 없습니다.');

      setCoordinates(routeCoords);
      setDuration(d ?? null);
      setRegion({
        latitude: routeCoords[0].latitude,
        longitude: routeCoords[0].longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });

      Alert.alert('추천된 경로가 지도에 표시되었습니다!');
    } catch (error) {
      console.error(error);
      Alert.alert('경로 추천에 실패했습니다');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>경로 추가</Text>
      </View>
      <MapView style={styles.map} region={region}>
        {coordinates.length > 0 && (
          <>
            <Polyline coordinates={coordinates} strokeColor="#3B82F6" strokeWidth={4} />
            <Marker coordinate={coordinates[0]} title="출발지" />
            <Marker coordinate={coordinates[coordinates.length - 1]} title="도착지" />
          </>
        )}
      </MapView>

      <View style={styles.form}>
        <TextInput
          placeholder="출발지점"
          value={start}
          onChangeText={(text) => {
            setStart(text);
            fetchSuggestions(text, setStartSuggestions);
          }}
          style={styles.input}
        />
        {startSuggestions.map((s, idx) => (
          <TouchableWithoutFeedback
            key={idx}
            onPress={async () => {
              setStart(s);
              setStartSuggestions([]);
              const { lat, lng } = await geocodeAddress(s);
              setRegion({ latitude: lat, longitude: lng, latitudeDelta: 0.01, longitudeDelta: 0.01 });
            }}
          >
            <Text style={styles.suggestion}>{s}</Text>
          </TouchableWithoutFeedback>
        ))}

        <TextInput
          placeholder="목적지점 (비우면 자유 러닝)"
          value={end}
          onChangeText={(text) => {
            setEnd(text);
            fetchSuggestions(text, setEndSuggestions);
          }}
          style={styles.input}
        />
        {endSuggestions.map((s, idx) => (
          <TouchableWithoutFeedback
            key={idx}
            onPress={() => {
              setEnd(s);
              setEndSuggestions([]);
            }}
          >
            <Text style={styles.suggestion}>{s}</Text>
          </TouchableWithoutFeedback>
        ))}

        <TouchableOpacity style={styles.submitButton} onPress={handleStart}>
          <Text style={styles.submitButtonText}>경로 추천 시작</Text>
        </TouchableOpacity>

        {duration !== null && (
          <Text style={{ textAlign: 'center', fontSize: 16, marginTop: 10 }}>⏱ 예상 소요 시간: {duration}분</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  backButton: { paddingRight: 10 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  map: { height: 200, width: '100%' },
  form: { padding: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 8,
  },
  suggestion: {
    padding: 10,
    backgroundColor: '#f2f2f2',
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  submitButton: {
    backgroundColor: '#3B82F6',
    padding: 14,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
  },
  submitButtonText: { color: '#fff', fontSize: 16 },
});
