import { FormattedMessage, IntlProvider } from 'react-intl';

import { SnackbarProvider } from 'notistack';

import type { AppTransaction } from '@dexkit/core/types';

import {
  Button,
  CssBaseline,
  Stack,
  Theme,
  ThemeProvider,
  Typography,
} from '@mui/material';
import { SetStateAction, WritableAtom } from 'jotai';

import React from 'react';

import { AppErrorBoundary } from '@dexkit/ui/components/AppErrorBoundary';
import { DexKitContext } from './DexKitContext';
export interface DexkitProviderProps {
  theme: Theme;
  locale: string;
  defaultLocale: string;
  pendingTransactionsAtom: WritableAtom<
    {
      [key: string]: AppTransaction;
    },
    SetStateAction<{
      [key: string]: AppTransaction;
    }>,
    void
  >;
  children: React.ReactNode | React.ReactNode[];
}

export function DexkitProvider({
  children,
  theme,
  pendingTransactionsAtom,
  locale,
  defaultLocale,
}: DexkitProviderProps) {
  return (
    <DexKitContext.Provider value={{}}>
      <ThemeProvider theme={theme}>
        <IntlProvider locale={locale} defaultLocale={locale}>
          <AppErrorBoundary
            fallbackRender={({ resetErrorBoundary, error }) => (
              <Stack justifyContent="center" alignItems="center">
                <Typography variant="h6">
                  <FormattedMessage
                    id="something.went.wrong"
                    defaultMessage="Oops, something went wrong"
                    description="Something went wrong error message"
                  />
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  {String(error)}
                </Typography>
                <Button color="primary" onClick={resetErrorBoundary}>
                  <FormattedMessage
                    id="try.again"
                    defaultMessage="Try again"
                    description="Try again"
                  />
                </Button>
              </Stack>
            )}
          >
            <SnackbarProvider
              maxSnack={3}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <CssBaseline />
              {children}
            </SnackbarProvider>
          </AppErrorBoundary>
        </IntlProvider>
      </ThemeProvider>
    </DexKitContext.Provider>
  );
}
