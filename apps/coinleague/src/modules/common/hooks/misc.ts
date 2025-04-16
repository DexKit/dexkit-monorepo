import { useMediaQuery, useTheme } from '@mui/material';
import { useUpdateAtom } from 'jotai/utils';
import { useCallback, useEffect, useState } from 'react';
import { showConnectWalletAtom } from '../atoms';




export function useConnectWalletDialog() {
  const setShowConnectWallet = useUpdateAtom(showConnectWalletAtom);

  const show = useCallback(() => {
    setShowConnectWallet(true);
  }, [setShowConnectWallet]);

  const close = useCallback(() => {
    setShowConnectWallet(false);
  }, [setShowConnectWallet]);

  return { show, close };
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

export function useMobile() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return isMobile;
}
