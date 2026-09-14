import { useMemo } from 'react';
import { useKeyPressContext } from '../../context/BubbledKeyPressContext';

const bubbleStub = () => {};

export const useBubbledInfo = (onBubbledContextMenuPress?: () => void) => {
  const keyPressContext = useKeyPressContext();

  const context = useMemo(
    () => ({
      bubbledMenu:
        Boolean(onBubbledContextMenuPress) || keyPressContext.bubbledMenu,
    }),
    [keyPressContext.bubbledMenu, onBubbledContextMenuPress]
  );

  const contextMenu = context.bubbledMenu
    ? (onBubbledContextMenuPress ?? bubbleStub)
    : undefined;

  return {
    contextMenu,
    context,
  };
};
