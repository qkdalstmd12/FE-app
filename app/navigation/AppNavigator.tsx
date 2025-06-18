import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainScreen from '../screens/MainScreen';
import AddRouteScreen from '../screens/AddRouteScreen';
import EditRouteScreen from '../screens/EditRouteScreen';
import RunningSummaryScreen from '../screens/RunningSummaryScreen';

export type RootStackParamList = {
  MainScreen: undefined;
  AddRouteScreen: undefined;
  EditRouteScreen: { routeId: number };
  RunningSummaryScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="MainScreen">
      <Stack.Screen name="MainScreen" component={MainScreen} options={{ title: 'Runify' }} />
      <Stack.Screen name="AddRouteScreen" component={AddRouteScreen} options={{ title: '경로 추가' }} />
      <Stack.Screen name="EditRouteScreen" component={EditRouteScreen} options={{ title: '경로 수정' }} />
      <Stack.Screen name="RunningSummaryScreen" component={RunningSummaryScreen} options={{ title: '러닝 통계' }} />
    </Stack.Navigator>
  );
}
