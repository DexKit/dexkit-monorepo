import { useSwitchNetwork } from '@/hooks/blockchain';
import { useCoinLeagueValidation } from '@/hooks/useCoinLeagueValidation';
import { ChainId } from '@/modules/common/constants/enums';
import { useConnectWalletDialog } from '@/modules/common/hooks/misc';
import {
  SwapHoriz as SwitchIcon,
  AccountBalanceWallet as WalletIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Typography
} from '@mui/material';
import React from 'react';
import { FormattedMessage } from 'react-intl';

interface CoinLeagueErrorBoundaryProps {
  children: React.ReactNode;
  showConnectWallet?: boolean;
  customErrorMessage?: string;
}

export default function CoinLeagueErrorBoundary({
  children,
  showConnectWallet = true,
  customErrorMessage
}: CoinLeagueErrorBoundaryProps) {
  const validation = useCoinLeagueValidation();
  const { openDialog: openSwitchNetwork } = useSwitchNetwork();
  const connectWalletDialog = useConnectWalletDialog();

  // Si no hay billetera conectada
  if (validation.needsWallet) {
    if (!showConnectWallet) {
      return null;
    }

    return (
      <Box py={4}>
        <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
          <Stack spacing={3} alignItems="center">
            <WalletIcon sx={{ fontSize: 80, color: 'primary.main' }} />

            <Box>
              <Typography variant="h4" gutterBottom>
                <FormattedMessage
                  id="coinleague.wallet.required.title"
                  defaultMessage="Wallet Required"
                />
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                {customErrorMessage || (
                  <FormattedMessage
                    id="coinleague.wallet.required.description"
                    defaultMessage="You need to connect your wallet to participate in Coin League games. This is a requirement to ensure secure and fair gameplay."
                  />
                )}
              </Typography>
            </Box>

            <Alert severity="info" sx={{ maxWidth: 600 }}>
              <AlertTitle>
                <FormattedMessage
                  id="coinleague.wallet.requirement"
                  defaultMessage="Wallet Requirement"
                />
              </AlertTitle>
              <FormattedMessage
                id="coinleague.wallet.requirement.details"
                defaultMessage="Coin League requires a connected wallet to manage your game entries, track your performance, and handle transactions securely."
              />
            </Alert>

            <Button
              variant="contained"
              size="large"
              startIcon={<WalletIcon />}
              onClick={() => connectWalletDialog.show()}
              sx={{ minWidth: 200 }}
            >
              <FormattedMessage
                id="coinleague.connect.wallet"
                defaultMessage="Connect Wallet"
              />
            </Button>
          </Stack>
        </Paper>
      </Box>
    );
  }

  // Si la billetera está conectada pero no está en Polygon
  if (validation.needsNetworkSwitch) {
    return (
      <Box py={4}>
        <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
          <Stack spacing={3} alignItems="center">
            <WarningIcon sx={{ fontSize: 80, color: 'warning.main' }} />

            <Box>
              <Typography variant="h4" gutterBottom color="warning.main">
                <FormattedMessage
                  id="coinleague.wrong.network.title"
                  defaultMessage="Wrong Network"
                />
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                <FormattedMessage
                  id="coinleague.wrong.network.description"
                  defaultMessage="Coin League games are only available on Polygon network. Please switch your wallet to Polygon to continue."
                />
              </Typography>
            </Box>

            <Box>
              <Chip
                label={`Current Network: ${validation.chainId}`}
                color="error"
                sx={{ mb: 2 }}
              />
              <Chip
                label="Required: Polygon (137)"
                color="success"
              />
            </Box>

            <Alert severity="warning" sx={{ maxWidth: 600 }}>
              <AlertTitle>
                <FormattedMessage
                  id="coinleague.network.requirement"
                  defaultMessage="Network Requirement"
                />
              </AlertTitle>
              <FormattedMessage
                id="coinleague.network.requirement.details"
                defaultMessage="Coin League requires Polygon network (Chain ID: 137) for optimal performance and lower transaction costs. Other networks are not supported for gameplay."
              />
            </Alert>

            <Button
              variant="contained"
              size="large"
              startIcon={<SwitchIcon />}
              onClick={() => openSwitchNetwork(ChainId.Polygon)}
              sx={{ minWidth: 200 }}
            >
              <FormattedMessage
                id="coinleague.switch.to.polygon"
                defaultMessage="Switch to Polygon"
              />
            </Button>

            <Typography variant="caption" color="text.secondary">
              <FormattedMessage
                id="coinleague.network.help"
                defaultMessage="If you need help switching networks, check your wallet's network settings or contact support."
              />
            </Typography>
          </Stack>
        </Paper>
      </Box>
    );
  }

  // Si todo está correcto, renderizar el contenido
  return <>{children}</>;
}
