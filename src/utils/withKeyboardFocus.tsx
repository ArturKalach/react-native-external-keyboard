import React, { type RefObject, useCallback, useState } from 'react';
import { View } from 'react-native';
import { BaseKeyboardView } from '../components';
import type {
  BaseKeyboardViewType,
  KeyboardPressType,
  OnKeyPress,
  WithKeyboardFocusProps,
  KeyboardFocusableComponent,
} from '../types';
import { useKeyboardFocusContainer } from './useKeyboardFocusContainer';
import { useRenderedChildren } from './useRenderedChildren';
import { useContainerStyle } from './useContainerStyle';
import { IsViewFocusedContext } from '../context/IsViewFocusedContext';
import { IsViewPressedContext } from '../context/IsViewPressedContext';
import { useValueStore } from './useValueStore';

/**
 * HOC that adds physical keyboard focus to a Pressable-like component. Renders
 * `BaseKeyboardView` as the focus host and threads press/focus/order props
 * through it.
 *
 * The wrapper splits the incoming props in two: focus/order/halo props drive the
 * `BaseKeyboardView` host, while the leftover props (`componentProps`) plus the
 * press and focus handlers go to the wrapped `Component`.
 */
export const withKeyboardFocus = <
  ComponentProps extends object,
  ViewStyleType,
  ViewType = View
>(
  Component: KeyboardFocusableComponent<ComponentProps>
) => {
  const WithKeyboardFocus = React.memo(
    React.forwardRef<
      BaseKeyboardViewType | View,
      WithKeyboardFocusProps<ComponentProps, ViewStyleType, ViewType>
    >((allProps, ref) => {
      const {
        // ── consumed by this wrapper / forwarded to the wrapped component ──
        focusStyle,
        style,
        containerStyle,
        containerFocusStyle,
        withPressedStyle,
        onPress,
        onLongPress,
        onKeyUpPress,
        onKeyDownPress,
        onPressIn,
        onPressOut,
        triggerCodes,
        androidKeyboardPressState,
        componentRef,
        onComponentFocus,
        onComponentBlur,
        renderContent,
        renderFocusable,
        children: userChildren,
        // ── forwarded to the BaseKeyboardView focus host ──
        autoFocus,
        focusableWrapper = true,
        haloEffect = true,
        focusable = true,
        tintColor,
        tintType,
        onFocus,
        onBlur,
        onFocusChange,
        groupIdentifier,
        haloCornerRadius,
        haloExpendX,
        haloExpendY,
        screenAutoA11yFocus,
        screenAutoA11yFocusDelay,
        lockFocus,
        defaultFocusHighlightEnabled,
        roundedHaloFix,
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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        enableA11yFocus: _enableA11yFocus,
        ...componentProps
      } = allProps as WithKeyboardFocusProps<ComponentProps, ViewStyleType> & {
        children?: React.ReactNode;
      };

      // Per-instance press store — updated on every press in/out (touch AND
      // physical keyboard, both flow through the handlers below). Descendants
      // read it via `useIsViewPressed` and re-render WITHOUT re-rendering this
      // host. Updating a store with no subscribers is effectively free.
      const pressController = useValueStore();

      // Track touch press in host state ONLY when a function-form `containerStyle`
      // consumes it — this re-renders the host (legacy path). The press store
      // above covers the no-re-render case for descendants.
      const trackTouchPress = typeof containerStyle === 'function';
      const [touchPressed, setTouchPressed] = useState(false);

      const handlePressIn = useCallback(
        (e?: OnKeyPress) => {
          pressController.set(true);
          if (trackTouchPress) setTouchPressed(true);
          (onPressIn as ((e?: OnKeyPress) => void) | undefined)?.(e);
        },
        [trackTouchPress, onPressIn, pressController]
      );
      const handlePressOut = useCallback(
        (e?: OnKeyPress) => {
          pressController.set(false);
          if (trackTouchPress) setTouchPressed(false);
          (onPressOut as ((e?: OnKeyPress) => void) | undefined)?.(e);
        },
        [trackTouchPress, onPressOut, pressController]
      );

      // Only re-render this host on focus when something here actually depends on
      // `focused`. Otherwise the native halo shows focus and descendants that read
      // `useIsViewFocused` update via the focus store — no host re-render needed.
      const reactToFocus = Boolean(
        focusStyle ||
          containerFocusStyle ||
          renderContent ||
          renderFocusable ||
          typeof style === 'function' ||
          typeof containerStyle === 'function'
      );

      // Auto-enable the pressed-style path when `style` is a function; honor an
      // explicit (deprecated) `withPressedStyle` override otherwise.
      const pressedStyleSignature =
        withPressedStyle ?? typeof style === 'function';

      // Android: physical keyboard activation (Enter / Space / DPad-center) never
      // reaches the touch responder, so it can't drive: a function `style` /
      // `containerStyle` `pressed`, OR the wrapped Pressable's own native
      // `pressed` render-prop (via `renderContent` / function `children`) — that
      // value comes straight from RN's touch-only Pressability state unless we
      // thread our own `keyboardPressed` into it (see `useRenderedChildren`).
      // Auto-enable key-driven press tracking whenever any of those surfaces
      // exist, so keyboard press behaves the same as touch everywhere. An
      // explicit `androidKeyboardPressState` wins. (No-op on iOS; the press
      // store below always reflects keyboard press regardless of platform.)
      const hasPressedRenderProp =
        Boolean(renderContent) || typeof userChildren === 'function';
      const resolvedAndroidKeyboardPressState =
        androidKeyboardPressState ??
        (pressedStyleSignature || trackTouchPress || hasPressedRenderProp);

      const {
        focused,
        focusStore,
        keyboardPressed,
        containerFocusedStyle,
        componentStyleViewStyle,
        onFocusChangeHandler,
        onKeyUpPressHandler,
        onKeyDownPressHandler,
        onPressHandler,
        onContextMenuHandler,
        enableContextMenu,
      } = useKeyboardFocusContainer({
        onFocusChange,
        focusStyle,
        containerFocusStyle,
        style,
        pressedStyleSignature,
        reactToFocus,
        onKeyUpPress,
        onKeyDownPress,
        onPress: onPress as (e?: OnKeyPress) => void,
        onLongPress: onLongPress as (e?: OnKeyPress) => void,
        onPressIn: handlePressIn,
        onPressOut: handlePressOut,
        triggerCodes,
        androidKeyboardPressState: resolvedAndroidKeyboardPressState,
      });

      // Unified press state for the container: touch (tracked above) or keyboard.
      const pressed = touchPressed || keyboardPressed;

      // Clear a stuck press if focus leaves before the matching pressOut arrives
      // (e.g. focus moved programmatically while a key was held). Resets the
      // press store so `useIsViewPressed` consumers don't stay pressed.
      const handleFocusChange = useCallback(
        (isFocused: boolean) => {
          if (!isFocused) pressController.set(false);
          onFocusChangeHandler(isFocused);
        },
        [onFocusChangeHandler, pressController]
      );

      const childContent = useRenderedChildren({
        focused,
        keyboardPressed,
        renderContent: renderContent as unknown as (
          state: Record<string, unknown>
        ) => React.ReactNode,
        renderFocusable,
        children: userChildren,
      });

      const containerStyleArr = useContainerStyle({
        containerStyle,
        containerFocusedStyle,
        pressed,
        focused,
      });

      return (
        <IsViewFocusedContext.Provider value={focusStore}>
          <IsViewPressedContext.Provider value={pressController.store}>
            <BaseKeyboardView
              style={containerStyleArr}
              defaultFocusHighlightEnabled={defaultFocusHighlightEnabled}
              ref={ref as RefObject<BaseKeyboardViewType | View>}
              onKeyUpPress={onKeyUpPressHandler}
              onKeyDownPress={onKeyDownPressHandler}
              onFocus={onFocus ?? undefined}
              onBlur={onBlur ?? undefined}
              onFocusChange={handleFocusChange}
              onContextMenuPress={onContextMenuHandler}
              enableContextMenu={enableContextMenu}
              haloEffect={haloEffect}
              tintType={tintType}
              haloCornerRadius={haloCornerRadius}
              haloExpendX={haloExpendX}
              haloExpendY={haloExpendY}
              autoFocus={autoFocus}
              focusable={focusable}
              tintColor={tintColor}
              focusableWrapper={focusableWrapper}
              groupIdentifier={groupIdentifier}
              screenAutoA11yFocus={screenAutoA11yFocus}
              screenAutoA11yFocusDelay={screenAutoA11yFocusDelay}
              lockFocus={lockFocus}
              roundedHaloFix={roundedHaloFix}
              orderIndex={orderIndex}
              orderGroup={orderGroup}
              orderId={orderId}
              orderLeft={orderLeft}
              orderRight={orderRight}
              orderUp={orderUp}
              orderDown={orderDown}
              orderForward={orderForward}
              orderBackward={orderBackward}
              orderFirst={orderFirst}
              orderLast={orderLast}
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
                  handlePressIn as KeyboardPressType<ComponentProps>['onPressIn']
                }
                onPressOut={
                  handlePressOut as KeyboardPressType<ComponentProps>['onPressOut']
                }
                onFocus={onComponentFocus}
                onBlur={onComponentBlur}
                focusable={focusable}
                {...(componentProps as unknown as ComponentProps)}
                {...(childContent !== undefined &&
                  ({
                    children: childContent,
                  } as unknown as Partial<ComponentProps>))}
              />
            </BaseKeyboardView>
          </IsViewPressedContext.Provider>
        </IsViewFocusedContext.Provider>
      );
    })
  );

  const wrappedComponentName =
    (Component as any)?.displayName || (Component as any).name || 'Component';
  WithKeyboardFocus.displayName = `withKeyboardFocus(${wrappedComponentName})`;

  return WithKeyboardFocus;
};
