import React from 'react';
import {
  Image,
  type ImageSourcePropType,
  type DimensionValue,
  Platform,
  StyleSheet,
  Text,
} from 'react-native';
import {
  Pressable,
  type KeyboardFocus,
  type TintType,
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
      tintColor="red"
      containerStyle={[
        styles.container,
        // { width: width as DimensionValue | undefined },
      ]}
    >
      <Text>1232313</Text>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  container: { height: 50 },
  image: { width: '100%', height: 150 },
});
