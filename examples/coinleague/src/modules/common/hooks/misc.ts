import { useMediaQuery, useTheme } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useWeb3React } from '@web3-react/core';
import { useUpdateAtom } from 'jotai/utils';
import { useCallback, useEffect, useState } from 'react';
import { selectedWalletAtom, showConnectWalletAtom } from '../atoms';
import { magic, MagicLoginType } from '../connectors/magic';
import { metaMask } from '../connectors/metaMask';

export function useWalletActivate() {
  const { connector } = useWeb3React();

  const setSelectedWallet = useUpdateAtom(selectedWalletAtom);

  return useMutation(
    async ({
      connectorName,
      loginType,
      email,
    }: {
      connectorName: string;
      loginType?: MagicLoginType;
      email?: string;
    }) => {
      if (connector.deactivate) {
        await connector.deactivate();
      }
      if (connectorName === 'metamask') {
        setSelectedWallet('metamask');
        return await metaMask.activate();
      } else if (connectorName === 'magic') {
        setSelectedWallet('magic');
        return await magic.activate({
          loginType,
          email,
        });
      }
    }
  );
}

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
