import { useCallback, useState } from 'react';

export function useCoinLeagueSwitchNetwork() {
  const [isOpen, setIsOpen] = useState(false);
  const [chainId, setChainId] = useState<number | undefined>();

  const openDialog = useCallback((targetChainId: number) => {
    setChainId(targetChainId);
    setIsOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setIsOpen(false);
    setChainId(undefined);
  }, []);

  return {
    isOpen,
    chainId,
    openDialog,
    closeDialog,
  };
}
