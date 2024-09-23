import React, { useCallback, useMemo } from 'react';
import { View, Platform, StyleSheet } from 'react-native';
import type { KeyboardFocusViewProps } from '../../types/KeyboardFocusView.types';
import { BaseKeyboardView } from '../BaseKeyboardView/BaseKeyboardView';
import type {
  BaseKeyboardViewType,
  KeyboardFocus,
} from '../../types/BaseKeyboardView';
import { A11yModule } from '../../services';
import type { TintType } from '../../types/WithKeyboardFocus';
import {
  RenderProp,
  RenderPropComponent,
} from '../RenderPropComponent/RenderPropComponent';
import { useFocusStyle } from '../../utils/useFocusStyle';
import { useKeyboardPress } from '../../utils/useKeyboardPress/useKeyboardPress';
import { IsViewFocusedContext } from '../../context/IsViewFocusedContext';
//ToDo RNCEKV-DEPRICATED-0
const setCurrentFocusTag = (tag: number | undefined) => {
  A11yModule.currentFocusedTag = tag;
};

export const KeyboardFocusView = React.forwardRef<
  BaseKeyboardViewType | KeyboardFocus,
  KeyboardFocusViewProps & {
    tintType?: TintType;
    FocusHoverComponent?: RenderProp;
  }
>(
  (
    {
      tintType = 'default',
      autoFocus,
      focusStyle,
      style,
      onFocusChange,
      onPress,
      onLongPress,
      onKeyUpPress,
      onKeyDownPress,
      group = false,
      haloEffect = true,
      canBeFocused = true,
      focusable = true,
      tintColor,
      onFocus,
      onBlur,
      FocusHoverComponent,
      children,
      ...props
    },
    ref
  ) => {
    //ToDo RNCEKV-DEPRICATED-0
    const onIOSFocusHandler = useCallback(
      (isFocused: boolean, tag?: number) => {
        setCurrentFocusTag(tag);
        onFocusChange?.(isFocused);
      },
      [onFocusChange]
    );

    //ToDo RNCEKV-DEPRICATED-0
    const onFocusHandler = Platform.select({
      ios: onIOSFocusHandler,
      android: onFocusChange,
    });

    const { focused, containerFocusedStyle, onFocusChangeHandler, hoverColor } =
      useFocusStyle({
        onFocusChange: onFocusHandler,
        tintColor,
        containerFocusStyle: focusStyle,
        tintType,
      });

    const withHaloEffect = tintType === 'default' && haloEffect;

    const { onKeyUpPressHandler, onKeyDownPressHandler } = useKeyboardPress({
      onKeyUpPress,
      onKeyDownPress,
      onPress,
      onLongPress,
    });

    const HoverComonent = useMemo(() => {
      if (FocusHoverComponent) return FocusHoverComponent;
      if (tintType === 'hover')
        return <View style={[hoverColor, styles.absolute, styles.opacity]} />;

      return undefined;
    }, [FocusHoverComponent, hoverColor, tintType]);

    return (
      <IsViewFocusedContext.Provider value={focused}>
        <BaseKeyboardView
          style={[style, containerFocusedStyle]}
          ref={ref}
          onKeyUpPress={onKeyUpPressHandler}
          onKeyDownPress={onKeyDownPressHandler}
          onFocus={onFocus}
          onBlur={onBlur}
          onFocusChange={onFocusChangeHandler}
          onContextMenuPress={onLongPress}
          haloEffect={withHaloEffect}
          autoFocus={autoFocus}
          canBeFocused={canBeFocused}
          focusable={focusable}
          tintColor={tintColor}
          group={group}
          {...props}
        >
          {children}
          {focused && HoverComonent && (
            <RenderPropComponent render={HoverComonent} />
          )}
        </BaseKeyboardView>
      </IsViewFocusedContext.Provider>
    );
  }
);

const styles = StyleSheet.create({
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  opacity: {
    opacity: 0.3,
  },
});
