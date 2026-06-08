import { StyleSheet, Text, type ViewStyle } from 'react-native';
import { Pressable } from 'react-native-external-keyboard';
import { ANDROID_FOCUS_STYLE } from '../../constants/styles';

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
      onFocus={onFocus}
      onBlur={onBlur}
      containerStyle={[styles.container, style as undefined]} //Update type
      onPress={onPress}
      autoFocus={autoFocus}
      style={styles.content}
      haloCornerRadius={8}
      defaultFocusHighlightEnabled={false}
      focusStyle={ANDROID_FOCUS_STYLE}
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
    height: 45,
    paddingHorizontal: 10,
    paddingVertical: 5,
    justifyContent: 'center',
  },
});
