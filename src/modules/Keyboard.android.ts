import { Keyboard } from 'react-native';
import ExternalKeyboard from '../nativeSpec/NativeExternalKeyboardModule';

export { ExternalKeyboard };

export function dismiss() {
  Keyboard.dismiss();
  ExternalKeyboard.dismissKeyboard();
}
