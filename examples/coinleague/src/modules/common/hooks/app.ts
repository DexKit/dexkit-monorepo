import {
  notificationsAtom,
  selectedWalletAtom,
  showNotificationsAtom,
  transactionsAtom,
} from '@/modules/common/atoms';
import { Web3ReactHooks } from '@web3-react/core';
import { Connector } from '@web3-react/types';
import { useAtom, useAtomValue } from 'jotai';
import { useUpdateAtom } from 'jotai/utils';
import { useCallback, useMemo } from 'react';
import { CONNECTORS } from '../constants/connectors';
import { AddNotificationParams } from '../types/transactions';

export function useNotifications() {
  const [isOpen, setOpen] = useAtom(showNotificationsAtom);

  const updateTransactions = useUpdateAtom(transactionsAtom);
  const updateNotifications = useUpdateAtom(notificationsAtom);

  const addNotification = useCallback(
    ({ notification, transaction }: AddNotificationParams) => {
      if (transaction) {
        updateTransactions((txs) => ({
          ...txs,
          [notification.hash]: transaction,
        }));
      }

      updateNotifications((notifications) => [...notifications, notification]);
    },
    [updateNotifications, updateTransactions]
  );

  return { isOpen, setOpen, addNotification };
}

export function useOrderedConnectors() {
  const selectedWallet = useAtomValue(selectedWalletAtom);

  return useMemo(() => {
    let connectors: [Connector, Web3ReactHooks][] = [];

    if (selectedWallet) {
      const otherConnectors = Object.keys(CONNECTORS)
        .filter((key) => selectedWallet !== key)
        .map((key) => CONNECTORS[key]);

      connectors = [CONNECTORS[selectedWallet], ...otherConnectors];
    } else {
      const otherConnectors = Object.keys(CONNECTORS).map(
        (key) => CONNECTORS[key]
      );

      connectors = otherConnectors;
    }

    return connectors;
  }, [selectedWallet]);
}
