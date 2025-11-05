import { Color, FontFamily, FontSize, LineHeight, Gap, Padding, Height, Width } from '@/styles/GlobalStyles';
import { StyleSheet } from 'react-native';

export const mainStyles = StyleSheet.create({
  safeareaview: {
    flex: 1,
    backgroundColor: '#fff',
  },
  viewBg: {
    backgroundColor: Color.white,
    flex: 1,
  },
  parentFlexBox: {
    flexDirection: 'row',
    overflow: 'hidden',
  },
  buttonFlexBox: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  // 컨테이너

  view: {
    width: '100%',
    height: 917,
    paddingHorizontal: 40,
    paddingVertical: 233,
    overflow: 'hidden',
  },
  frameParent: {
    gap: Gap.gap_10,
    alignSelf: 'stretch',
    overflow: 'hidden',
  },
  frameGroup: {
    gap: 18,
    alignSelf: 'stretch',
  },
  logoSection: {
    gap: 10,
    flexDirection: 'column',
  },
  logo: {
    fontSize: 48,
    lineHeight: 70,
    fontFamily: FontFamily.lemonRegular,
    color: Color.primary,
    textAlign: 'left',
    alignSelf: 'stretch',
  },
  logo_subtext: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: FontFamily.interBold,
    color: Color.black,
    lineHeight: 30,
    borderStyle: 'solid',
    textAlign: 'left',
    alignSelf: 'stretch',
  },
  frameContainer: {
    flexWrap: 'wrap',
    alignContent: 'flex-start',
    gap: Gap.gap_10,
  },
  wrapper: {
    borderRadius: 50,
    backgroundColor: Color.secondary,
    paddingHorizontal: Padding.padding_10,
    paddingVertical: Padding.padding_10,
    overflow: 'hidden',
    flex: 1,
  },
  safeareaviewText: {
    fontSize: FontSize.fs_12,
    fontWeight: '500',
    fontFamily: FontFamily.interMedium,
    textAlign: 'center',
    color: Color.black,
  },
  button: {
    borderRadius: 12,
    backgroundColor: Color.primary,
    paddingHorizontal: 98,
    paddingVertical: 18,
    alignSelf: 'stretch',
  },
  button_text: {
    width: 111,
    height: 24,
    lineHeight: 16,
    fontFamily: FontFamily.notoSansKRRegular,
    color: Color.white,
    fontSize: FontSize.fs_16,
    textAlign: 'center',
  },
  parent: {
    // alignSelf: 'flex-start',
    // gap: 16,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  linkBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textTypo: {
    fontFamily: FontFamily.interRegular,
    fontSize: FontSize.fs_12,
    textAlign: 'center',
    color: Color.black,
    lineHeight: LineHeight.lh_24,
    flex: 1,
    // borderWidth: 1,
  },
  frameChild: {
    height: Height.height_19,
    width: Width.width_1,
    borderStyle: 'solid',
    borderColor: Color.black,
    borderRightWidth: 1,
  },
});
