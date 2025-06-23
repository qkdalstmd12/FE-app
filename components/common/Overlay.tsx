import React from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';

interface OverlayProps {
  children: React.ReactNode;
  onPressOutside?: () => void;
  style?: object;
}

const Overlay: React.FC<OverlayProps> = ({ children, onPressOutside, style }) => (
  <View style={[styles.overlay, style]}>
    <TouchableWithoutFeedback onPress={onPressOutside}>
      <View style={styles.background} />
    </TouchableWithoutFeedback>
    <View style={styles.centered}>{children}</View>
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
