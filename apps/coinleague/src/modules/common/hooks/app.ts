import {
  notificationsAtom,
  showNotificationsAtom,
  transactionsAtom
} from '@/modules/common/atoms';
import { useAtom } from 'jotai';
import { useUpdateAtom } from 'jotai/utils';
import { useCallback } from 'react';

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

      updateNotifications((notifications) => [...(notifications || []), notification]);
    },
    [updateNotifications, updateTransactions]
  );

  return { isOpen, setOpen, addNotification };
}

