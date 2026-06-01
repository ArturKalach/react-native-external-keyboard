import { LockFocusEnum, type LockFocusType } from '../types';

enum BITS {
  BIT_01 = 0b1,
  BIT_02 = 0b10,
  BIT_03 = 0b100,
  BIT_04 = 0b1000,
  BIT_05 = 0b10000,
  BIT_06 = 0b100000,
  BIT_07 = 0b1000000,
  BIT_08 = 0b10000000,
  BIT_09 = 0b100000000,
  BIT_10 = 0b1000000000,
}

const focusBinaryValue: Record<LockFocusEnum, number> = {
  [LockFocusEnum.Up]: BITS.BIT_01,
  [LockFocusEnum.Down]: BITS.BIT_02,
  [LockFocusEnum.Left]: BITS.BIT_03,
  [LockFocusEnum.Right]: BITS.BIT_04,
  [LockFocusEnum.Forward]: BITS.BIT_05,
  [LockFocusEnum.Backward]: BITS.BIT_06,
  [LockFocusEnum.First]: BITS.BIT_09,
  [LockFocusEnum.Last]: BITS.BIT_10,
};

export const mapLockFocus = (values: LockFocusType[] | undefined): number => {
  if (!values || !values.length) return 0;
  // eslint-disable-next-line no-bitwise
  return values.reduce((acc, item) => acc | focusBinaryValue[item], 0);
};
