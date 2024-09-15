import type { GestureResponderEvent } from 'react-native';
//ToDo RNCEKV-5 test absolute import with src
import type { OnKeyPressFn } from 'src/types/BaseKeyboardView';

type PressType = ((event: GestureResponderEvent) => void) | undefined | null;

export type UseKeyboardPressProps = {
  onKeyUpPress?: OnKeyPressFn;
  onLongPress?: PressType;
  onPress?: PressType;
};
