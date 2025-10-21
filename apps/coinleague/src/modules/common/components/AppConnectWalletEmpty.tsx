import { useWalletConnect } from '@dexkit/ui/hooks/wallet';
import { default as Wallet, default as WalletIcon } from '@mui/icons-material/Wallet';
import { Box, Button, Stack, Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';

export default function AppConnectWalletEmtpy() {
  const { connectWallet } = useWalletConnect();

  const handleConnectWallet = () => {
    connectWallet();
  };

  return (
    <Box py={2}>
      <Stack
        spacing={2}
        justifyContent="center"
        alignItems="center"
      >
        <Box>
          <WalletIcon sx={{ fontSize: 60 }} />
        </Box>


        <Box>
          <Typography variant="h5" align="center">
            <FormattedMessage
              id="connect.wallet"
              defaultMessage="Connect wallet"
            />
          </Typography>
          <Typography variant="body1" color="textSecondary" align="center">
            <FormattedMessage
              id="you.need.to.connect.your.wallet.to.continue"
              defaultMessage="You need to connect to you wallet to continue"
            />
          </Typography>
        </Box>
        <Button
          startIcon={<Wallet />}
          onClick={handleConnectWallet}
          variant="contained"
        >
          <FormattedMessage id="connect" defaultMessage="Connect" />
        </Button>
      </Stack>
    </Box>
  );
}
