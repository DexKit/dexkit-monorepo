import { Box, NoSsr } from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import { useAtom } from 'jotai';
import dynamic from 'next/dynamic';
import React, { useEffect, useMemo } from 'react';
import {
  useAppConfig,
  useConnectWalletDialog,
  useSignMessageDialog,
  useTransactions,
} from '../../hooks/app';
import {
  drawerIsOpenAtom,
  showSelectCurrencyAtom,
  showSelectLocaleAtom,
  switchNetworkChainIdAtom,
  switchNetworkOpenAtom,
} from '../../state/atoms';
import { Footer } from '../Footer';
import Navbar from '../Navbar';
const SignMessageDialog = dynamic(() => import('../dialogs/SignMessageDialog'));
const SwitchNetworkDialog = dynamic(
  () => import('../dialogs/SwitchNetworkDialog')
);
const TransactionDialog = dynamic(() => import('../dialogs/TransactionDialog'));

import { useRouter } from 'next/router';
import { AppConfig } from 'src/types/config';
import AppDrawer from '../AppDrawer';
const ConnectWalletDialog = dynamic(
  () => import('../dialogs/ConnectWalletDialog')
);
const SelectCurrencyDialog = dynamic(
  () => import('../dialogs/SelectCurrencyDialog')
);
const SelectLanguageDialog = dynamic(
  () => import('../dialogs/SelectLanguageDialog')
);

interface Props {
  children?: React.ReactNode | React.ReactNode[];
  noSsr?: boolean;
  disablePadding?: boolean;
  appConfigProps?: AppConfig;
  isPreview?: boolean;
}

const MainLayout: React.FC<Props> = ({
  children,
  noSsr,
  disablePadding,
  appConfigProps,
  isPreview,
}) => {
  const { connector } = useWeb3React();
  const router = useRouter();

  const defaultAppConfig = useAppConfig();
  const appConfig = useMemo(() => {
    if (appConfigProps) {
      return appConfigProps;
    } else {
      return defaultAppConfig;
    }
  }, [defaultAppConfig, appConfigProps]);

  const transactions = useTransactions();

  const [switchOpen, setSwitchOpen] = useAtom(switchNetworkOpenAtom);
  const [switchChainId, setSwitchChainId] = useAtom(switchNetworkChainIdAtom);

  const [showSelectCurrency, setShowShowSelectCurrency] = useAtom(
    showSelectCurrencyAtom
  );

  const [showSelectLocale, setShowShowSelectLocale] =
    useAtom(showSelectLocaleAtom);

  const connectWalletDialog = useConnectWalletDialog();

  const handleCloseConnectWalletDialog = () => {
    connectWalletDialog.setOpen(false);
  };

  const handleCloseTransactionDialog = () => {
    if (transactions.redirectUrl) {
      router.replace(transactions.redirectUrl);
    }
    transactions.setRedirectUrl(undefined);
    transactions.setDialogIsOpen(false);
    transactions.setHash(undefined);
    transactions.setType(undefined);
    transactions.setMetadata(undefined);
    transactions.setError(undefined);
  };

  const handleCloseSwitchNetworkDialog = () => {
    setSwitchChainId(undefined);
    setSwitchOpen(false);
  };

  const signMessageDialog = useSignMessageDialog();

  const handleCloseSignMessageDialog = () => {
    signMessageDialog.setOpen(false);
    signMessageDialog.setError(undefined);
    signMessageDialog.setIsSuccess(false);
    signMessageDialog.setMessage(undefined);
  };

  const handleCloseCurrencySelect = () => {
    setShowShowSelectCurrency(false);
  };

  const handleCloseLocaleSelect = () => {
    setShowShowSelectLocale(false);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      connector.activate();
      const handleNetworkChange = (newNetwork: any, oldNetwork: any) => {
        // When a Provider makes its initial connection, it emits a "network"
        // event with a null oldNetwork along with the newNetwork. So, if the
        // oldNetwork exists, it represents a changing network
        window.location.reload();
      };

      connector?.provider?.on('chainChanged', handleNetworkChange);

      return () => {
        connector?.provider?.removeListener(
          'chainChanged',
          handleNetworkChange
        );
      };
    }
  }, []);

  const [isDrawerOpen, setIsDrawerOpen] = useAtom(drawerIsOpenAtom);

  const handleCloseDrawer = () => setIsDrawerOpen(false);

  const render = () => (
    <>
      <AppDrawer open={isDrawerOpen} onClose={handleCloseDrawer} />
      {showSelectCurrency && (
        <SelectCurrencyDialog
          dialogProps={{
            open: showSelectCurrency,
            onClose: handleCloseCurrencySelect,
            fullWidth: true,
            maxWidth: 'xs',
          }}
        />
      )}
      {showSelectLocale && (
        <SelectLanguageDialog
          dialogProps={{
            open: showSelectLocale,
            onClose: handleCloseLocaleSelect,
            fullWidth: true,
            maxWidth: 'xs',
          }}
        />
      )}
      {transactions.isOpen && (
        <TransactionDialog
          dialogProps={{
            open: transactions.isOpen,
            onClose: handleCloseTransactionDialog,
            fullWidth: true,
            maxWidth: 'xs',
          }}
          hash={transactions.hash}
          metadata={transactions.metadata}
          type={transactions.type}
          error={transactions.error}
        />
      )}
      {signMessageDialog.open && (
        <SignMessageDialog
          dialogProps={{
            open: signMessageDialog.open,
            onClose: handleCloseSignMessageDialog,
            fullWidth: true,
            maxWidth: 'xs',
          }}
          error={signMessageDialog.error}
          success={signMessageDialog.isSuccess}
          message={signMessageDialog.message}
        />
      )}
      {switchOpen && (
        <SwitchNetworkDialog
          dialogProps={{
            open: switchOpen,
            onClose: handleCloseSwitchNetworkDialog,
            fullWidth: true,
            maxWidth: 'xs',
          }}
          chainId={switchChainId}
        />
      )}
      {connectWalletDialog.isOpen && (
        <ConnectWalletDialog
          dialogProps={{
            open: connectWalletDialog.isOpen,
            onClose: handleCloseConnectWalletDialog,
            fullWidth: true,
            maxWidth: 'sm',
          }}
        />
      )}
      <Navbar appConfig={appConfig} isPreview={isPreview} />
      <Box
        sx={{ minHeight: isPreview ? undefined : '100vh' }}
        py={disablePadding ? 0 : 4}
      >
        {children}
      </Box>
      <Footer appConfig={appConfig} isPreview={isPreview} />
    </>
  );

  if (noSsr) {
    return <NoSsr>{render()}</NoSsr>;
  }

  return render();
};

export default MainLayout;
