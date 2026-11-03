import React from 'react';
import { View } from 'react-native';
import type { KeyboardFocusGuideProps } from './KeyboardFocusGuide.types';

/** Default/web: a focus guide has no effect outside iOS/Android — render a plain View. */
export const KeyboardFocusGuide = React.memo<KeyboardFocusGuideProps>(
  ({
    to: _to,
    enabled: _enabled,
    guide: _guide,
    orderGroup: _orderGroup,
    ...props
  }) => <View {...props} />
);
