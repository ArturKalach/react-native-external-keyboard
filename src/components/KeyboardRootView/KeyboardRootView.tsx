import React, { useId } from 'react';
import { StyleSheet, type ViewProps } from 'react-native';

import ExternalKeyboardRootViewNativeComponent from '../../nativeSpec/ExternalKeyboardRootViewNativeComponent';
import { KeyboardRootViewContext } from '../../context/KeyboardRootViewContext';

export const KeyboardRootView = React.memo((props: ViewProps) => {
  const id = useId();
  return (
    <KeyboardRootViewContext.Provider value={id}>
      <ExternalKeyboardRootViewNativeComponent
        style={styles.container}
        {...props}
        viewId={id}
      />
    </KeyboardRootViewContext.Provider>
  );
});

const styles = StyleSheet.create({
  container: { flex: 1 },
});
