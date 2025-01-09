import { useMemo } from 'react';
import { useKeyPressContext } from '../../context/BubbledKeyPressContext';
import type { BubblingEventHandler } from 'react-native/Libraries/Types/CodegenTypes';
import type { KeyPress } from '../../nativeSpec';

const bubbleStub = () => {};

type useBubbledInfoProps = {
  onBubbledKeyDownPress?: BubblingEventHandler<KeyPress>;
  onBubbledKeyUpPress?: BubblingEventHandler<KeyPress>;
  onBubbledContextMenuPress?: () => void;
};

export const useBubbledInfo = ({
  onBubbledKeyDownPress,
  onBubbledKeyUpPress,
  onBubbledContextMenuPress,
}: useBubbledInfoProps) => {
  const keyPressContext = useKeyPressContext();

  const context = useMemo(
    () => ({
      bubbledKeyDown:
        Boolean(onBubbledKeyDownPress) || keyPressContext.bubbledKeyDown,
      bubbledKeyUp:
        Boolean(onBubbledKeyUpPress) || keyPressContext.bubbledKeyUp,
      bubbledMenu:
        Boolean(onBubbledContextMenuPress) || keyPressContext.bubbledMenu,
    }),
    [
      onBubbledKeyDownPress,
      keyPressContext.bubbledKeyDown,
      keyPressContext.bubbledKeyUp,
      keyPressContext.bubbledMenu,
      onBubbledKeyUpPress,
      onBubbledContextMenuPress,
    ]
  );

  const keyDown = context.bubbledKeyDown
    ? (onBubbledKeyDownPress ?? bubbleStub)
    : undefined;
  const keyUp = context.bubbledKeyUp
    ? (onBubbledKeyUpPress ?? bubbleStub)
    : undefined;
  const contextMenu = context.bubbledMenu
    ? (onBubbledContextMenuPress ?? bubbleStub)
    : undefined;

  return {
    keyDown,
    keyUp,
    contextMenu,
    context,
  };
};
