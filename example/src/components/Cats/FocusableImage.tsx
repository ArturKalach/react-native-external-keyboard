import React from 'react';
import {
  Image,
  type ImageSourcePropType,
  type DimensionValue,
  StyleSheet,
} from 'react-native';
import { Pressable, type KeyboardFocus } from 'react-native-external-keyboard';

export const FocusableImage = React.forwardRef<
  KeyboardFocus,
  { source: ImageSourcePropType; width: string }
>(({ width, source }, ref) => {
  return (
    <Pressable
      ref={ref}
      containerStyle={[
        styles.container,
        { width: width as DimensionValue | undefined },
      ]}
    >
      <Image source={source} style={styles.image} />
    </Pressable>
  );
});

const styles = StyleSheet.create({
  container: { height: 150, padding: 1 },
  image: { width: '100%', height: 150 },
});
