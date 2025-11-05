import { router, useNavigation } from 'expo-router';
import React, { useEffect } from 'react';
import { HeaderNavStyles as styles } from '@/styles/common';
import { Text, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

interface HeaderNavProps {
  title: string;
}
export const HeaderNav = ({ title }: HeaderNavProps) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerSection}>
        <MaterialIcons
          name="arrow-back-ios-new"
          size={24}
          style={styles.headerIcon}
          color="black"
          onPress={() => {
            router.back();
          }}
        />
        <Text style={styles.headerText}> {title} </Text>
      </View>
    </View>
  );
};

export const HeaderLogo = () => {
  const navigation = useNavigation();
  const data = navigation.getId();
  console.log(data);
  return (
    <View style={styles.headerContainer}>
      <View style={[styles.headerSection, styles.headerLogoSection]}>
        <Text style={styles.headerLogoText}>Runify</Text>
        <Text style={styles.headerSubText}>{'subTitle'} </Text>
      </View>
    </View>
  );
};
