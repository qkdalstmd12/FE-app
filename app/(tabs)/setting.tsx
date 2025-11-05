// 파일 경로: src/screens/SettingsScreen.tsx
import { AntDesign, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { removeToken } from '@/utils/auth';
import { useFormStateManager } from '@/hooks/common';
import { SignUpField, signUpFields } from '@/types/auth';

const SettingsScreen: React.FC = () => {
  const [receiveNotifications, setReceiveNotifications] = useState(true);

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setParams({ title: '설정' });
  }, []);

  const handleLogout = () => {
    Alert.alert(
      '로그아웃',
      '정말로 로그아웃 하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '확인',
          onPress: async () => {
            console.log('로그아웃 처리');
            await removeToken();
            router.push('/main');
          },
        },
      ],
      { cancelable: true },
    );
  };
  // 일반 설정 항목 컴포넌트
  const SettingsItem: React.FC<{
    iconName: string; // string 타입 유지 (아래 IconComponent에서 처리)
    iconLibrary: 'Ionicons' | 'MaterialCommunityIcons' | 'AntDesign';
    text: string;
    onPress: () => void;
    showChevron?: boolean;
    isLast?: boolean;
  }> = ({ iconName, iconLibrary, text, onPress, showChevron = true, isLast = false }) => {
    const IconComponent =
      iconLibrary === 'Ionicons'
        ? Ionicons
        : iconLibrary === 'MaterialCommunityIcons'
          ? MaterialCommunityIcons
          : AntDesign;

    return (
      <TouchableOpacity onPress={onPress} style={[styles.settingsItem, isLast && styles.noBorder]}>
        <View style={styles.itemLeft}>
          <IconComponent name={iconName as any} size={24} color="#5A6372" style={styles.itemIcon} />
          <Text style={styles.itemText}>{text}</Text>
        </View>
        {showChevron && <Ionicons name="chevron-forward" size={24} color="#C0C0C0" />}
      </TouchableOpacity>
    );
  };

  // 알림 설정 항목 컴포넌트
  const NotificationItem: React.FC<{
    iconName: string; // string 타입 유지
    iconLibrary: 'Ionicons' | 'MaterialCommunityIcons' | 'AntDesign';
    text: string;
    isLast?: boolean;
  }> = ({ iconName, iconLibrary, text, isLast = false }) => {
    const IconComponent =
      iconLibrary === 'Ionicons'
        ? Ionicons
        : iconLibrary === 'MaterialCommunityIcons'
          ? MaterialCommunityIcons
          : AntDesign;

    return (
      <View style={[styles.settingsItem, isLast && styles.noBorder]}>
        <View style={styles.itemLeft}>
          <IconComponent name={iconName as any} size={24} color="#5A6372" style={styles.itemIcon} />
          <Text style={styles.itemText}>{text}</Text>
        </View>
        <Switch
          onValueChange={setReceiveNotifications}
          value={receiveNotifications}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={receiveNotifications ? '#5A6372' : '#f4f3f4'}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" />}
      {Platform.OS === 'android' && <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />}

      <View style={styles.header}></View>

      <View style={[styles.section, styles.firstSection]}>
        <Text style={styles.sectionTitle}>일반</Text>
        <SettingsItem
          iconName="person-outline"
          iconLibrary="Ionicons"
          text="내 정보 수정"
          onPress={() => router.push('/setting/mypage')}
        />
        <SettingsItem
          iconName="cog-outline"
          iconLibrary="Ionicons"
          text="선호도 설정"
          onPress={() => router.push('/setting/preference')}
          isLast={true}
        />
        <SettingsItem
          iconName="form-textbox-password"
          iconLibrary="MaterialCommunityIcons"
          text="비밀번호 재설정"
          onPress={() => router.push('/user/findPassword')}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>알림</Text>
        <NotificationItem iconName="notifications-outline" iconLibrary="Ionicons" text="알림 받기" isLast={true} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>계정</Text>
        <SettingsItem
          iconName="log-out-outline"
          iconLibrary="Ionicons"
          text="로그아웃"
          onPress={handleLogout}
          showChevron={false}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    paddingRight: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  section: {
    marginTop: 20,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  firstSection: {
    marginTop: 0,
    borderTopWidth: 0,
  },
  sectionTitle: {
    fontSize: 14,
    color: '#888',
    paddingVertical: 10,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemIcon: {
    marginRight: 10,
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
});

export default SettingsScreen;
