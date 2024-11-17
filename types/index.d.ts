export {};

declare module 'react' {
  function useId(): string;
  declare const useId: useId | undefined;
}

declare module 'react-native' {
  interface TextInputProps {
    submitBehavior?: string;
  }
}
