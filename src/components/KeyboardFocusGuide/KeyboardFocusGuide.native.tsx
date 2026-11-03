import React, { useMemo } from 'react';
import KeyboardFocusGuideNative from '../../nativeSpec/KeyboardFocusGuideNativeComponent';
import { useOrderFocusGroup } from '../../context/OrderFocusContext';
import { useResolvedGroupIdentifier } from '../../context/GroupIdentifierContext';
import { wrapOrderPrefix } from '../../utils/wrapOrderPrefix';
import type { KeyboardFocusGuideProps } from './KeyboardFocusGuide.types';
import { toGuideMask } from './guideMask';

export const KeyboardFocusGuide = React.memo<KeyboardFocusGuideProps>(
  ({ to, orderGroup, enabled = true, guide = 'keyboard', ...props }) => {
    const contextGroupId = useOrderFocusGroup();
    const prefix = orderGroup ?? contextGroupId ?? '';
    const orderId = useMemo(() => wrapOrderPrefix(prefix)(to), [prefix, to]);

    // Native gets one integer of bit flags: no string parsing there, and an unknown value can never reach it.
    const guideMask = toGuideMask(guide);
    // iOS: the guide is a Tab stop, so it groups like the views around it (a scope, Keyboard.configure).
    const groupIdentifierProps = useResolvedGroupIdentifier({});

    return (
      <KeyboardFocusGuideNative
        {...props}
        {...groupIdentifierProps}
        // The native view must exist even when the guide has no styling, or React Native flattens it away.
        collapsable={false}
        preferredFocusOrderId={orderId}
        enabled={enabled}
        guideMask={guideMask}
      />
    );
  }
);
