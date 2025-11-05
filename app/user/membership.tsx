// 내부 함수 호출
import { sendSignupCode, signupUser, verifyEmailCode } from '@/api/auth';
import { useFormStateManager } from '@/hooks/common';
import { RUNNING_TYPES, SignUpField, signUpFields } from '@/types/auth';
import { FormPage, FormFieldType, FormContent, FormField, HeaderNav, SubmitButton } from '@/components/common';

// 리액트 라이브러리
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { PreferenceField, preferenceFields } from '@/types/preference';
import { createUserPreferences } from '@/api/user';

export default function MemberShipPage() {
  const [emailPending, setEmailPending] = useState<boolean>(false);
  const { states, changeStates, resetStates } = useFormStateManager<SignUpField>(signUpFields);

  // form 유효성 검사 함수
  const handleValidateForm = () => {
    let hasError = false;
    const errorStatus: [string, boolean] = ['status', false];

    if (!states['email']['status'] || !states['email_validation']['status']) {
      hasError = true;
      changeStates('email_validation', [errorStatus, ['message', '이메일 인증을 완료해주세요']]);
    }

    if (
      !states['password']['value'] ||
      (states['password']['value'] &&
        !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+~\-={}[\]:;"\'<>,.?/]).{8,15}$/.test(states['password']['value']))
    ) {
      hasError = true;
      changeStates('password', [errorStatus, ['message', '비밀번호: 영문+숫자+특수문자 8~15자']]);
    }

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

  // 이메일 인증코드 발송
  const handleSendEmailCode = async () => {
    console.log('눌림');
    const email = states['email']['value'];
    if (!email) {
      changeStates('email', [
        ['status', false],
        ['message', '이메일을 입력해주세요'],
      ]);
      return;
    }
    try {
      await sendSignupCode(email);
      changeStates('email', [
        ['status', true],
        ['message', '이메일 발송이 완료되었습니다.'],
      ]);
      setEmailPending(true);
      changeStates('email_validation', [['status', false]]);
    } catch (e: any) {
      changeStates('email', [
        ['status', false],
        ['message', e.message ?? '이메일 발송에 실패하였습니다.'],
      ]);
    }
  };

  // 이메일 인증 확인
  const handleCheckEmailCode = async () => {
    const email = states['email']['value'];
    const emailValidationCode = states['email_validation']['value'];
    if (!email || !emailValidationCode || !emailPending) {
      changeStates('email_validation', [
        ['status', false],
        ['message', '인증코드를 발송해주세요'],
      ]);
      return;
    }
    try {
      const response = await verifyEmailCode(email, emailValidationCode);
      changeStates('email_validation', [
        ['status', true],
        ['message', '이메일 인증이 완료되었습니다.'],
      ]);
      setEmailPending(false);
    } catch (e: any) {
      changeStates('email_validation', [
        ['status', false],
        ['message', '유효하지 않은 인증 코드이거나 만료된 코드입니다.'],
      ]);
    }
  };

  // 회원가입
  const handleSumbitSignup = async () => {
    if (!handleValidateForm()) return;
    try {
      await signupUser({
        email: states['email']['value'],
        password: states['password']['value'],
        name: states['name']['value'],
        nickName: states['nickName']['value'],
        height: Number(states['height']['value']),
        weight: Number(states['weight']['value']),
        runningType: states['runningType']['value'],
      });
      const preferencePayload = preferenceFields.reduce(
        (acc, key) => {
          acc[key] = ['NONE'];
          return acc;
        },
        {} as Record<PreferenceField, string[]>,
      );
      await createUserPreferences(preferencePayload);
      router.dismissAll();
      router.push('/main');
      router.push('/setting/preference');
    } catch (e: any) {
      changeStates('form', [
        ['status', false],
        ['message', e.message ?? '회원가입 중 오류가 발생하였습니다.'],
      ]);
    }
  };

  const makeNumberItems = (start: number, end: number) =>
    Array.from({ length: end - start + 1 }, (_, i) => ({
      key: i,
      label: start + i,
      value: start + i,
    }));

  useEffect(() => {
    changeStates('runningType', [['value', RUNNING_TYPES[0]]]);
  }, []);

  return (
    <FormPage title={'회원가입'} submit={handleSumbitSignup} reset={resetStates} submitText={'다음'}>
      <FormContent states={states} handleResetForm={resetStates} handleChangeValue={changeStates} submitText={'가입'}>
        {/* 이메일 */}
        <FormField
          label={'이메일'}
          fieldKey={'email'}
          placeholder={'이메일을 입력해주세요'}
          onButtonPress={handleSendEmailCode}
          buttonText={`${emailPending ? '재' : ''}발송`}
          messageVisible={!states['email']['status'] || emailPending}
          type={FormFieldType.input}
        />
        {/* 이메일 인증코드 */}
        <FormField
          label={'이메일 인증코드'}
          placeholder={'이메일 인증번호를 입력해주세요'}
          onButtonPress={handleCheckEmailCode}
          buttonText={'확인'}
          messageVisible={true}
          type={FormFieldType.input}
          fieldKey={'email_validation'}
        />
        {/* 비밀번호 */}
        <FormField
          type={FormFieldType.input}
          label={'비밀번호'}
          fieldKey={'password'}
          placeholder={'비밀번호를 입력해주세요'}
        />
        {/* 이름 */}
        <FormField type={FormFieldType.input} label={'이름'} fieldKey={'name'} placeholder={'이름을 입력해주세요'} />
        {/* 닉네임 */}
        <FormField
          fieldKey={'nickName'}
          label={'닉네임'}
          placeholder={'닉네임을 입력해주세요'}
          type={FormFieldType.input}
        />
        <FormField
          label={'체중'}
          fieldKey={'weight'}
          placeholder={'체중을 선택해주세요'}
          type={FormFieldType.input}
          items={makeNumberItems(30, 100)}
        />
        <FormField
          label={'키'}
          fieldKey={'height'}
          placeholder={'키를 입력해주세요'}
          type={FormFieldType.input}
          items={makeNumberItems(30, 100)}
        />
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
}
