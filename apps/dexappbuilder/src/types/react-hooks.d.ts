import { useState, useEffect, useMemo, useCallback, Fragment, SyntheticEvent, useRef, ChangeEvent, ReactNode, memo, useContext, FormEvent, Suspense, MouseEvent, Component, ErrorInfo, createContext, FocusEvent, KeyboardEvent, cloneElement, useLayoutEffect, ComponentType, ComponentPropsWithoutRef, FC, ReactElement, SetStateAction } from 'react';

declare module 'react' {
  export { useState, useEffect, useMemo, useCallback, Fragment, SyntheticEvent, useRef, ChangeEvent, ReactNode, memo, useContext, FormEvent, Suspense, MouseEvent, Component, ErrorInfo, createContext, FocusEvent, KeyboardEvent, cloneElement, useLayoutEffect, ComponentType, ComponentPropsWithoutRef, FC, ReactElement, SetStateAction };
}

declare module 'next/document' {
  interface DocumentProps {
    emotionStyleTags?: React.ReactElement[];
  }
}

declare module 'next/script' {
  interface ScriptProps {
    src?: string;
    strategy?: 'afterInteractive' | 'beforeInteractive' | 'lazyOnload';
  }
}
