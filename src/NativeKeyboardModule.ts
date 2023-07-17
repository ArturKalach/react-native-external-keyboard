import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  setKeyboardFocus: (nativeTag: number, nextTag: number) => void;
  setPreferredKeyboardFocus: (nativeTag: number, nextTag: number) => void;
}

export default TurboModuleRegistry.get<Spec>('A11yKeyboardModule');
