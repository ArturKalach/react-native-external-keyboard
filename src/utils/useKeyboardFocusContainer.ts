import { useCallback, useMemo } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { useFocusStyle } from './useFocusStyle';
import { useKeyboardPress } from './useKeyboardPress/useKeyboardPress';
import { useKeyboardPressState } from './useKeyboardPressState';
import type { ValueStore } from './useValueStore';
import type {
  FocusStyle,
  InteractiveStyleProp,
  OnKeyPress,
  OnKeyPressFn,
} from '../types';

type AnyPressHandler = (event?: any) => void;

export type UseKeyboardFocusContainerProps<
  TPress extends AnyPressHandler = AnyPressHandler,
  TKeyOnlyPress extends AnyPressHandler = AnyPressHandler,
> = {
  focusStyle?: FocusStyle;
  containerFocusStyle?: FocusStyle;
  onFocusChange?: (isFocused: boolean) => void;
  style?: InteractiveStyleProp;
  pressedStyleSignature?: boolean;
  /** Re-render on focus change (default `true`). See {@link useFocusStyle}. */
  reactToFocus?: boolean;
  onKeyUpPress?: OnKeyPressFn;
  onKeyDownPress?: OnKeyPressFn;
  onPress?: TPress;
  onLongPress?: TPress;
  onPressIn?: TKeyOnlyPress;
  onPressOut?: TKeyOnlyPress;
  triggerCodes?: number[];
  androidKeyboardPressState?: boolean;
};

/** Return value of {@link useKeyboardFocusContainer}. */
export type UseKeyboardFocusContainerResult<
  TPress extends AnyPressHandler = AnyPressHandler,
> = {
  focused: boolean;
  focusStore: ValueStore;
  keyboardPressed: boolean;
  containerFocusedStyle: StyleProp<ViewStyle>;
  componentStyleViewStyle: InteractiveStyleProp;
  onFocusChangeHandler: (isFocused: boolean) => void;
  onKeyUpPressHandler: (e: OnKeyPress) => void;
  onKeyDownPressHandler: OnKeyPressFn | undefined;
  onPressHandler: TPress | undefined;
  onContextMenuHandler: () => void;
  enableContextMenu: boolean;
};

export const useKeyboardFocusContainer = <
  TPress extends AnyPressHandler = AnyPressHandler,
  TKeyOnlyPress extends AnyPressHandler = AnyPressHandler,
>({
  focusStyle,
  containerFocusStyle,
  onFocusChange,
  style,
  pressedStyleSignature,
  reactToFocus,
  onKeyUpPress,
  onKeyDownPress,
  onPress,
  onLongPress,
  onPressIn,
  onPressOut,
  triggerCodes,
  androidKeyboardPressState = false,
}: UseKeyboardFocusContainerProps<
  TPress,
  TKeyOnlyPress
>): UseKeyboardFocusContainerResult<TPress> => {
  const keyboardPress = useKeyboardPressState({
    enabled: androidKeyboardPressState,
    onPressIn,
    onPressOut,
    onFocusChange,
  });

  const {
    focused,
    focusStore,
    containerFocusedStyle,
    componentStyleViewStyle,
    onFocusChangeHandler,
  } = useFocusStyle({
    onFocusChange: keyboardPress.onFocusChange,
    focusStyle,
    containerFocusStyle,
    style,
    pressedStyleSignature,
    reactToFocus,
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
    focusStore,
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
