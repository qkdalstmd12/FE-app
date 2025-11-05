// 내부 함수 호출
import { useFormStateManager } from '@/hooks/common';
import {
  PreferenceField,
  preferenceFields,
  PREFERENCE_ROUTE_LABELS,
  PREFERENCE_AVOID_LABELS,
  PREFERENCE_PLACE_LABELS,
  PREFERENCE_ETC_LABELS,
} from '@/types/preference';
import {
  createUserPreferences,
  getUserPreferences,
  getUserProfile,
  runnifyloginUser,
  updateUserPreferences,
} from '@/api/user';
import { FormFieldType, FormContent, FormField, FormPage, FormSelectedField } from '@/components/common';

// 리액트 라이브러리
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { router, usePathname } from 'expo-router';
import { Route } from 'expo-router/build/Route';

export default function PreferencePage() {
  const { states, changeStates, resetStates } = useFormStateManager<PreferenceField>(preferenceFields);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  useEffect(() => {
    const fetchPreference = async () => {
      try {
        const preferences = await getUserPreferences();
        preferenceFields.forEach((key) => {
          changeStates(key, [['value', Array.from(preferences[key] ?? ['NONE'])]]);
        });
      } catch (error: any) {
        preferenceFields.forEach((key) => {
          changeStates(key, [['value', Array.from(['NONE'])]]);
        });
        Alert.alert('오류', '사용자 정보를 불러오는 데 실패했습니다.');
      }
    };
    fetchPreference();
  }, []);
  const handleSubmitPreferenceSetting = async () => {
    try {
      const preferencePayload = preferenceFields.reduce(
        (acc, key) => {
          acc[key] = states[key].value;
          return acc;
        },
        {} as Record<PreferenceField, string[]>,
      );
      await updateUserPreferences(preferencePayload);
      router.reload();
    } catch (e: any) {
      console.log(e);
    }
  };

  return (
    <FormPage
      submit={handleSubmitPreferenceSetting}
      title={'선호도를 설정해주세요'}
      reset={resetStates}
      submitText={'완료'}
    >
      <FormContent
        submitText={'로그인'}
        expandedSection={expandedSection}
        setExpandedSection={setExpandedSection}
        handleChangeValue={changeStates}
        states={states}
        handleResetForm={resetStates}
      >
        <FormSelectedField
          fieldKey={preferenceFields[0]}
          label={'선호하는 장소가 있으신가요?'}
          options={PREFERENCE_PLACE_LABELS}
        />
        <FormSelectedField
          fieldKey={preferenceFields[1]}
          label={'선호하는 경로가 있으신가요?'}
          options={PREFERENCE_ROUTE_LABELS}
        />
        <FormSelectedField
          fieldKey={preferenceFields[2]}
          label={'피하고 싶은 경로가 있으신가요?'}
          options={PREFERENCE_AVOID_LABELS}
        />
        <FormSelectedField
          fieldKey={preferenceFields[3]}
          label={'기타 조건이 있으신가요?'}
          options={PREFERENCE_ETC_LABELS}
        />
      </FormContent>
    </FormPage>
  );
}
