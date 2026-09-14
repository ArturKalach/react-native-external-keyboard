import {
  FocusFrame,
  FocusTrap,
  KeyboardFocusView,
  KeyboardExtendedInput,
  Pressable,
} from './components';
import * as Keyboard from './modules/Keyboard';

// Native spec
export {
  ExternalKeyboardViewNative,
  TextInputFocusWrapperNative,
  type KeyPress,
} from './nativeSpec';

// Components
export {
  BaseKeyboardView,
  BaseKeyboardView as ExternalKeyboardView,
  BaseKeyboardView as KeyboardExtendedBaseView,
  KeyboardFocusView,
  KeyboardFocusView as KeyboardExtendedView,
  KeyboardFocusGroup,
  KeyboardExtendedInput,
  KeyboardExtendedInput as TextInput,
  Pressable,
  Pressable as KeyboardExtendedPressable,
} from './components';

// Types
export {
  LockComponentType,
  type OnKeyPress,
  type OnKeyPressFn,
  type KeyboardFocus,
  type OnFocusChangeFn,
  type BaseKeyboardViewType,
  type WithKeyboardFocusProps,
  type WithKeyboardFocusPropsWithRef,
  type KeyboardFocusableComponent,
  type KeyboardFocusableComponentDeclaration,
  type KeyboardFocusLockProps,
  type KeyboardInputPropsDeclaration,
  type KeyboardInputProps,
  type ExtraKeyboardProps,
} from './types';
export type { KeyboardPressableProps } from './components';

// Hooks & context
export { withKeyboardFocus } from './utils/withKeyboardFocus';
export { useIsViewFocused } from './context/IsViewFocusedContext';
export { useIsViewPressed } from './context/IsViewPressedContext';
export {
  KeyboardOrderFocusGroup,
  OrderFocusGroupContext,
  useOrderFocusGroup,
} from './context/OrderFocusContext';

// Modules
export { Keyboard };

// Namespaces
export const Focus = {
  Frame: FocusFrame,
  Trap: FocusTrap,
};

export const K: {
  Input: typeof KeyboardExtendedInput;
  View: typeof KeyboardFocusView;
  Pressable: typeof Pressable;
} = {
  Input: KeyboardExtendedInput,
  View: KeyboardFocusView,
  Pressable,
};
