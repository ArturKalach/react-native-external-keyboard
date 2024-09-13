import React from 'react';
import { StyleSheet, Text, ViewStyle } from 'react-native';
import { Pressable } from 'react-native-external-keyboard';

export type LineButtonProps = {
  title: string;
  onPress?: () => void;
  onLongPress?: () => void;
  style?: ViewStyle;
  onFocus?: () => void;
  onBlur?: () => void;
  autoFocus?: boolean;
};

export const LineButton = ({
  title,
  onPress,
  onLongPress,
  style,
  onFocus,
  onBlur,
  autoFocus,
}: LineButtonProps) => {
  return (
    <Pressable
      haloEffect={false}
      onFocus={onFocus}
      onBlur={onBlur}
      containerStyle={[styles.container, style]}
      onPress={onPress}
      autoFocus={autoFocus}
      style={styles.content}
      tintBackground="#dce3f9"
      onLongPress={onLongPress}
    >
      <Text>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 15,
  },
  content: {
    // width: '100%',
    height: 45,
    paddingHorizontal: 10,
    paddingVertical: 5,
    justifyContent: 'center',
  },
});
