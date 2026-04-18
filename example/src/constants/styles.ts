import { Platform } from 'react-native';

export const ANDROID_FOCUS_STYLE = Platform.select({
  android: { borderWidth: 2, borderColor: '#007AFF', borderRadius: 12 },
});

export const ANDROID_SECONDARY_FOCUS_STYLE = Platform.select({
  android: { borderWidth: 2, borderColor: '#000000', borderRadius: 12 },
});
