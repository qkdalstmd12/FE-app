import { sendSignupCode, signupUser } from '@/api/user/membership';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function MemberShipPage() {
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [nickName, setNickName] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [runningType, setRunningType] = useState('');

  const submitMemberShip = async () => {
    try {
      await signupUser({
        email,
        password,
        name,
        nickName,
        height: Number(height),
        weight: Number(weight),
        runningType,
      });
      router.push('/user/routine');
    } catch (error) {
      console.log(error);
      router.push('/user/routine');
    }
  };

  return (
    <ScrollView
      contentContainerStyle={[styles.scrollContainer, { paddingTop: insets.top }]}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.formContainer}>
        <View style={styles.formHeader}>
          <TouchableOpacity onPress={() => router.push('/')}>
            <Text style={styles.headerText}>{'<'}</Text>
          </TouchableOpacity>
          <Text style={styles.headerText}>회원가입</Text>
        </View>

        <View style={styles.formContent}>
          {[
            { label: '이메일', value: email, setter: setEmail },
            { label: '비밀번호', value: password, setter: setPassword },
            { label: '이름', value: name, setter: setName },
            { label: '닉네임', value: nickName, setter: setNickName },
            { label: '키', value: height, setter: setHeight, numeric: true },
            { label: '몸무게', value: weight, setter: setWeight, numeric: true },
            { label: '러닝 타입', value: runningType, setter: setRunningType },
          ].map(({ label, value, setter, numeric }, index) => (
            <View style={styles.formLabel} key={index}>
              <Text style={styles.inputLabelText}>{label}</Text>
              <TextInput
                style={styles.formInput}
                placeholder="여기에 입력하세요"
                value={value}
                onChangeText={setter}
                keyboardType={numeric ? 'numeric' : 'default'}
              />
              {label === '이메일' && (
                <TouchableOpacity style={styles.formButton} onPress={async () => await sendSignupCode(email)}>
                  <Text style={styles.formButtonText}>인증번호 발송</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}

          <View style={styles.formAlter}>
            <Text>회원가입</Text>
            <Text>아이디 찾기</Text>
            <Text>비밀번호 찾기</Text>
          </View>

          <TouchableOpacity style={styles.formButton} onPress={submitMemberShip}>
            <Text style={styles.formButtonText}>회원가입하기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 20,
    backgroundColor: 'white',
  },
  formContainer: {
    borderRadius: 21,
    flexDirection: 'column',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 30,
  },
  formHeader: {
    flexDirection: 'row',
    width: '100%',
    gap: 30,
  },
  headerText: {
    fontSize: 24,
  },
  formContent: {
    flexDirection: 'column',
    paddingHorizontal: 20,
    gap: 30,
    width: '100%',
  },
  inputLabelText: {
    fontSize: 13,
    marginHorizontal: 5,
  },
  formLabel: {
    flexDirection: 'column',
    gap: 10,
  },
  formInput: {
    height: 50,
    borderRadius: 6,
    borderWidth: 1,
    padding: 10,
  },
  formAlter: {
    flexDirection: 'row',
    gap: 2,
  },
  formButton: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    backgroundColor: '#414B61',
    padding: 20,
  },
  formButtonText: {
    color: 'white',
  },
});
