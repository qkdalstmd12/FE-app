import React from 'react';
import { StyleSheet, View } from 'react-native';

interface OverlayProps {
  children: React.ReactNode;
  style?: object;
}
const Overlay: React.FC<OverlayProps> = ({ children, style }) => (
  <View style={[styles.overlay, style]}>
    {/* 배경은 터치 이벤트 받도록 */}
    <View style={styles.background} pointerEvents="auto" />
    {/* children은 터치 이벤트 투과 */}
    <View style={styles.centered} pointerEvents="box-none">
      {children}
    </View>
  </View>
);

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 51,
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
});

export default Overlay;
