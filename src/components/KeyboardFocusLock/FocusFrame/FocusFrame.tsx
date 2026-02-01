import { View, type ViewProps } from 'react-native';
import { FrameProvider } from '../../../context/FocusFrameProviderContext';

export const FocusFrame = (props: ViewProps) => (
  <FrameProvider>
    <View {...props} />
  </FrameProvider>
);
