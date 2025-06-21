import {
  Alert,
  Backdrop,
  Box,
  CircularProgress,
  Grid,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';

import { DexkitApiProvider } from '@dexkit/core/providers';
import SecurityIcon from '@mui/icons-material/Security';
import { FormattedMessage } from 'react-intl';

import { LoginButton } from 'src/components/LoginButton';

import { useAdminWidgetConfigQuery } from '@/modules/wizard/hooks/widget';
import { EditWidgetWizardContainer } from '@/modules/wizard/widget/components/containers/EditWidgetWizardContainer';
import LoginAppButton from '@dexkit/ui/components/LoginAppButton';
import { myAppsApi } from '@dexkit/ui/constants/api';
import { useAuth } from '@dexkit/ui/hooks/auth';
import { useMemo } from 'react';

interface Props {
  id: number;
  isOnAdminDashboard?: boolean;
  onGoBack?: () => void;
}

export const AdminWidgetContainer = ({
  id,
  onGoBack,
  isOnAdminDashboard,
}: Props) => {
  const { isLoggedIn } = useAuth();

  const {
    data: widget,
    error: configError,
    isLoading: isConfigLoading,
    isError: isConfigError,
    refetch,
  } = useAdminWidgetConfigQuery({
    id: Number(id),
  });

  const config = useMemo(() => {
    if (widget?.config) {
      return JSON.parse(widget?.config);
    }
  }, [widget?.config]);

  const theme = useTheme();

  return (
    <>
      <Backdrop
        sx={{
          color: theme.palette.primary.main,
          zIndex: theme.zIndex.drawer + 1,
        }}
        open={isConfigLoading}
      >
        <CircularProgress color="inherit" size={80} />
      </Backdrop>
      {isConfigError &&
        ((configError as any)?.response?.status as number) !== 403 && (
          <Grid item xs={12}>
            <Alert severity="error">{String(configError)}</Alert>
          </Grid>
        )}
      {!isLoggedIn ? (
        <Box justifyContent={'center'} display={'flex'} alignItems={'center'}>
          <Stack spacing={2} justifyContent={'center'} alignItems={'center'}>
            <SecurityIcon fontSize="large" />
            <Box sx={{ maxWidth: '400px' }}>
              <LoginAppButton
                connectWalletMsg={
                  <FormattedMessage
                    id="start.by.connect.wallet.widget"
                    defaultMessage="Connect wallet to account that owns this widget: {name}"
                    values={{
                      name: config?.name,
                    }}
                  />
                }
              />
            </Box>
          </Stack>
        </Box>
      ) : isConfigError &&
        ((configError as any)?.response?.status as number) === 403 ? (
        <Box
          justifyContent={'center'}
          display={'flex'}
          alignItems={'center'}
          sx={{ pt: 2 }}
        >
          <Stack spacing={2} justifyContent={'center'} alignItems={'center'}>
            <SecurityIcon fontSize="large" />
            <Alert severity="warning" sx={{ maxWidth: '500px' }}>
              <Typography>
                <FormattedMessage
                  id="connected.wallet.not.authorized.to.access.this.account.switch.to.account.that.owns.this.account.widget"
                  defaultMessage="Connected wallet not authorized to access this widget. Switch to account that owns this widget and login"
                ></FormattedMessage>
              </Typography>
            </Alert>
            <Box sx={{ maxWidth: '400px' }}>
              <LoginButton
                allowAlwaysConnectLogin={true}
                onLogin={() => refetch()}
              />
            </Box>
          </Stack>
        </Box>
      ) : (
        <DexkitApiProvider.Provider value={{ instance: myAppsApi }}>
          {widget && (
            <EditWidgetWizardContainer
              widget={widget}
              isOnAdminDashboard={true}
              onGoBack={onGoBack}
            />
          )}
        </DexkitApiProvider.Provider>
      )}
    </>
  );
};
