export { A11yKeyboardModule } from './NativeModules';
export {
  ExternalKeyboardViewNative,
  TextInputFocusWrapperNative,
  KeyPress,
} from './nativeSpec';

export type { ExternalKeyboardViewType as KeyboardExtendedViewType } from './types/ExternalKeyboardView';

export {
  KeyboardFocusView,
  Pressable,
  ExternalKeyboardView,
  KeyboardExtendedInput,
  KeyboardExtendedView,
  KeyboardExtendedPressable,
  KeyboardExtendedBaseView,
} from './components';
export { TouchableOpacity } from './components/Pressable/TouchableOpacity';
export { TouchableWithoutFeedback } from './components/Pressable/TouchableWithoutFeedback';
export { withKeyboardFocus } from './utils/withKeyboardFocus';
export { KeyboardRootView } from './components/KeyboardRootView';
export { A11yModule, KeyboardExtendedModule } from './services';
