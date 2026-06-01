import { useCallback, useMemo } from 'react';
import type { PressableProps } from 'react-native';
import { useFocusStyle } from './useFocusStyle';
import { useKeyboardPress } from './useKeyboardPress/useKeyboardPress';
import { useKeyboardPressState } from './useKeyboardPressState';
import type { FocusStyle, OnKeyPressFn } from '../types';

type AnyPressHandler = (event?: any) => void;

export type UseKeyboardFocusContainerProps<
  TPress extends AnyPressHandler = AnyPressHandler,
  TKeyOnlyPress extends AnyPressHandler = AnyPressHandler
> = {
  focusStyle?: FocusStyle;
  containerFocusStyle?: FocusStyle;
  onFocusChange?: (isFocused: boolean) => void;
  style?: PressableProps['style'];
  pressedStyleSignature?: boolean;
  onKeyUpPress?: OnKeyPressFn;
  onKeyDownPress?: OnKeyPressFn;
  onPress?: TPress;
  onLongPress?: TPress;
  onPressIn?: TKeyOnlyPress;
  onPressOut?: TKeyOnlyPress;
  triggerCodes?: number[];
  androidKeyboardPressState?: boolean;
};

export const useKeyboardFocusContainer = <
  TPress extends AnyPressHandler = AnyPressHandler,
  TKeyOnlyPress extends AnyPressHandler = AnyPressHandler
>({
  focusStyle,
  containerFocusStyle,
  onFocusChange,
  style,
  pressedStyleSignature,
  onKeyUpPress,
  onKeyDownPress,
  onPress,
  onLongPress,
  onPressIn,
  onPressOut,
  triggerCodes,
  androidKeyboardPressState = false,
}: UseKeyboardFocusContainerProps<TPress, TKeyOnlyPress>) => {
  const keyboardPress = useKeyboardPressState({
    enabled: androidKeyboardPressState,
    onPressIn,
    onPressOut,
    onFocusChange,
  });

  const {
    focused,
    containerFocusedStyle,
    componentStyleViewStyle,
    onFocusChangeHandler,
  } = useFocusStyle({
    onFocusChange: keyboardPress.onFocusChange,
    focusStyle,
    containerFocusStyle,
    style,
    pressedStyleSignature,
  });

  const { onKeyUpPressHandler, onKeyDownPressHandler, onPressHandler } =
    useKeyboardPress({
      onKeyUpPress,
      onKeyDownPress,
      onPress,
      onLongPress,
      onPressIn: keyboardPress.onPressIn as typeof onPressIn,
      onPressOut: keyboardPress.onPressOut as typeof onPressOut,
      triggerCodes,
    });

  const { applyPressedStyle } = keyboardPress;
  const componentStyle = useMemo(
    () => applyPressedStyle(componentStyleViewStyle),
    [applyPressedStyle, componentStyleViewStyle]
  );

  const onContextMenuHandler = useCallback(() => {
    onLongPress?.();
  }, [onLongPress]);

  const enableContextMenu = Boolean(onLongPress);

  return {
    focused,
    keyboardPressed: keyboardPress.pressed,
    containerFocusedStyle,
    componentStyleViewStyle: componentStyle,
    onFocusChangeHandler,
    onKeyUpPressHandler,
    onKeyDownPressHandler,
    onPressHandler,
    onContextMenuHandler,
    enableContextMenu,
  };
};
