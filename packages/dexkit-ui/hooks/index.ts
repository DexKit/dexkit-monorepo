import { TransactionStatus } from "@dexkit/core/constants";
import { AppTransaction } from "@dexkit/core/types";
import { useMutation, useQuery } from "@tanstack/react-query";

import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";

import { atom, useAtom } from "jotai";

import { useContext, useMemo } from "react";

import useMediaQuery from "@mui/material/useMediaQuery";

import { ThemeMode } from "../constants/enum";
import {
  AppConfigContext,
  AppWizardConfigContext,
} from "../context/AppConfigContext";

import { userThemeModeAtom } from "../state";

import { isHexString } from "@dexkit/core/utils/ethers/isHexString";
import type { providers } from "ethers";
import { AdminContext } from "../context/AdminContext";

import { defineChain } from "thirdweb/chains";
import { useSwitchActiveWalletChain } from "thirdweb/react";
import { useAppConfig } from './useAppConfig';
import { useDexKitContext } from './useDexKitContext';
import { useLocale } from './useLocale';

export * from "./auth";
export * from "./blockchain";
export * from "./currency";
export * from "./ui";

export * from "./useDexkitContextState";

export * from "./useWatchTransactionsDialog";

export { useAppConfig, useDexKitContext, useLocale };

export function useAppNFT() {
  return useContext(AppConfigContext).appNFT;
}

const DARK_SCHEME_QUERY = "(prefers-color-scheme: dark)";

export function useThemeMode() {
  const systemPrefersDark = useMediaQuery(DARK_SCHEME_QUERY);
  const [userMode, setThemeMode] = useAtom(userThemeModeAtom);
  const appConfig = useAppConfig();

  const mode = useMemo(() => {
    if (userMode) {
      return userMode;
    }
    if (appConfig.defaultThemeMode) {
      return appConfig.defaultThemeMode;
    }
    return systemPrefersDark ? ThemeMode.dark : ThemeMode.light;
  }, [userMode, appConfig, systemPrefersDark]);

  return { mode: mode, setThemeMode, userMode };
}

// Wizard App config context needs to be initialized on widgets that needs wizard to customize
export function useAppWizardConfig() {
  const { wizardConfig, setWizardConfig } = useContext(AppWizardConfigContext);
  return { wizardConfig, setWizardConfig };
}

export function useNotifications() {
  const { chainId } = useWeb3React();
  const { notifications, transactions } = useDexKitContext();

  const uncheckedTransactions = useMemo(() => {
    return notifications.filter((n) => !n.checked);
  }, [notifications, chainId]);

  const pendingTransactions = useMemo(() => {
    let objs = Object.keys(transactions)
      .map((key) => {
        return { key, tx: transactions[key] };
      })
      .filter((t) => t.tx.status === TransactionStatus.Pending);

    return objs.reduce((prev: { [key: string]: AppTransaction }, curr) => {
      prev[curr.key] = curr.tx;

      return prev;
    }, {});
  }, [transactions]);

  const hasPendingTransactions = useMemo(() => {
    return Object.keys(pendingTransactions).length > 0;
  }, [pendingTransactions]);

  const filteredUncheckedTransactions = useMemo(() => {
    return uncheckedTransactions.filter((tx) => {
      if (tx.metadata) {
        const txChainId = tx.metadata["chainId"];

        return txChainId === chainId;
      }

      return false;
    });
  }, [chainId, uncheckedTransactions]);

  return {
    uncheckedTransactions,
    hasPendingTransactions,
    filteredUncheckedTransactions,
  };
}

export function useSwitchNetworkMutation() {
  const switchChain = useSwitchActiveWalletChain();

  return useMutation<unknown, Error, { chainId: number }>(
    async ({ chainId }) => {
      await switchChain(defineChain(chainId))
      //  const response = await switchNetwork(connector, chainId);
      return null
    }

  );
}

const showSelectIsOpenAtom = atom(false);

export function useSelectNetworkDialog() {
  const [isOpen, setIsOpen] = useAtom(showSelectIsOpenAtom);

  return { isOpen, setIsOpen };
}

const drawerIsOpenAtom = atom(false);

export function useDrawerIsOpen() {
  const [isOpen, setIsOpen] = useAtom(drawerIsOpenAtom);

  return { isOpen, setIsOpen };
}

const showAppTransactionsAtom = atom(false);

export function useShowAppTransactions() {
  const [isOpen, setIsOpen] = useAtom(showAppTransactionsAtom);

  return { isOpen, setIsOpen };
}

export const WAIT_TRANSACTION_QUERY = "WAIT_TRANSACTION_QUERY";

export function useWaitTransactionConfirmation({
  transactionHash,
  provider,
}: {
  transactionHash?: string;
  provider?: providers.Web3Provider;
}) {
  return useQuery(
    [WAIT_TRANSACTION_QUERY, transactionHash],
    async ({ }) => {
      if (!isHexString(transactionHash)) {
        return null;
      }

      if (transactionHash && provider) {
        const receipt = await provider.waitForTransaction(transactionHash);

        return receipt?.confirmations > 0;
      }

      return null;
    },
    {
      enabled: transactionHash !== undefined,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );
}

export function useEditSiteId() {
  const { editSiteId } = useContext(AdminContext);

  return { editSiteId };
}
