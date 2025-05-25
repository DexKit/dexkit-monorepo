import { atom, useAtom, useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { isBalancesVisibleAtom } from '../state/atoms';




export function useIsBalanceVisible() {
  return useAtomValue(isBalancesVisibleAtom);
}



const showSelectIsOpenAtom = atom(false);

export function useSelectNetworkDialog() {
  const [isOpen, setIsOpen] = useAtom(showSelectIsOpenAtom);

  return { isOpen, setIsOpen };
}

export function useDebounce<T>(value: any, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
