import { NativeModules, Platform } from 'react-native';
const LINKING_ERROR =
  `The package 'react-native-external-keyboard' doesn't seem to be linked. Make sure: \n\n${Platform.select(
    { ios: "- You have run 'pod install'\n", default: '' }
  )}- You rebuilt the app after installing the package\n` +
  `- You are not using Expo Go\n`;

// @ts-expect-error
const isTurboModuleEnabled = global.__turboModuleProxy != null;

const A11yModule = isTurboModuleEnabled
  ? require('../../nativeSpec/NativeKeyboardModule').default
  : NativeModules.A11yKeyboardModule;

const RCA11y =
  A11yModule ||
  new Proxy(
    {},
    {
      get() {
        throw new Error(LINKING_ERROR);
      },
    }
  );

const setKeyboardFocus = (nativeTag: number, _nextTag = 0) => {
  RCA11y.setKeyboardFocus(nativeTag, _nextTag);
};

const setPreferredKeyboardFocus = (nativeTag: number, nextTag: number) => {
  RCA11y.setAccessibilityFocus(nativeTag, nextTag);
};

export const A11yKeyboardModule = {
  setKeyboardFocus,
  setPreferredKeyboardFocus,
};
