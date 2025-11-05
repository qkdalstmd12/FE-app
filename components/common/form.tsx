import React, { ReactNode, useState } from 'react';
import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  LayoutAnimation,
} from 'react-native';
import { formStyles as styles } from '@/styles/common';
import RNPickerSelect from 'react-native-picker-select';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import { HeaderNav } from '@/components/common/header';
import { SubmitButton } from '@/components/common/submitButton';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';

interface FormContentProps {
  states: any;
  children: ReactNode;
  handleChangeValue: any;
  handleResetForm: () => void;
  submitText: string;
  expandedSection?: any;
  setExpandedSection?: any;
}
export enum FormFieldType {
  input,
  option,
}

interface FormFieldProps {
  type: FormFieldType;
  label: string;
  placeholder: string;
  fieldKey: string;

  messageVisible?: any;
  states?: any;
  items?: { key: number; label: string | number; value: string | number }[];
  handleChangeValue?: any;
  onButtonPress?: any;
  buttonText?: any;
}

interface FormPageProps {
  children: ReactNode;
  submit: any;
  title: string;
  reset: any;
  submitText: string;
}

export const FormPage = ({ children, submit, title, reset, submitText }: FormPageProps) => (
  <View style={styles.formPageContainer}>
    <HeaderNav title={title} />
    <KeyboardAvoidingView
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
      style={{ flex: 1 }}
      behavior={Platform.OS === 'android' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.formPageSection}
        nestedScrollEnabled={true}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
    <SubmitButton handleSubmitForm={submit} handleResetForm={reset} submitText={submitText} />
  </View>
);

//public
export const FormContent = ({
  expandedSection,
  setExpandedSection,
  states,
  children,
  submitText,
  handleChangeValue,
  handleResetForm,
}: FormContentProps) => {
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      // @ts-ignore
      return React.cloneElement(child, { states, styles, handleChangeValue, expandedSection, setExpandedSection });
    }
    return child;
  });

  return (
    <View style={styles.formContentContainer}>
      {childrenWithProps}
      {/* 폼 에러 */}
      {!states['form']['status'] && (
        <Text style={[styles.errorText, styles.formHelpText]}>{states['form']['message']}</Text>
      )}
    </View>
  );
};

export const FormField = (props: FormFieldProps) => {
  let {
    fieldKey,
    label,
    type,
    states,
    handleChangeValue,
    items,
    onButtonPress,
    buttonText,
    placeholder,
    messageVisible = true,
  } = props;
  const { status, value, message } = states[fieldKey];
  const commonProps = {
    ...props,
    status,
    value,
    message,
  };

  // type은 input인지 option인지
  return (
    <View style={styles.formFieldContainer}>
      {type === FormFieldType.input ? <FormInputField {...commonProps} /> : <FormOptionField {...commonProps} />}
      {props.onButtonPress && (
        <TouchableOpacity style={styles.formButton} onPress={props.onButtonPress}>
          <Text style={styles.buttonText}>{props.buttonText}</Text>
        </TouchableOpacity>
      )}
      {messageVisible && (
        <Text style={[styles.formHelpText, status ? styles.successText : styles.errorText]}>{message}</Text>
      )}
    </View>
  );
};

interface FormFieldDetailProps extends FormFieldProps {
  value: string;
  status: boolean;
  message: string;
  passwordVisible?: boolean;
}

//private
const FormInputField = ({ fieldKey, value, status, placeholder, handleChangeValue }: FormFieldDetailProps) => {
  const [passwordVisible, setPasswordVisible] = useState(fieldKey.includes('assword'));
  return (
    <View style={{ ...styles.formFieldSection, flex: 1 }}>
      <TextInput
        style={[styles.formFieldText]}
        value={value}
        secureTextEntry={passwordVisible}
        onChangeText={(val) =>
          handleChangeValue(fieldKey, [
            ['status', true],
            ['value', val],
            ['message', ''],
          ])
        }
      />
      {!value && <Text style={[styles.formFieldText, styles.formPlaceHolder]}>{placeholder}</Text>}
      {fieldKey === 'password' && passwordVisible ? (
        <Pressable style={styles.formFieldIcon} onPress={() => setPasswordVisible(false)}>
          <Ionicons name="eye-off" size={24} color="black" />
        </Pressable>
      ) : (
        fieldKey.includes('assword') &&
        !passwordVisible && (
          <Pressable style={styles.formFieldIcon} onPress={() => setPasswordVisible(true)}>
            <Ionicons name="eye" size={24} color="black" />
          </Pressable>
        )
      )}
    </View>
  );
};

const FormOptionField = ({
  value,
  status,
  fieldKey,
  handleChangeValue,
  placeholder,
  items = [],
}: FormFieldDetailProps) => {
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(value);
  return (
    <DropDownPicker
      style={{ ...styles.formFieldSection }}
      placeholder={placeholder}
      value={value}
      open={open}
      setOpen={setOpen}
      setValue={setInternalValue}
      onSelectItem={(item) =>
        handleChangeValue(fieldKey, [
          ['status', true],
          ['value', item.value],
          ['message', ''],
        ])
      }
      scrollViewProps={{
        nestedScrollEnabled: true,
        showsVerticalScrollIndicator: true, // 스크롤바 표시
      }}
      zIndexInverse={100}
      zIndex={500000}
      listMode="SCROLLVIEW"
      items={items}
      disableScrollViewPanResponder={false}
      textStyle={styles.formFieldText}
      dropDownContainerStyle={{ ...styles.formOptionListContainer }}
    />
  );
};
interface FormResultType {
  resultTitle: string;
  resultKey: string;
  states?: any;
}
export const FormResult = ({ resultTitle, resultKey, states }: FormResultType) => (
  <View style={styles.formResultContainer}>
    <View style={[styles.formResultSection, styles.formResultHeader]}>
      <Text style={styles.plainText}>{resultTitle}</Text>
    </View>
    <View style={styles.formResultSection}>
      <Text style={styles.plainText}>{states[resultKey]['message'] ?? ''}</Text>
    </View>
  </View>
);

interface FormSelectedFieldProps {
  options: any;
  handleChangeValue?: any;
  label: string;
  fieldKey: string;
  states?: any;
  expandedSection?: any;
  setExpandedSection?: any;
}

export const FormSelectedField = ({
  expandedSection,
  setExpandedSection,
  fieldKey,
  states,
  options,
  handleChangeValue,
  label,
}: FormSelectedFieldProps) => {
  function handleSelectedLabels(key: string) {
    let valueList = states[fieldKey]['value'];
    if (key == 'NONE') valueList = ['NONE'];
    else if (valueList && valueList.includes(key)) valueList = valueList.filter((v: string) => v !== key);
    else valueList = [...valueList.filter((v: string) => v !== 'NONE'), key];

    if (valueList.length < 1) valueList = ['NONE'];
    handleChangeValue(fieldKey, [['value', valueList]]);
  }

  const toggleSection = (section: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedSection(expandedSection === section ? null : section);
  };

  const valueList = Array.isArray(states[fieldKey].value) ? states[fieldKey].value : [];

  return (
    <View key={fieldKey} style={styles.inputSection}>
      <TouchableOpacity style={styles.sectionToggleButton} onPress={() => toggleSection(fieldKey)}>
        <Text style={styles.inputLabel}>{label}</Text>
        <Ionicons name={expandedSection === fieldKey ? 'chevron-up' : 'chevron-down'} size={20} color="#666" />
      </TouchableOpacity>
      {expandedSection !== fieldKey ? (
        <Text style={styles.selectedSummaryText}>{valueList.map((key) => options[key]).join(', ')}</Text>
      ) : (
        <View style={styles.checkboxListContainer}>
          {Object.entries(options).map(([key, value]: any, index: number) => {
            const isSelected = states[fieldKey].value?.includes(key);
            return (
              <TouchableOpacity key={key} style={styles.checkboxRow} onPress={() => handleSelectedLabels(key)}>
                <MaterialCommunityIcons
                  style={styles.checkboxStyle}
                  name={isSelected ? 'checkbox-marked' : 'checkbox-blank-outline'}
                  size={24}
                />
                <Text style={styles.checkboxLabel}>{value}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
};
