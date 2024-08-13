import React, { useId } from 'react';
import ExternalKeyboardRootViewNativeComponent from '../../nativeSpec/ExternalKeyboardRootViewNativeComponent';

import type { ViewProps } from 'react-native';
import { KeyboardRootViewContext } from '../../context/KeyboardRootViewContext';

export const ExternalKeyboardRootView = React.memo((props: ViewProps) => {
  const id = useId();
  return (
    <KeyboardRootViewContext.Provider value={id}>
      <ExternalKeyboardRootViewNativeComponent {...props} viewId={id} />;
    </KeyboardRootViewContext.Provider>
  );
});
