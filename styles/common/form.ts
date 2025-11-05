import { Padding, Color, Height, FontFamily, LineHeight, FontSize, Width, Gap } from '../GlobalStyles';
import { Dimensions, StyleSheet, View } from 'react-native';
import React from 'react';

export const formStyles = StyleSheet.create({
  formPageContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: Color.white,
  },
  formPageSection: {
    flexDirection: 'column',
    paddingHorizontal: 30,
    paddingBottom: 100,
    paddingVertical: 60,
    gap: 50,
  },
  formContentContainer: {
    flexDirection: 'column',
    gap: 50,
    justifyContent: 'center',
    paddingBottom: 30,
  },
  formFieldContainer: {
    position: 'relative',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    alignItems: 'stretch',
    zIndex: 100,
    marginBottom: 10,
  },
  formFieldSection: {
    position: 'relative',
    flexDirection: 'row',
    fontSize: 16,
    fontFamily: FontFamily.interRegular,
    paddingLeft: 5,
    paddingRight: 20,
    color: Color.gray02,
    borderBottomColor: Color.gray02,
    borderBottomWidth: 1,
    borderWidth: 0,
    borderRadius: 0,
    borderColor: Color.gray02,
  },
  formOptionListContainer: {
    borderColor: Color.gray02,
  },
  formFieldText: {
    flex: 1,
    color: Color.gray02,
    fontSize: FontSize.fs_16,
    fontFamily: FontFamily.interRegular,
  },
  formPlaceHolder: {
    top: 8,
    left: 8,
    position: 'absolute',
    pointerEvents: 'none',
  },
  formFieldIcon: {
    position: 'absolute',
    right: 20,
    bottom: 10,
  },
  formHelpText: {
    position: 'absolute',
    bottom: -20,
    left: 0,
  },
  successText: {
    color: Color.primary,
  },
  errorText: {
    color: Color.error01,
  },
  formButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: Color.black,
    borderRadius: 30,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: 'center',
    textAlign: 'center',
  },
  buttonText: {
    color: Color.white,
    fontSize: FontSize.fs_14,
  },
  formResultContainer: {
    flexDirection: 'column',
    borderColor: Color.gray02,
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  formResultSection: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formResultHeader: {
    backgroundColor: Color.secondary,
    borderColor: Color.gray02,
    borderBottomWidth: 1,
  },
  optionText: {
    fontSize: FontSize.fs_14,
  },
  plainText: {
    fontSize: FontSize.fs_16,
    color: Color.black,
  },
  formSelectedSection: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: 8,
  },
  formSelectedHeader: {
    flexDirection: 'row',
    width: '100%',
    gap: 5,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingLeft: 5,
  },
  formSelectedText: {
    flex: 1,
    paddingBottom: 5,
    fontSize: 16,
    color: Color.primary,
    fontFamily: FontFamily.interBold,
  },
  formSelectedIcon: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    fontFamily: FontFamily.interBold,
    fontSize: 24,
  },
  formSelectedOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  formLabelOption: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 50,
  },
  formSelectedLabel: {
    backgroundColor: Color.primary,
    color: Color.white,
  },
  formUnSelectedLabel: {
    backgroundColor: Color.white,
    color: Color.primary,
  },
  selectedText: {
    color: Color.white,
  },

  unselectedText: {
    color: Color.primary,
  },
  inputLabel: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  selectedSummaryText: { marginTop: 8, color: '#666' },
  checkboxListContainer: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  inputSection: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    elevation: 1,
  },
  sectionToggleButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: Dimensions.get('window').width / 2 - 30,
    marginBottom: 12,
  },
  checkboxLabel: { marginLeft: 8, color: '#333' },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkboxStyle: {
    color: Color.primary,
  },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
