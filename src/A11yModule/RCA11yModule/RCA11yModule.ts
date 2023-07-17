import { NativeModules, Platform } from 'react-native';
const LINKING_ERROR =
  `The package 'react-native-external-keyboard' doesn't seem to be linked. Make sure: \n\n${Platform.select(
    { ios: "- You have run 'pod install'\n", default: '' }
  )}- You rebuilt the app after installing the package\n` +
  `- You are not using Expo Go\n`;

// @ts-expect-error
const isTurboModuleEnabled = global.__turboModuleProxy != null;

const RCA11yModule = isTurboModuleEnabled
  ? require('../../NativeKeyboardModule').default
  : NativeModules.A11yKeyboardModule;

export const RCA11y =
  RCA11yModule ||
  new Proxy(
    {},
    {
      get() {
        throw new Error(LINKING_ERROR);
      },
    }
  );

export function setKeyboardFocus(nativeTag: number, _nextTag = 0): void {
  RCA11y.setKeyboardFocus(nativeTag, _nextTag);
}

export function setPreferredKeyboardFocus(
  nativeTag: number,
  nextTag: number
): void {
  RCA11y.setAccessibilityFocus(nativeTag, nextTag);
}
