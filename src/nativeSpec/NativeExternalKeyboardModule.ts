import { TurboModuleRegistry, type TurboModule } from 'react-native';

export interface Spec extends TurboModule {
  dismissKeyboard(): Promise<boolean>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('ExternalKeyboardModule');
