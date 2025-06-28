import React, { useContext, useId } from 'react';

export const OrderFocusGroupContext = React.createContext<string | undefined>(
  undefined
);

export const useOrderFocusGroup = () => useContext(OrderFocusGroupContext);

type KeyboardOrderFocusGroupProps = {
  groupId?: string;
  children?: React.ReactNode;
};

export const KeyboardOrderFocusGroup = ({
  children,
  groupId,
}: KeyboardOrderFocusGroupProps) => {
  const id = useId();
  return (
    <OrderFocusGroupContext.Provider
      value={groupId ?? id}
      children={children}
    />
  );
};
