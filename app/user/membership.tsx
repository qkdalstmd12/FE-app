import { sendSignupCode, signupUser } from '@/api/user/membership';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const RUNNING_TYPES = ['JOGGING', 'HALF_MARATHON', 'RUNNING', 'TRAIL_RUNNING', 'INTERVAL_TRAINING'];

export default function MemberShipPage() {
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [nickName, setNickName] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [runningType, setRunningType] = useState('');
  const [errors, setErrors] = useState({});

  // 유효성 검사 함수
  const validate = () => {
    const newErrors = {};

    if (!emailVerified) {
      newErrors.email = '회원가입 전 인증코드를 먼저 보내주세요!';
    }

    if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+~\-={}[\]:;"\'<>,.?/]).{8,15}$/.test(password)) {
      newErrors.password = '비밀번호: 영문+숫자+특수문자 8~15자';
    }

    if (name.length < 1 || name.length > 10) {
      newErrors.name = '이름: 1~10자';
    }

    if (nickName.length < 1 || nickName.length > 10) {
      newErrors.nickName = '닉네임: 1~10자';
    }

    if (Number(height) < 50) {
      newErrors.height = '키: 50cm 이상 입력';
    }

    if (Number(weight) < 10) {
      newErrors.weight = '몸무게: 10kg 이상 입력';
    }

    if (!RUNNING_TYPES.includes(runningType)) {
      newErrors.runningType = '러닝타입: JOGGING, HALF_MARATHON, RUNNING, TRAIL_RUNNING, INTERVAL_TRAINING 중 선택';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 인증코드 발송
  const handleSendCode = async () => {
    if (!email) {
      setErrors((prev) => ({ ...prev, email: '이메일을 입력해주세요.' }));
      return;
    }
    try {
      await sendSignupCode(email);
      setEmailVerified(true);
      setErrors((prev) => ({ ...prev, email: undefined }));
    } catch (e) {
      setErrors((prev) => ({ ...prev, email: '이메일 인증 실패' }));
    }
  };

  // 회원가입
  const submitMemberShip = async () => {
    if (!validate()) return;
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
      setErrors({ form: '회원가입 중 오류가 발생했습니다.' });
    }
  };

  // 입력값 변경 시 에러 초기화
  const handleChange = (field, value) => {
    switch (field) {
      case 'email':
        setEmail(value);
        setEmailVerified(false);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'name':
        setName(value);
        break;
      case 'nickName':
        setNickName(value);
        break;
      case 'height':
        setHeight(value);
        break;
      case 'weight':
        setWeight(value);
        break;
      case 'runningType':
        setRunningType(value);
        break;
    }
    setErrors((prev) => ({ ...prev, [field]: undefined, form: undefined }));
  };

  return (
    <ScrollView contentContainerStyle={[styles.scrollContainer]} keyboardShouldPersistTaps="handled">
      <View style={styles.formContainer}>
        <View style={styles.formHeader}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.headerText}>{'<'}</Text>
          </TouchableOpacity>
          <Text style={styles.headerText}>회원가입</Text>
        </View>

        <View style={styles.formContent}>
          {/* 이메일 */}
          <View>
            <View style={styles.formLabel}>
              <Text style={styles.inputLabelText}>이메일</Text>
              <TextInput
                style={[styles.formInput, errors.email && styles.inputError]}
                placeholder="여기에 입력하세요"
                value={email}
                onChangeText={(text) => handleChange('email', text)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TouchableOpacity style={styles.formButton} onPress={handleSendCode}>
                <Text style={styles.formButtonText}>인증번호 발송</Text>
              </TouchableOpacity>
            </View>
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            {emailVerified && !errors.email && <Text style={styles.successText}>이메일 인증 완료</Text>}
          </View>

          {/* 비밀번호 */}
          <View style={styles.formLabel}>
            <Text style={styles.inputLabelText}>비밀번호</Text>
            <TextInput
              style={[styles.formInput, errors.password && styles.inputError]}
              placeholder="여기에 입력하세요"
              value={password}
              onChangeText={(text) => handleChange('password', text)}
              secureTextEntry
            />
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          </View>

          {/* 이름 */}
          <View style={styles.formLabel}>
            <Text style={styles.inputLabelText}>이름</Text>
            <TextInput
              style={[styles.formInput, errors.name && styles.inputError]}
              placeholder="여기에 입력하세요"
              value={name}
              onChangeText={(text) => handleChange('name', text)}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          {/* 닉네임 */}
          <View style={styles.formLabel}>
            <Text style={styles.inputLabelText}>닉네임</Text>
            <TextInput
              style={[styles.formInput, errors.nickName && styles.inputError]}
              placeholder="여기에 입력하세요"
              value={nickName}
              onChangeText={(text) => handleChange('nickName', text)}
            />
            {errors.nickName && <Text style={styles.errorText}>{errors.nickName}</Text>}
          </View>

          {/* 키 */}
          <View style={styles.formLabel}>
            <Text style={styles.inputLabelText}>키</Text>
            <TextInput
              style={[styles.formInput, errors.height && styles.inputError]}
              placeholder="여기에 입력하세요"
              value={height}
              onChangeText={(text) => handleChange('height', text)}
              keyboardType="numeric"
            />
            {errors.height && <Text style={styles.errorText}>{errors.height}</Text>}
          </View>

          {/* 몸무게 */}
          <View style={styles.formLabel}>
            <Text style={styles.inputLabelText}>몸무게</Text>
            <TextInput
              style={[styles.formInput, errors.weight && styles.inputError]}
              placeholder="여기에 입력하세요"
              value={weight}
              onChangeText={(text) => handleChange('weight', text)}
              keyboardType="numeric"
            />
            {errors.weight && <Text style={styles.errorText}>{errors.weight}</Text>}
          </View>

          {/* 러닝타입 */}
          <View style={styles.formLabel}>
            <Text style={styles.inputLabelText}>러닝 타입</Text>
            <TextInput
              style={[styles.formInput, errors.runningType && styles.inputError]}
              placeholder="JOGGING, HALF_MARATHON 등"
              value={runningType}
              onChangeText={(text) => handleChange('runningType', text)}
              autoCapitalize="characters"
            />
            {errors.runningType && <Text style={styles.errorText}>{errors.runningType}</Text>}
          </View>

          {/* 폼 에러 */}
          {errors.form && <Text style={[styles.errorText, { position: 'relative', top: 0 }]}>{errors.form}</Text>}

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
    width: '100%',
  },
  inputLabelText: {
    fontSize: 13,
    marginHorizontal: 5,
  },
  formLabel: {
    flexDirection: 'column',
    gap: 10,
    position: 'relative', // 에러 메시지 absolute 배치용
    marginBottom: 28, // 에러 메시지 공간 확보
  },
  formInput: {
    height: 50,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
  },
  inputError: {
    borderColor: '#ff3b30',
  },
  errorText: {
    position: 'absolute',
    left: 0,
    top: 80, // input(50) + gap(10) + 여유
    color: '#ff3b30',
    fontSize: 12,
    marginTop: 2,
    marginLeft: 2,
    zIndex: 2,
  },
  successText: {
    position: 'absolute',
    left: 0,
    top: 80,
    color: '#2ecc71',
    fontSize: 12,
    marginTop: 2,
    marginLeft: 2,
    zIndex: 2,
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
    marginTop: 20,
  },
  formButtonText: {
    color: 'white',
  },
});
