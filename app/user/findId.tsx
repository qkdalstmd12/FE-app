// 내부 함수 호출
import { confirmResetPassword, findUserEmail, sendResetPasswordCode } from '@/api/auth';
import { useFormStateManager } from '@/hooks/common';
import { findIdFields, FindIdField, RUNNING_TYPES } from '@/types/auth';
import { FormFieldType, FormResult, FormContent, FormField, FormPage } from '@/components/common';

// 리액트 라이브러리
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function FindIdPage() {
  const { states, changeStates, resetStates } = useFormStateManager<FindIdField>(findIdFields);

  // form 유효성 검사 함수
  const handleValidateForm = () => {
    let hasError = false;
    const errorStatus: [string, boolean] = ['status', false];

    if (!states['nickName']['value']) {
      hasError = true;
      changeStates('nickName', [errorStatus, ['message', '닉네임을 입력해주세요']]);
    }
    if (!states['runningType']['value']) {
      hasError = true;
      changeStates('runningType', [errorStatus, ['message', '러닝 타입을 선택해주세요']]);
    }
    return !hasError;
  };

  // 아이디 찾기
  const handleFindId = async () => {
    if (!handleValidateForm()) {
      return;
    }
    try {
      const email = await findUserEmail(states['nickName']['value'], states['runningType']['value']);
      changeStates('emailResult', [
        ['status', true],
        ['message', email],
      ]);
      changeStates('form', [
        ['status', true],
        ['message', ''],
      ]);
    } catch (e: any) {
      changeStates('form', [
        ['status', false],
        ['message', e.message ?? '이메일 찾기 중 오류가 발생하였습니다.'],
      ]);
    }
  };

  return (
    <FormPage submit={handleFindId} title={'이메일 찾기'} reset={resetStates} submitText={'이메일 찾기'}>
      <FormContent states={states} handleResetForm={resetStates} handleChangeValue={changeStates} submitText={'가입'}>
        {/* 닉네임 */}
        <FormField
          label={'닉네임'}
          fieldKey={'nickName'}
          placeholder={'닉네임을 입력해주세요'}
          type={FormFieldType.input}
        />
        {/* 러닝 타입 */}
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
        <FormResult resultTitle={'이메일 찾기 결과'} resultKey={states['form']['status'] ? 'emailResult' : 'form'} />
      </FormContent>
    </FormPage>
  );
}
