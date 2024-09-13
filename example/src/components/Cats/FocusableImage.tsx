import React from 'react';
import { Image, ImageSourcePropType, StyleSheet } from 'react-native';
import {
  KeyboardExtendedBaseView,
  KeyboardFocus,
} from 'react-native-external-keyboard';

export const FocusableImage = React.forwardRef<
  KeyboardFocus,
  { source: ImageSourcePropType; width: string }
>(({ width, source }, ref) => {
  return (
    <KeyboardExtendedBaseView ref={ref} style={[styles.container, { width }]}>
      <Image source={source} style={styles.image} />
    </KeyboardExtendedBaseView>
  );
});

const styles = StyleSheet.create({
  container: { height: 150, padding: 1 },
  image: { width: '100%', height: 150 },
});
