declare module 'react' {
  export type Dispatch<A> = (value: A) => void;
  export type SetStateAction<S> = S | ((prevState: S) => S);
  export function createContext<T>(defaultValue: T): any;
}
