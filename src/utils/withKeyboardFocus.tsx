import React, { useCallback, useMemo, type RefObject } from 'react';
import { View, type ViewProps } from 'react-native';
import { BaseKeyboardView } from '../components';
import type { KeyboardFocus, OnKeyPress } from '../types/BaseKeyboardView';
import { useFocusStyle } from './useFocusStyle';
import type {
  KeyboardPressType,
  WithKeyboardFocus,
  WithKeyboardFocusComponent,
} from '../types/WithKeyboardFocus';
import { useKeyboardPress } from './useKeyboardPress/useKeyboardPress';
import { IsViewFocusedContext } from '../context/IsViewFocusedContext';
import type { FocusViewProps } from '../types/KeyboardFocusView.types';

export const withKeyboardFocus = <
  ComponentProps extends object,
  ViewStyleType,
  ViewType = View
>(
  Component: WithKeyboardFocusComponent<ComponentProps>
) => {
  const WithKeyboardFocus = React.memo(
    React.forwardRef<
      View | KeyboardFocus,
      WithKeyboardFocus<ComponentProps, ViewStyleType, ViewType>
    >((allProps, ref) => {
      const {
        tintType = 'default',
        autoFocus,
        focusStyle,
        style,
        containerStyle,
        onFocusChange,
        onPress,
        onLongPress,
        onKeyUpPress,
        onKeyDownPress,
        onPressIn,
        onPressOut,
        group = false,
        haloEffect = true,
        canBeFocused = true,
        focusable = true,
        tintColor,
        onFocus,
        onBlur,
        containerFocusStyle,
        viewRef,
        componentRef,
        haloCornerRadius,
        haloExpendX,
        haloExpendY,
        groupIdentifier,
        withPressedStyle = false,
        triggerCodes,
        exposeMethods,
        screenAutoA11yFocus,
        screenAutoA11yFocusDelay = 300, // ToDo align with BaseKeyboardView
        orderIndex,
        orderGroup,
        orderId,
        orderLeft,
        orderRight,
        orderUp,
        orderDown,
        orderForward,
        orderBackward,
        orderFirst,
        orderLast,
        lockFocus,
        onComponentFocus,
        onComponentBlur,
        renderContent,
        renderFocusable,
        defaultFocusHighlightEnabled,
        ...props
      } = allProps as WithKeyboardFocus<ComponentProps, ViewStyleType>;

      const {
        focused,
        containerFocusedStyle,
        componentStyleViewStyle,
        onFocusChangeHandler,
      } = useFocusStyle({
        onFocusChange,
        focusStyle,
        containerFocusStyle,
        style,
        withPressedStyle,
        Component,
      });

      const withHaloEffect = tintType === 'default' && haloEffect;

      const { onKeyUpPressHandler, onKeyDownPressHandler, onPressHandler } =
        useKeyboardPress({
          onKeyUpPress,
          onKeyDownPress,
          onPress: onPress as (e?: OnKeyPress) => void,
          onLongPress: onLongPress as (e?: OnKeyPress) => void,
          onPressIn: onPressIn as (e?: OnKeyPress) => void,
          onPressOut: onPressOut as (e?: OnKeyPress) => void,
          triggerCodes,
        });

      const contentChildrenProp = useMemo(
        () =>
          renderContent
            ? (state: Record<string, unknown>) =>
                (
                  renderContent as unknown as (
                    s: Record<string, unknown>
                  ) => React.ReactNode
                )({ ...state, focused })
            : undefined,
        [renderContent, focused]
      );

      const focusableChildrenProp = useMemo(
        () => (renderFocusable ? renderFocusable({ focused }) : undefined),
        [renderFocusable, focused]
      );

      const focusOrderProps = {
        orderIndex,
        orderGroup,
        orderId,
        orderLeft,
        orderRight,
        orderUp,
        orderDown,
        orderForward,
        orderBackward,
        orderFirst,
        orderLast,
      };

      const onContextMenuHandler = useCallback(() => {
        (onLongPress as (e?: OnKeyPress) => void)?.();
      }, [onLongPress]);

      return (
        <IsViewFocusedContext.Provider value={focused}>
          <BaseKeyboardView
            style={[
              containerStyle as ViewProps['style'],
              containerFocusedStyle,
            ]}
            defaultFocusHighlightEnabled={defaultFocusHighlightEnabled}
            ref={ref as RefObject<KeyboardFocus>}
            viewRef={viewRef}
            onKeyUpPress={onKeyUpPressHandler}
            onKeyDownPress={onKeyDownPressHandler}
            onFocus={onFocus as FocusViewProps['onFocus']}
            onBlur={onBlur as FocusViewProps['onBlur']}
            onFocusChange={onFocusChangeHandler}
            onContextMenuPress={onContextMenuHandler}
            enableContextMenu={Boolean(onLongPress)}
            haloEffect={withHaloEffect}
            haloCornerRadius={haloCornerRadius}
            haloExpendX={haloExpendX}
            haloExpendY={haloExpendY}
            autoFocus={autoFocus}
            canBeFocused={canBeFocused}
            focusable={focusable}
            tintColor={tintColor}
            group={group}
            groupIdentifier={groupIdentifier}
            exposeMethods={exposeMethods}
            screenAutoA11yFocus={screenAutoA11yFocus}
            screenAutoA11yFocusDelay={screenAutoA11yFocusDelay}
            lockFocus={lockFocus}
            {...focusOrderProps}
          >
            <Component
              ref={componentRef}
              style={componentStyleViewStyle}
              onPress={
                onPressHandler as KeyboardPressType<ComponentProps>['onPress']
              }
              onLongPress={
                onLongPress as KeyboardPressType<ComponentProps>['onLongPress']
              }
              onPressIn={
                onPressIn as KeyboardPressType<ComponentProps>['onPressIn']
              }
              onPressOut={
                onPressOut as KeyboardPressType<ComponentProps>['onPressOut']
              }
              onFocus={onComponentFocus}
              onBlur={onComponentBlur}
              {...(props as unknown as ComponentProps)}
              {...((contentChildrenProp || focusableChildrenProp) &&
                ({
                  children: contentChildrenProp ?? focusableChildrenProp,
                } as unknown as Partial<ComponentProps>))}
            />
          </BaseKeyboardView>
        </IsViewFocusedContext.Provider>
      );
    })
  );

  const wrappedComponentName =
    (Component as any)?.displayName || (Component as any).name || 'Component';
  WithKeyboardFocus.displayName = `withKeyboardFocus(${wrappedComponentName})`;

  return WithKeyboardFocus;
};
