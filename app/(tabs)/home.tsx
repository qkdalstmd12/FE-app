// 내부 함수 호출
import { confirmResetPassword, findUserEmail, sendResetPasswordCode } from '@/api/auth';
import { useFormStateManager } from '@/hooks/common';
import { findIdFields, FindIdField, RUNNING_TYPES } from '@/types/auth';
import { FormFieldType, FormResult, FormContent, FormField, FormPage } from '@/components/common';
// 리액트 라이브러리
import { router, useNavigation } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button, ScrollView, Text, TouchableOpacity, View, StyleSheet, Image, Pressable } from 'react-native';
import { useRoute } from '@react-navigation/core';
import { Color, FontFamily } from '@/styles/GlobalStyles';
import BottomSheet, { BottomSheetFlatList, BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import Ionicons from '@expo/vector-icons/Ionicons';
import { getRoutineList } from '@/api/user';

export default function HomePage() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ title: '홈' });
    console.log('진입 완료');
  }, []);

  function getTodayString() {
    const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    const today = new Date();
    return days[today.getDay()];
  }

  const [routineData, setRoutineData] = useState<any>(null);
  const fetchRoutine = async () => {
    const todayString = getTodayString();
    try {
      const data = await getRoutineList();
      const filteredData = data?.filter((routine: { day: string | string[] }) => routine.day.includes(todayString));
      setRoutineData(data);
      console.log(data);
    } catch (error) {
      const filteredData = routineDummy.filter((routine: { day: string | string[] }) =>
        routine.day.includes(todayString),
      );
      setRoutineData(filteredData);
    }
  };
  useEffect(() => {
    fetchRoutine();
  }, []);

  return (
    <View style={{ flexDirection: 'column', flex: 1 }}>
      {/* 프로필 섹션 */}
      <View style={styles.ProfileContainer}>
        <View style={styles.DailySection}>
          <Text style={styles.DailyText}>김민수님!</Text>
          <Text style={styles.DailyText}>오늘도 달릴 준비가 되셨나요?</Text>
        </View>
        <View style={styles.ProfileSection}>
          <Image source={require('@/assets/images/runnerMan.png')} style={styles.ProfileImage} resizeMode="contain" />
          <View style={styles.ProfileCard}>
            <Text style={styles.plainText}>2025.05.17</Text>
            <View style={styles.levelCard}>
              <Text style={styles.levelText}>러닝 스타터</Text>
            </View>
            <Text style={styles.strongText}>총 거리</Text>
            <Text style={styles.plainText}>5000KM</Text>
          </View>
        </View>
      </View>
      <RoutineContainer routines={routineData} />
    </View>
  );
}

const RoutineContainer = ({ routines }: any) => {
  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ['60%', '70%', '80%', '90%', '100%'], []);

  const renderEmpty = () => (
    <View
      style={{
        paddingVertical: 100,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
      }}
    >
      <Text>루틴이 없습니다.</Text>
      <Text>루틴을 생성해주세요!</Text>
    </View>
  );

  const renderItem = useCallback(({ item }) => <RoutineCard {...item} />, []);
  return (
    <BottomSheet
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={snapPoints}
      enableOverDrag={false}
      enablePanDownToClose={false}
      enableContentPanningGesture={false}
      activeOffsetY={[-10, 10]}
      backgroundStyle={styles.RoutineContainer}
      handleIndicatorStyle={{
        width: '30%',
        height: 5,
        borderRadius: 3,
        backgroundColor: Color.gray03,
      }}
      // style={styles.RoutineContainer}
      // bottomInset={80}
    >
      <View style={styles.RoutineContainer}>
        <Text style={styles.RoutineText}>오늘의 루틴</Text>
        <View style={styles.RoutineOptions}>
          <Text style={styles.plainText16}>{routines?.length}개</Text>
          <View style={styles.RoutineOptions}>
            <Pressable onPress={() => router.push('/routine/manage')}>
              <Text style={styles.plainText16}>관리</Text>
            </Pressable>
            <Pressable onPress={() => router.push('/routine/add')}>
              <Text style={styles.plainText16}>추가</Text>
            </Pressable>
          </View>
        </View>
        <BottomSheetFlatList
          contentContainerStyle={styles.RoutineSection}
          data={routines ?? []}
          keyExtractor={(item) => item.routineId}
          renderItem={renderItem}
          scrollEnabled={true}
          ListEmptyComponent={renderEmpty}
        />
      </View>
    </BottomSheet>
  );
};

interface RoutineProps {
  routineId: number;
  place: string;
  destination: string;
  pathId?: number;
  time: string;
  day: string[];
}

const RoutineCard = ({ routineId, place, destination, pathId, time, day }) => {
  return (
    <View style={styles.RoutineCard}>
      <View style={styles.RoutineCardDetail}>
        <View style={styles.RoutineAddressView}>
          <Ionicons name={'home-sharp'} color={'black'} size={50} />
          <View style={styles.RoutineAddressSection}>
            <View style={styles.RoutineAddress}>
              <Text style={styles.PlaceText}>{place}</Text>
              <Text style={styles.AddressText}>{destination}</Text>
            </View>
            <Text style={styles.RoutineFlagText}>{pathId == undefined ? '경로 생성 전' : '러닝 시작 전'}</Text>
          </View>
        </View>
        <View style={styles.TimeSection}>
          <Text style={styles.TimeLabelText}>시간</Text>
          <Text style={styles.TimeLabelText}>{time}</Text>
        </View>
        <View style={styles.RoutineButtonSection}>
          <Pressable style={[styles.RoutineButton, styles.RoutineButtonInActive]} onPress={() => router.push('/run')}>
            <Text style={[styles.RoutineButtonText, styles.RoutineButtonInActiveText]}>시작하기</Text>
          </Pressable>
          <Pressable style={[styles.RoutineButton, styles.RoutineButtonInActive]}>
            <Text style={[styles.RoutineButtonText, styles.RoutineButtonInActiveText]}>생성하기</Text>
          </Pressable>
          <Pressable style={[styles.RoutineButton, styles.RoutineButtonActive]}>
            <Text style={[styles.RoutineButtonText, styles.RoutineButtonActiveText]}>더보기</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const routineDummy = [
  {
    routineId: 9,
    place: '집',
    destination: '건영캐스빌',
    time: '23:20',
    day: ['MONDAY'],
    pathId: 1,
  },
  {
    routineId: 10,
    place: '학교',
    destination: '영남대학교',
    time: '23:20',
    day: ['MONDAY'],
    pathId: null,
  },
  {
    routineId: 1,
    place: '집',
    destination: '건영캐스빌',
    time: '23:20',
    day: ['MONDAY'],
    pathId: 1,
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  listContentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20, // Add padding at the bottom for better scroll experience
  },
  listItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  RoutineButtonSection: {
    flexDirection: 'row',
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
  RoutineButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 7,
  },
  RoutineButtonActive: {
    backgroundColor: Color.primary,
  },
  RoutineButtonText: {
    flex: 1,
    textAlign: 'center',
    fontFamily: FontFamily.lemonRegular,
    fontSize: 14,
  },
  RoutineButtonInActive: { backgroundColor: Color.gray01 },
  RoutineButtonInActiveText: {
    color: Color.black,
  },
  RoutineButtonActiveText: { color: Color.white },
  RoutineAddressView: {
    flexDirection: 'row',
    gap: 10,
  },
  TimeSection: {
    flexDirection: 'row',
    gap: 10,
    width: 140,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  TimeLabelText: {
    fontSize: 14,
    color: Color.gray03,
    fontFamily: FontFamily.interRegular,
    flex: 1,
  },
  RoutineFlagText: {
    fontSize: 12,
    textAlign: 'left',
    width: '100%',
    fontFamily: FontFamily.interRegular,
  },
  RoutineAddressSection: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    gap: 5,
  },
  PlaceText: {
    fontSize: 16,
    color: Color.black,
    fontFamily: FontFamily.interRegular,
  },
  AddressText: {
    fontSize: 11,
    color: Color.gray02,
    fontFamily: FontFamily.interRegular,
  },
  RoutineAddress: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'flex-end',
  },

  RoutineCardDetail: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 10,
  },
  RoutineSection: {
    flexDirection: 'column',
    gap: 10,
    paddingBottom: 250,
  },
  RoutineCard: {
    flexDirection: 'column',
    padding: 20,
    gap: 20,
    backgroundColor: Color.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Color.gray02,
  },
  RoutineOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    gap: 10,
    paddingBottom: 10,
    alignItems: 'center',
  },
  plainText16: {
    fontSize: 16,
    color: Color.gray02,
    fontFamily: FontFamily.interRegular,
  },
  RoutineText: {
    width: '100%',
    textAlign: 'center',
    paddingVertical: 20,
    fontSize: 24,
    fontFamily: FontFamily.interBold,
  },
  RoutineContainer: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    flexDirection: 'column',
    width: '100%',
    paddingHorizontal: 20,
    backgroundColor: Color.bg01,
    gap: 10,
    flex: 1,
  },
  ProfileContainer: {
    paddingHorizontal: 30,
    alignItems: 'flex-start',
    gap: 10,
    flexDirection: 'column',
  },
  DailySection: {
    flexDirection: 'column',
  },
  DailyText: {
    width: '100%',
    fontSize: 24,
    fontFamily: FontFamily.interMedium,
  },
  ProfileSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  ProfileImage: {
    width: 150,
    height: 150,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ProfileCard: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingVertical: 20,
    gap: 5,
  },
  plainText: {
    fontFamily: FontFamily.interMedium,
    fontSize: 24,
  },
  levelCard: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: Color.secondary,
  },
  levelText: {
    fontSize: 13,
    fontFamily: FontFamily.interRegular,
  },
  strongText: {
    fontSize: 16,
    color: Color.primary,
    fontFamily: FontFamily.interBold,
  },
});
