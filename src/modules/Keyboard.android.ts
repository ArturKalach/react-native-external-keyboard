import { NativeModules, Platform, Keyboard } from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-a11y' doesn't seem to be linked. Make sure: \n\n${Platform.select(
    { ios: "- You have run 'pod install'\n", default: '' }
  )}- You rebuilt the app after installing the package\n` +
  `- You are not using Expo Go\n`;

// @ts-expect-error
const isTurboModuleEnabled = global.__turboModuleProxy != null;

const ExternalKeyboardModule = isTurboModuleEnabled
  ? require('../nativeSpec/NativeExternalKeyboardModule').default
  : NativeModules.ExternalKeyboardModule;

export const ExternalKeyboard =
  ExternalKeyboardModule ||
  new Proxy(
    {},
    {
      get() {
        throw new Error(LINKING_ERROR);
      },
    }
  );

export function dismiss() {
  Keyboard.dismiss();
  ExternalKeyboard.dismissKeyboard();
}
