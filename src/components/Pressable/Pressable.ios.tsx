import React, { useMemo, useState, useRef, useImperativeHandle } from 'react';
import type { GestureResponderEvent, PressableProps, View } from 'react-native';

// @ts-ignore: import from origin pressable
import { normalizeRect } from 'react-native/Libraries/StyleSheet/Rect';
// @ts-ignore: import from origin pressable
import usePressability from 'react-native/Libraries/Pressability/usePressability';
// @ts-ignore: import from origin pressable
import useAndroidRippleForView from 'react-native/Libraries/Components/Pressable/useAndroidRippleForView';

import { KeyboardFocusView } from '../KeyboardFocusView';
import type { OnKeyPressFn, KeyboardFocusViewProps } from '../../types';

export type SyntheticEvent<T> = {
  bubbles?: boolean;
  cancelable?: boolean;
  currentTarget: number | unknown;
  defaultPrevented?: boolean;
  dispatchConfig: {
    registrationName: string;
  };
  eventPhase?: number;
  preventDefault: () => void;
  isDefaultPrevented: () => boolean;
  stopPropagation: () => void;
  isPropagationStopped: () => boolean;
  isTrusted?: boolean;
  nativeEvent: T;
  persist: () => void;
  target?: number | unknown;
  timeStamp: number;
  type?: string;
};

export type ResponderSyntheticEvent<T> = SyntheticEvent<T> & {
  touchHistory: {
    indexOfSingleActiveTouch: number;
    mostRecentTimeStamp: number;
    numberActiveTouches: number;
    touchBank: Array<{
      touchActive: boolean;
      startPageX: number;
      startPageY: number;
      startTimeStamp: number;
      currentPageX: number;
      currentPageY: number;
      currentTimeStamp: number;
      previousPageX: number;
      previousPageY: number;
      previousTimeStamp: number;
    }>;
  };
};

export type PressEvent = ResponderSyntheticEvent<{
  force?: number;
  identifier: number;
  locationX: number;
  locationY: number;
  pageX: number;
  pageY: number;
  target?: number;
  timestamp: number;
}>;

type CombinedPressEvent = GestureResponderEvent | PressEvent;

type NAProps = {
  'onPressOut': (event: CombinedPressEvent) => void;
  'onPressIn': (event: CombinedPressEvent) => void;
  'aria-live'?: 'polite' | 'assertive' | 'off';
  'aria-busy'?: boolean;
  'aria-checked'?: boolean;
  'aria-disabled'?: boolean;
  'aria-expanded'?: boolean;
  'aria-label'?: string;
  'aria-selected'?: boolean;
  'aria-valuemax'?: number;
  'aria-valuemin'?: number;
  'aria-valuenow'?: number;
  'aria-modal'?: boolean;
  'aria-valuetext'?: string;
};

type Props = PressableProps &
  NAProps &
  KeyboardFocusViewProps & {
    unstable_pressDelay?: number;
    delayHoverIn: unknown;
    delayHoverOut: unknown;
    onHoverIn: unknown;
    onHoverOut: unknown;
  };

const IOS_SPACE_KEY_CODE = 44;

export const Pressable = React.memo(
  React.forwardRef<View, Props>((props: Props, forwardedRef) => {
    const {
      accessibilityState,
      'aria-live': ariaLive,
      android_disableSound,
      android_ripple,
      'aria-busy': ariaBusy,
      'aria-checked': ariaChecked,
      'aria-disabled': ariaDisabled,
      'aria-expanded': ariaExpanded,
      'aria-label': ariaLabel,
      'aria-selected': ariaSelected,
      cancelable,
      children,
      delayHoverIn,
      delayHoverOut,
      delayLongPress,
      disabled,
      focusable,
      onHoverIn,
      onHoverOut,
      onLongPress,
      onPress,
      onPressIn,
      onPressOut,
      pressRetentionOffset,
      style,
      testOnly_pressed,
      unstable_pressDelay,
      canBeFocused,
      onFocusChange,
      ...restProps
    } = props;

    const viewRef = useRef<View>(null);
    useImperativeHandle(forwardedRef, () => viewRef.current as View);

    const hitSlop = normalizeRect(restProps?.hitSlop);

    const android_rippleConfig = useAndroidRippleForView(
      android_ripple,
      viewRef
    );

    const [pressed, setPressed] = usePressState(testOnly_pressed === true);

    let _accessibilityState = {
      busy: ariaBusy ?? accessibilityState?.busy,
      checked: ariaChecked ?? accessibilityState?.checked,
      disabled: ariaDisabled ?? accessibilityState?.disabled,
      expanded: ariaExpanded ?? accessibilityState?.expanded,
      selected: ariaSelected ?? accessibilityState?.selected,
    };

    _accessibilityState =
      disabled != null
        ? { ..._accessibilityState, disabled }
        : _accessibilityState;

    const accessibilityValue = {
      max: props['aria-valuemax'] ?? props.accessibilityValue?.max,
      min: props['aria-valuemin'] ?? props.accessibilityValue?.min,
      now: props['aria-valuenow'] ?? props.accessibilityValue?.now,
      text: props['aria-valuetext'] ?? props.accessibilityValue?.text,
    };

    const accessibilityLiveRegion =
      ariaLive === 'off' ? 'none' : ariaLive ?? props.accessibilityLiveRegion;

    const accessibilityLabel = ariaLabel ?? props.accessibilityLabel;
    const restPropsWithDefaults = {
      ...restProps,
      ...android_rippleConfig?.viewProps,
      accessibilityState: _accessibilityState,
      accessibilityValue,
      accessibilityViewIsModal:
        restProps['aria-modal'] ?? restProps.accessibilityViewIsModal,
      accessibilityLiveRegion,
      accessibilityLabel,
      focusable: focusable !== false,
      hitSlop,
    };

    const config = useMemo(
      () => ({
        cancelable,
        disabled,
        hitSlop,
        pressRectOffset: pressRetentionOffset,
        android_disableSound,
        delayHoverIn,
        delayHoverOut,
        delayLongPress,
        delayPressIn: unstable_pressDelay,
        onHoverIn,
        onHoverOut,
        onLongPress,
        onPress,
        onPressIn(event: GestureResponderEvent | PressEvent): void {
          if (android_rippleConfig != null) {
            android_rippleConfig.onPressIn(event);
          }
          setPressed(true);
          if (onPressIn != null) {
            onPressIn(event);
          }
        },
        onPressMove: android_rippleConfig?.onPressMove,
        onPressOut(event: GestureResponderEvent | PressEvent): void {
          if (android_rippleConfig != null) {
            android_rippleConfig.onPressOut(event);
          }
          setPressed(false);
          if (onPressOut != null) {
            onPressOut(event);
          }
        },
      }),
      [
        android_disableSound,
        android_rippleConfig,
        cancelable,
        delayHoverIn,
        delayHoverOut,
        delayLongPress,
        disabled,
        hitSlop,
        onHoverIn,
        onHoverOut,
        onLongPress,
        onPress,
        onPressIn,
        onPressOut,
        pressRetentionOffset,
        setPressed,
        unstable_pressDelay,
      ]
    );
    const eventHandlers = usePressability(config);

    const onKeyUpPress = React.useCallback<OnKeyPressFn>(
      (e) => {
        if (e.nativeEvent.keyCode === IOS_SPACE_KEY_CODE) {
          config?.onPressOut?.(e as unknown as GestureResponderEvent);
          if (e.nativeEvent.isLongPress) {
            onLongPress?.(e);
          } else {
            onPress?.(e);
          }
        }
      },
      [onLongPress, onPress, config]
    );

    const onKeyDownPress = React.useCallback<OnKeyPressFn>(
      (e) => {
        if (e.nativeEvent.keyCode === IOS_SPACE_KEY_CODE) {
          config?.onPressIn?.(e as unknown as GestureResponderEvent);
        }
      },
      [config]
    );

    return (
      <KeyboardFocusView
        {...restPropsWithDefaults}
        {...eventHandlers}
        canBeFocused={canBeFocused}
        onFocusChange={onFocusChange}
        onKeyUpPress={onKeyUpPress}
        onKeyDownPress={onKeyDownPress}
        onContextMenuPress={onLongPress}
        ref={viewRef}
        style={typeof style === 'function' ? style({ pressed }) : style}
        collapsable={false}
      >
        {typeof children === 'function' ? children({ pressed }) : children}
      </KeyboardFocusView>
    );
  })
);

function usePressState(forcePressed: boolean): [boolean, (v: boolean) => void] {
  const [pressed, setPressed] = useState(false);
  return [pressed || forcePressed, setPressed];
}
