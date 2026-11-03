import { Keyboard } from 'react-native';

export { configure } from '../config';

export function dismiss() {
  Keyboard.dismiss();
}
