import { useMemo } from 'react';
import type { FocusOrderProps } from '../types';
import { wrapOrderPrefix } from './wrapOrderPrefix';

export const useWrappedOrderProps = ({
  orderPrefix = '',
  orderId,
  orderForward,
  orderBackward,
  orderFirst,
  orderLast,
  orderLeft,
  orderRight,
  orderUp,
  orderDown,
}: FocusOrderProps) => {
  const wrapPrefix = useMemo(() => wrapOrderPrefix(orderPrefix), [orderPrefix]);

  return useMemo(
    () => ({
      orderId: wrapPrefix(orderId),
      orderForward: wrapPrefix(orderForward),
      orderBackward: wrapPrefix(orderBackward),
      orderLeft: wrapPrefix(orderLeft),
      orderRight: wrapPrefix(orderRight),
      orderUp: wrapPrefix(orderUp),
      orderDown: wrapPrefix(orderDown),
      orderFirst: wrapPrefix(
        orderFirst === null ? undefined : orderFirst ?? orderForward
      ),
      orderLast: wrapPrefix(
        orderLast === null ? undefined : orderLast ?? orderBackward
      ),
    }),
    [
      wrapPrefix,
      orderId,
      orderForward,
      orderBackward,
      orderFirst,
      orderLast,
      orderLeft,
      orderRight,
      orderUp,
      orderDown,
    ]
  );
};
