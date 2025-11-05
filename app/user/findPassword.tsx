// 내부 함수 호출
import { confirmResetPassword, sendResetPasswordCode } from '@/api/auth';
import { useFormStateManager } from '@/hooks/common';
import { findPasswordFields, FindPasswordField } from '@/types/auth';
import { FormPage, FormFieldType, FormContent, FormField } from '@/components/common';

// 리액트 라이브러리
import React, { useState } from 'react';
import { router } from 'expo-router';

export default function FindPasswordPage() {
  const [emailPending, setEmailPending] = useState(false);
  const { states, changeStates, resetStates } = useFormStateManager<FindPasswordField>(findPasswordFields);

  // form 유효성 검사 함수
  const handleValidateForm = () => {
    console.log('validate 실행');
    let hasError = false;
    const errorStatus: [string, boolean] = ['status', false];

    console.log(!states['email_validation']['value']);
    if (!states['email_validation']['value']) {
      hasError = true;
      changeStates('email_validation', [errorStatus, ['message', '인증번호를 입력해주세요']]);
    }
    console.log('통과');

    if (
      states['newPassword']['value'] &&
      !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+~\-={}[\]:;"\'<>,.?/]).{8,15}$/.test(states['newPassword']['value'])
    ) {
      hasError = true;
      changeStates('newPassword', [errorStatus, ['message', '비밀번호: 영문+숫자+특수문자 8~15자']]);
    }
    console.log('has Error : ', !hasError);
    return !hasError;
  };

  // 이메일 인증코드 발송
  const handleSendEmailCode = async () => {
    const email = states['email']['value'];
    if (!email) {
      changeStates('email', [
        ['status', false],
        ['message', '이메일을 입력해주세요'],
      ]);
      return;
    }
    try {
      await sendResetPasswordCode(email);
      changeStates('email', [
        ['status', true],
        ['message', '이메일 발송이 완료되었습니다.'],
      ]);
      setEmailPending(true);
    } catch (e: any) {
      changeStates('email', [
        ['status', false],
        ['message', e.message ?? '이메일 발송에 실패하였습니다.'],
      ]);
    }
  };

  // 비밀번호 재설정
  const handleSetNewPassword = async () => {
    if (!handleValidateForm()) {
      return;
    }
    try {
      await confirmResetPassword(states['email_validation']['value'], states['newPassword']['value']);
      router.replace('/main');
    } catch (e: any) {
      changeStates('form', [
        ['status', false],
        ['message', e.message ?? '비밀번호 재설정 중 오류가 발생하였습니다.'],
      ]);
    }
  };

  return (
    <FormPage submit={handleSetNewPassword} title={'비밀번호 재설정'} reset={resetStates} submitText={'재설정'}>
      <FormContent
        states={states}
        handleSubmitForm={handleSetNewPassword}
        handleResetForm={resetStates}
        handleChangeValue={changeStates}
        submitText={'가입'}
      >
        {/* 이메일 */}
        <FormField
          label={'이메일'}
          fieldKey={'email'}
          placeholder={'이메일을 입력해주세요'}
          onButtonPress={handleSendEmailCode}
          buttonText={`${emailPending ? '재' : ''} 전송`}
          messageVisible={!states['email']['status'] || emailPending}
          type={FormFieldType.input}
        />
        {/* 이메일 인증코드 */}
        <FormField
          label={'이메일 인증코드'}
          placeholder={'이메일 인증번호를 입력해주세요'}
          type={FormFieldType.input}
          fieldKey={'email_validation'}
        />
        {/* 비밀번호 */}
        <FormField
          type={FormFieldType.input}
          label={'새 비밀번호'}
          fieldKey={'newPassword'}
          placeholder={'변경할 비밀번호를 입력해주세요'}
        />
      </FormContent>
    </FormPage>
  );
}
