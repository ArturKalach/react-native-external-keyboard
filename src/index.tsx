export { A11yKeyboardModule } from './NativeModules';
export {
  ExternalKeyboardViewNative,
  TextInputFocusWrapperNative,
  KeyPress,
} from './nativeSpec';

export type {
  OnKeyPress,
  KeyboardFocus,
  BaseKeyboardViewType as KeyboardExtendedViewType,
} from './types/BaseKeyboardView';

export type { TintType } from './types/WithKeyboardFocus';

export {
  BaseKeyboardView,
  KeyboardFocusView,
  ExternalKeyboardView,
  KeyboardExtendedView,
  KeyboardExtendedBaseView,
} from './components';
export {
  Pressable,
  Pressable as KeyboardExtendedPressable,
} from './components/Touchable/Pressable';
export {
  KeyboardExtendedInput,
  KeyboardExtendedInput as TextInput,
} from './components/KeyboardExtendedInput/KeyboardExtendedInput';
export { withKeyboardFocus } from './utils/withKeyboardFocus';
export { KeyboardRootView } from './components/KeyboardRootView';
export { A11yModule, KeyboardExtendedModule } from './services';

export { Tappable } from './components/Touchable/Tappable';

export { useIsViewFocused } from './context/IsViewFocusedContext';
