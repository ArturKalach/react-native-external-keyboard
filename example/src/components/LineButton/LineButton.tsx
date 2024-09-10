import React from 'react';
import { View } from 'react-native';
import { StyleSheet, Text, ViewStyle } from 'react-native';
import { Pressable } from 'react-native-external-keyboard';

export type LineButtonProps = {
  title: string;
  onPress?: () => void;
  onLongPress?: () => void;
  style?: ViewStyle;
  onFocus?: () => void;
  onBlur?: () => void;
};

export const LineButton = ({
  title,
  onPress,
  onLongPress,
  style,
  onFocus,
  onBlur,
}: LineButtonProps) => {
  return (
    <Pressable
      haloEffect={false}
      onFocus={onFocus}
      onBlur={onBlur}
      style={[styles.container, style]}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      <View style={styles.content}>
        <Text>{title}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 15,
  },
  content: {
    height: 45,
    paddingHorizontal: 10,
    paddingVertical: 5,
    justifyContent: 'center',
  },
});
