import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router'; // 기존 navigation 대체
import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, Text } from 'react-native';
import { RUNNING_TYPES, UserDataField, userDataFields } from '@/types/auth';
import { useFormStateManager } from '@/hooks/common';
import { getUserProfile, updateUserProfile } from '@/api/user';
import { FormContent, FormField, FormFieldType, FormPage } from '@/components/common';

const MyInfoEditScreen = () => {
  const [loading, setLoading] = useState(true);
  const { states, changeStates, resetStates } = useFormStateManager<UserDataField>(userDataFields);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { name, nickName, height, weight, runningType } = await getUserProfile();
        changeStates('name', [['value', name]]);
        changeStates('nickName', [['value', nickName]]);
        changeStates('height', [['value', String(height)]]);
        changeStates('weight', [['value', String(height)]]);
        changeStates('runningType', [['value', runningType]]);
      } catch (error: any) {
        console.error('프로필 로드 실패:', error.response?.data || error.message);
        Alert.alert('오류', '사용자 정보를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, []);

  const handleValidateForm = () => {
    let hasError = false;
    const errorStatus: [string, boolean] = ['status', false];

    if (
      !states['name']['value'] ||
      (states['name']['value'] && (states['name']['value'].length < 1 || states['name']['value'].length > 10))
    ) {
      hasError = true;
      changeStates('name', [errorStatus, ['message', '이름은 1~10자 이내로 입력해주세요']]);
    }

    if (
      !states['nickName']['value'] ||
      (states['nickName']['value'] &&
        (states['nickName']['value'].length < 1 || states['nickName']['value'].length > 10))
    ) {
      hasError = true;
      changeStates('nickName', [errorStatus, ['message', '닉네임은 1~10자 이내로 입력해주세요']]);
    }

    if (!states['weight']['value'] || (states['weight']['value'] && Number(states['weight']['value']) < 10)) {
      hasError = true;
      changeStates('weight', [errorStatus, ['message', '체중은 10kg 이상이어야 합니다. ']]);
    }

    if (!states['height']['value'] || (states['height']['value'] && Number(states['height']['value']) < 50)) {
      hasError = true;
      changeStates('height', [errorStatus, ['message', '키는 50cm 이상이어야 합니다.']]);
    }
    if (!RUNNING_TYPES.includes(states['runningType']['value'])) {
      hasError = true;
      changeStates('runningType', [errorStatus, ['message', '러닝 타입을 선택해주세요']]);
    }
    return !hasError;
  };

  const handleSave = async () => {
    if (!handleValidateForm()) {
      return;
    }
    try {
      await updateUserProfile({
        name: states['name']['value'],
        nickName: states['nickName']['value'],
        height: Number(states['height']['value']),
        weight: Number(states['weight']['value']),
        runningType: states['runningType']['value'],
      });
      Alert.alert('성공', '프로필이 업데이트되었습니다.');
      router.back();
    } catch (e: any) {
      changeStates('form', [
        ['status', false],
        ['message', e.message ?? '회원가입 중 오류가 발생하였습니다.'],
      ]);
    }
  };

  if (loading) {
    return (
      <SafeAreaView>
        <Text>정보를 불러오는 중...</Text>
      </SafeAreaView>
    );
  }

  return (
    <FormPage submit={handleSave} title={'프로필 수정하기'} reset={resetStates} submitText={'수정'}>
      <FormContent states={states} handleResetForm={resetStates} handleChangeValue={changeStates} submitText={'가입'}>
        {/* 이름 */}
        <FormField type={FormFieldType.input} label={'이름'} fieldKey={'name'} placeholder={'이름을 입력해주세요'} />
        {/* 닉네임 */}
        <FormField
          fieldKey={'nickName'}
          label={'닉네임'}
          placeholder={'닉네임을 입력해주세요'}
          type={FormFieldType.input}
        />
        <FormField label={'체중'} fieldKey={'weight'} placeholder={'체중을 선택해주세요'} type={FormFieldType.input} />
        <FormField label={'키'} fieldKey={'height'} placeholder={'키를 입력해주세요'} type={FormFieldType.input} />
        <FormField
          label={'러닝 타입'}
          fieldKey={'runningType'}
          placeholder={'러닝 타입을 선택하세요'}
          items={RUNNING_TYPES.map((type, index) => ({
            key: index,
            label: type,
            value: type,
          }))}
          type={FormFieldType.option}
        />
      </FormContent>
    </FormPage>
  );
};
export default MyInfoEditScreen;
