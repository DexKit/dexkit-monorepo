import type { AppProps } from "next/app";

import { getConnectorName } from "@dexkit/core/utils";
import {
  useExecuteTransactionsDialog,
  useOrderedConnectors,
} from "@dexkit/ui/hooks";
import { ThemeProvider, createTheme } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useEffect, useMemo } from "react";
import { IntlProvider } from "react-intl";

import { Web3ReactProvider, useWeb3React } from "@web3-react/core";
import { atom } from "jotai";
import { SnackbarProvider } from "notistack";

import { DexkitExchangeContext } from "@dexkit/exchange/contexts";
import { useExchangeContextState } from "@dexkit/exchange/hooks";
import AppTransactionWatchDialog from "@dexkit/ui/components/AppTransactionWatchDialog";

import { ChainId } from "@dexkit/core";
import {
  DEFAULT_BASE_TOKENS,
  DEFAULT_QUOTE_TOKENS,
  KIT_TOKEN,
  USDT_TOKEN,
} from "@dexkit/exchange/constants/tokens";

const theme = createTheme({
  typography: {
    fontFamily: '"Sora", sans-serif',
  },
  palette: {
    mode: "dark",
    background: {
      default: "#151B22",
      paper: "#0D1017",
    },
    primary: {
      main: "#F9AB74",
    },
  },
});

const ConnectorActivator = () => {
  const { connector } = useWeb3React();

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      connector &&
      connector.connectEagerly
    ) {
      connector.connectEagerly();
    }
  }, [connector]);

  return null;
};

const Modals = () => {
  const txDialog = useExecuteTransactionsDialog();

  return (
    <>
      {txDialog.show && (
        <AppTransactionWatchDialog
          DialogProps={{
            open: true,
            maxWidth: "sm",
            fullWidth: true,
            onClose: txDialog.handleClose,
          }}
          transactions={txDialog.transactions}
          options={txDialog.options}
        />
      )}
    </>
  );
};

const Context = ({ children }: { children: React.ReactNode }) => {
  const exchangeState = useExchangeContextState({
    baseTokens: DEFAULT_BASE_TOKENS[ChainId.Polygon],
    quoteTokens: DEFAULT_QUOTE_TOKENS[ChainId.Polygon],
    quoteToken: KIT_TOKEN,
    baseToken: USDT_TOKEN,
    buyTokenPercentageFee: 0.01,
    affiliateAddress: "0x5bD68B4d6f90Bcc9F3a9456791c0Db5A43df676d",
    feeRecipient: "0x5bD68B4d6f90Bcc9F3a9456791c0Db5A43df676d",
  });

  return (
    <DexkitExchangeContext.Provider value={exchangeState}>
      {children}
    </DexkitExchangeContext.Provider>
  );
};

const selectedWalletAtom = atom<string>("");
const client = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  const connectors = useOrderedConnectors({ selectedWalletAtom });

  const getLayout = (Component as any).getLayout || ((page: any) => page);

  const web3ReactKey = useMemo(
    () =>
      connectors.map((connector) => getConnectorName(connector[0])).join("-"),
    [connectors]
  );

  return (
    <IntlProvider locale="en-US" defaultLocale="en-US">
      <QueryClientProvider client={client}>
        <SnackbarProvider>
          <Web3ReactProvider key={web3ReactKey} connectors={connectors}>
            <ConnectorActivator />
            <ThemeProvider theme={theme}>
              <Modals />
              <Context>{getLayout(<Component {...pageProps} />)}</Context>
            </ThemeProvider>
          </Web3ReactProvider>
        </SnackbarProvider>
      </QueryClientProvider>
    </IntlProvider>
  );
}
