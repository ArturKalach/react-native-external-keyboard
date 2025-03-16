import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  dismissKeyboard: () => Promise<boolean>;
}

export default TurboModuleRegistry.get<Spec>('ExternalKeyboardModule');
