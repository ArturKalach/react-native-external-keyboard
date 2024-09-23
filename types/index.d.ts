export {};

declare module 'react' {
  function useId(): string;
  declare const useId: useId | undefined;
}
