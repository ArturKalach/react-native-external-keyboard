import { useEffect, useRef, type PropsWithChildren } from 'react';
import { useFocusFrameContext } from '../../../context/FocusFrameProviderContext';

export const FocusTrapMountWrapper: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const a11yFrameContext = useFocusFrameContext();
  const instanceId = useRef(Symbol('FocusLock'));

  if (!a11yFrameContext) {
    console.warn('Focus.Trap must be used within a Focus.Frame');
    return children;
  }

  const { hasFocusLock, setHasFocusLock, focusLockId, setFocusLockId } =
    a11yFrameContext;
  const isActive = !hasFocusLock || focusLockId === instanceId.current;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const id = instanceId.current;

    if (!hasFocusLock) {
      setHasFocusLock(true);
      setFocusLockId(id);
    }
    return () => {
      if (focusLockId === id) {
        setHasFocusLock(false);
        setFocusLockId(null);
      }
    };
  }, [hasFocusLock, setHasFocusLock, focusLockId, setFocusLockId]);

  if (!isActive) {
    console.warn('Multiple Focus.Trap components may cause unstable behavior');
  }

  return children;
};
