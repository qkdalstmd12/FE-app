import { runnifyloginUser } from '@/api/user/membership';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<boolean>(false);

  // 로그인 하기
  const submitLogin = async () => {
    console.log('제출');
    try {
      const response = await runnifyloginUser(email, password);
      router.push('/');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
      <View style={styles.formContainer}>
        <View style={styles.formHeader}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.headerText}>{'<'}</Text>
          </TouchableOpacity>
          <Text style={styles.headerText}>Runnify로 로그인</Text>
        </View>

        <View style={styles.formContent}>
          <View style={styles.formLabel}>
            <Text style={styles.inputLabelText}>아이디</Text>
            <TextInput
              style={styles.formInput}
              placeholder="여기에 입력하세요"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          <View style={styles.formLabel}>
            <Text style={styles.inputLabelText}>비밀번호</Text>
            <TextInput
              style={styles.formInput}
              placeholder="여기에 입력하세요"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <TouchableOpacity style={styles.formButton} onPress={submitLogin}>
            <Text style={styles.formButtonText}>로그인하기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingTop: 40,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0,0,0,0.2)',
    flexGrow: 1, // 스크롤 안될 때 꼭 넣기 (내용 적어도 최소 화면 꽉 채움)
  },
  formContainer: {
    borderRadius: 21,
    backgroundColor: 'white',
    padding: 30,
    gap: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formHeader: {
    flexDirection: 'row',
    width: '100%',
    gap: 30,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
  },
  formContent: {
    width: '100%',
    gap: 30,
  },
  inputLabelText: {
    fontSize: 13,
    marginHorizontal: 5,
  },
  formLabel: {
    gap: 10,
  },
  formInput: {
    height: 50,
    borderRadius: 6,
    borderWidth: 1,
    padding: 10,
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
