import React from 'react';
import { Image, ImageSourcePropType, Platform, StyleSheet } from 'react-native';
import {
  Pressable,
  KeyboardFocus,
  TintType,
} from 'react-native-external-keyboard';

const tinyType: TintType | undefined = Platform.select({
  android: 'hover',
  default: undefined,
});

export const FocusableImage = React.forwardRef<
  KeyboardFocus,
  { source: ImageSourcePropType; width: string }
>(({ width, source }, ref) => {
  return (
    <Pressable
      ref={ref}
      tintType={tinyType}
      tintColor="#ffffff"
      containerStyle={[styles.container, { width }]}
    >
      <Image source={source} style={styles.image} />
    </Pressable>
  );
});

const styles = StyleSheet.create({
  container: { height: 150, padding: 1 },
  image: { width: '100%', height: 150 },
});
