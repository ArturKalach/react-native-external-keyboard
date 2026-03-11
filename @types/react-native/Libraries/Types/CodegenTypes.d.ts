// TypeScript declaration for react-native/Libraries/Types/CodegenTypes
// Place this file at @types/react-native/Libraries/Types/CodegenTypes.d.ts

declare module 'react-native/Libraries/Types/CodegenTypes' {
  export type Int32 = number;
  export type Float = number;
  export type Double = number;
  export type UnsafeObject = any;
  export type UnsafeArray = any[];
  export type DirectEventHandler<T = any> = (event: any, d?: T) => void;
  export type SyntheticEventHandler<T = any> = (event: T) => void;
  export type BubblingEventHandler<T = any> = (event: T) => void;
}
