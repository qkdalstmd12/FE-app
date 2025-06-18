import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Switch, StyleSheet, Alert, FlatList, TouchableWithoutFeedback } from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';
import axios from 'axios';
import { useRouteStore } from '../store/routeStore';

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

  const addRoute = useRouteStore((state) => state.addRoute);

  const geocodeAddress = async (address: string): Promise<{ lat: number; lng: number }> => {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${GOOGLE_MAPS_API_KEY}`;

    const res = await axios.get(url);
    const loc = res.data.results?.[0]?.geometry?.location;
    if (!loc) throw new Error('지오코딩 실패');
    return { lat: loc.lat, lng: loc.lng };
  };

  const fetchSuggestions = async (input: string, setter: (s: string[]) => void) => {
    if (!input) return setter([]);
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
      input
    )}&key=${GOOGLE_MAPS_API_KEY}`;
    try {
      const res = await axios.get(url);
      const suggestions = res.data.predictions.map((p: any) => p.description);
      setter(suggestions);
    } catch (e) {
      console.error('자동완성 실패', e);
    }
  };

  const handleStart = async () => {
    if (!start) {
      Alert.alert('출발지를 입력해주세요');
      return;
    }

    try {
      const start_point = await geocodeAddress(start);
      const end_point = end ? await geocodeAddress(end) : undefined;

      const preferences = {
        loop,
        run_type: '일반 러닝',
        park_ratio_preference: flatPath ? 1.0 : 0.5,
        public_transport: publicTransport,
        not_crowded: notCrowded,
      };

      const environment = {
        temperature: 20,
        humidity: 50,
        weather: 'cloudy',
      };

      const url = end
        ? 'http://192.168.0.6:3658/m1/943861-927263-default/api/route/recommend/new'
        : 'http://192.168.0.6:3658/m1/943861-927263-default/api/route/recommend/free';

      const payload = end
        ? {
            start_point,
            end_point,
            preferences,
            environment,
            run_ratio: 1.0,
            user_running_history: [],
          }
        : {
            start_point,
            preferences,
            environment,
            run_ratio: 1.0,
          };

      const response = await axios.post(url, payload);
      console.log('추천 경로 응답:', response.data);
      if (!Array.isArray(response.data.coordinates)) {
        Alert.alert('경로 정보가 없습니다.');
        return;
      }
      
      const { route_id, custom_name, duration, coordinates: rawCoords } = response.data;

const routeCoords = rawCoords.map((c: any) => ({
  latitude: c.lat ?? c.latitude,
  longitude: c.lng ?? c.longitude,
}));




      if (!routeCoords || !Array.isArray(routeCoords)) {
        Alert.alert('경로 정보가 없습니다.');
        return;
      }

      setCoordinates(routeCoords);

      addRoute({
        id: route_id,
        name: custom_name,
        duration,
      });

      Alert.alert('추천된 경로가 추가되었습니다!');
    } catch (error) {
      console.error(error);
      Alert.alert('경로 추천에 실패했습니다');
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: coordinates[0]?.latitude || 35.0,
          longitude: coordinates[0]?.longitude || 128.0,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
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
          <TouchableWithoutFeedback key={idx} onPress={() => { setStart(s); setStartSuggestions([]); }}>
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
          <TouchableWithoutFeedback key={idx} onPress={() => { setEnd(s); setEndSuggestions([]); }}>
            <Text style={styles.suggestion}>{s}</Text>
          </TouchableWithoutFeedback>
        ))}

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>순환</Text>
          <Switch value={loop} onValueChange={setLoop} />
        </View>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>대중교통 포함</Text>
          <Switch value={publicTransport} onValueChange={setPublicTransport} />
        </View>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>완만한 경사</Text>
          <Switch value={flatPath} onValueChange={setFlatPath} />
        </View>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>붐비지 않은 곳</Text>
          <Switch value={notCrowded} onValueChange={setNotCrowded} />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleStart}>
          <Text style={styles.submitButtonText}>경로 추천 시작</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  map: { height: 200, width: '100%' },
  form: { padding: 16 },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginBottom: 8,
  },
  suggestion: {
    padding: 10,
    backgroundColor: '#f2f2f2',
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  switchRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10,
  },
  switchLabel: { fontSize: 16, color: '#333' },
  submitButton: {
    backgroundColor: '#3B82F6', padding: 14, borderRadius: 8, marginTop: 16, alignItems: 'center',
  },
  submitButtonText: { color: '#fff', fontSize: 16 },
});
