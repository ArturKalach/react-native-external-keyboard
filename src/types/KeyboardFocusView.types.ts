import type { GestureResponderEvent } from 'react-native';
import type { FocusStyle } from './focusStyle.types';
import type {
  BaseFocusViewProps,
  BaseKeyboardViewProps,
} from './baseKeyboardView.types';
import type { OnKeyPress } from './keyPress.types';

export type FocusViewProps = {
  /** Key codes that trigger `onPress` / `onLongPress`. Defaults to spacebar and enter. */
  triggerCodes?: number[];
  /** Style applied to the inner component while focused. */
  focusStyle?: FocusStyle;
  /** Called on press — from touch (`GestureResponderEvent`) or physical key ({@link OnKeyPress}). */
  onPress?: (e: GestureResponderEvent | OnKeyPress) => void;
  /** Called on long press — from touch (`GestureResponderEvent`) or physical key ({@link OnKeyPress}). */
  onLongPress?: (e?: GestureResponderEvent | OnKeyPress) => void;
} & BaseFocusViewProps;

export type KeyboardFocusViewProps = BaseKeyboardViewProps &
  FocusViewProps & {
    /**
     * Wraps children in an extra native view.
     *
     * @see https://github.com/anfedorov/react-native-external-keyboard/discussions/63
     */
    withView?: boolean;
  };
