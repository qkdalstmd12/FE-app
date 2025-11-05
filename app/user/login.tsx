// 내부 함수 호출
import { useFormStateManager } from '@/hooks/common';
import { LoginField, loginFields } from '@/types/auth';
import { runnifyloginUser } from '@/api/user';
import { FormFieldType, FormContent, FormField, FormPage } from '@/components/common';

// 리액트 라이브러리
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { router, usePathname } from 'expo-router';

export default function LoginPage() {
  const { states, changeStates, resetStates } = useFormStateManager<LoginField>(loginFields);
  const pathname = usePathname();
  //form 유효성 검사 함수
  const handleValidateForm = () => {
    let hasError = false;
    const errorStatus: [string, boolean] = ['status', false];

    if (states['email']['value'] === '') {
      hasError = true;
      changeStates('email', [errorStatus, ['message', '이메일을 입력해주세요']]);
    }
    if (states['password']['value'] === '') {
      hasError = true;
      changeStates('password', [errorStatus, ['message', '비밀번호를 입력해주세요']]);
    }
    return !hasError;
  };
  // 로그인 하기
  const handleSubmitLogin = async () => {
    if (!handleValidateForm()) return;
    try {
      await runnifyloginUser(states['email']['value'], states['password']['value']);
      changeStates('form', [['message', '로그인이 되었습니다.']]);
      router.replace('/main');
    } catch (e: any) {
      changeStates('form', [
        ['status', false],
        ['message', e.message ?? '로그인 중 오류가 발생하였습니다.'],
      ]);
    }
  };

  return (
    <FormPage submit={handleSubmitLogin} title={'로그인'} reset={resetStates} submitText={'로그인'}>
      <FormContent submitText={'로그인'} handleChangeValue={changeStates} states={states} handleResetForm={resetStates}>
        <FormField
          label={'이메일'}
          fieldKey={'email'}
          placeholder={'이메일을 입력해주세요'}
          type={FormFieldType.input}
        />
        <FormField
          label={'비밀번호'}
          fieldKey={'password'}
          placeholder={'비밀번호를 입력해주세요'}
          type={FormFieldType.input}
        />
      </FormContent>
    </FormPage>
  );
}
