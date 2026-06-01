import { useEffect } from 'react';
import type { FocusOrderProps } from '../types';

type UseOrderValidationProps = Pick<
  FocusOrderProps,
  | 'orderIndex'
  | 'orderId'
  | 'orderForward'
  | 'orderBackward'
  | 'orderFirst'
  | 'orderLast'
  | 'orderLeft'
  | 'orderRight'
  | 'orderUp'
  | 'orderDown'
> & {
  groupId?: string;
  orderPrefix: string;
};

export const useOrderValidation = ({
  groupId,
  orderIndex,
  orderPrefix,
  orderId,
  orderForward,
  orderBackward,
  orderFirst,
  orderLast,
  orderLeft,
  orderRight,
  orderUp,
  orderDown,
}: UseOrderValidationProps) => {
  useEffect(() => {
    if (!__DEV__) return;
    if (orderIndex !== undefined && !groupId)
      console.warn(
        '`orderIndex` must be declared alongside `orderGroup` for proper functionality. Ensure components are wrapped with `KeyboardOrderFocusGroup` or provide `orderGroup` directly.'
      );
  }, [groupId, orderIndex]);

  useEffect(() => {
    if (!__DEV__) return;
    const hasOrderLinkProp =
      orderId !== undefined ||
      orderForward !== undefined ||
      orderBackward !== undefined ||
      orderFirst !== undefined ||
      orderLast !== undefined ||
      orderLeft !== undefined ||
      orderRight !== undefined ||
      orderUp !== undefined ||
      orderDown !== undefined;
    if (hasOrderLinkProp && orderPrefix === '') {
      console.warn(
        '[react-native-external-keyboard] orderId, orderForward, orderBackward, orderFirst, orderLast, ' +
          'orderLeft, orderRight, orderUp, and orderDown are global IDs. ' +
          'Wrap the component in <KeyboardOrderFocusGroup> or pass orderPrefix to avoid ID collisions across screens.'
      );
    }
  }, [
    orderId,
    orderForward,
    orderBackward,
    orderFirst,
    orderLast,
    orderLeft,
    orderRight,
    orderUp,
    orderDown,
    orderPrefix,
  ]);
};
