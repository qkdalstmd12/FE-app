import { StyleSheet } from 'react-native';
import { Color, FontFamily, FontSize } from '@/styles/GlobalStyles';

export const HeaderNavStyles = StyleSheet.create({
  headerContainer: {
    paddingTop: 20,
    paddingHorizontal: 10,
    paddingBottom: 20,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  headerSection: {
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  headerIcon: {
    position: 'absolute',
    left: 10,
    zIndex: 1,
  },
  headerText: {
    flex: 1,
    fontFamily: FontFamily.interMedium,
    fontSize: FontSize.fs_20,
    textAlign: 'center',
  },
  headerLogoSection: {
    paddingLeft: 20,
  },
  headerLogoText: {
    fontFamily: FontFamily.lemonRegular,
    color: Color.primary,
    fontSize: 32,
  },
  headerSubText: {
    fontFamily: FontFamily.interMedium,
    color: Color.primary,
    flex: 1,
    textAlign: 'left',
  },
});
