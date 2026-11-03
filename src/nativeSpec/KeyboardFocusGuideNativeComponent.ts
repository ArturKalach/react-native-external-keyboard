import type { ViewProps } from 'react-native';
import type { Int32 } from 'react-native/Libraries/Types/CodegenTypes';
// eslint-disable-next-line @react-native/no-deep-imports
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

export interface KeyboardFocusGuideNativeComponentProps extends ViewProps {
  /** Order id (already prefix-wrapped) of the view that should receive focus. */
  preferredFocusOrderId?: string;
  enabled?: boolean;
  /** Bit flags of the redirected inputs: 1 arrows, 2 Tab, 4 screen reader. The native default is 3 (arrows + Tab). */
  guideMask?: Int32;
  /**
   * iOS `focusGroupIdentifier` of the guide, resolved from the enclosing group scope like
   * `KeyboardExtendedView`'s, so the guide is a Tab stop in the same group as its neighbours.
   */
  groupIdentifier?: string;
  /** iOS: without a `groupIdentifier`, the guide gets a generated unique group id. */
  uniqueGroupIdentifierEnabled?: boolean;
}

export default codegenNativeComponent<KeyboardFocusGuideNativeComponentProps>(
  'KeyboardFocusGuide'
);
