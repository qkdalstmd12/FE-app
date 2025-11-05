import { Pressable, View, StyleSheet, Text } from 'react-native';
import React from 'react';
import { Color, FontFamily, FontSize } from '@/styles/GlobalStyles';

interface SubmitButtonProps {
  handleSubmitForm: any;
  handleResetForm: any;
  submitText: string;
  isResetForm?: boolean;
}

export const SubmitButton = ({
  handleSubmitForm,
  handleResetForm,
  submitText,
  isResetForm = false,
}: SubmitButtonProps) => {
  return (
    <View style={styles.formContainer}>
      <Pressable style={[styles.formButton, styles.success]} onPress={handleSubmitForm}>
        <Text style={styles.formButtonText}>{submitText}</Text>
      </Pressable>
      {isResetForm && (
        <Pressable style={[styles.formButton, styles.reset]} onPress={handleResetForm}>
          <Text style={styles.formButtonText}>취소</Text>d
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    width: '100%',
    flexDirection: 'row',
  },
  formButton: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  success: {
    backgroundColor: Color.primary,
  },
  reset: {
    backgroundColor: Color.gray02,
  },
  formButtonText: {
    fontSize: FontSize.fs_24,
    fontFamily: FontFamily.interMedium,
    color: Color.white,
  },
});
