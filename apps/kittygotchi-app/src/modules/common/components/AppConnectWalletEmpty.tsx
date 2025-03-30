import Wallet from '@mui/icons-material/Wallet';
import { Box, Button, Stack, Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { useConnectWalletDialog } from '../hooks/misc';

export default function AppConnectWalletEmtpy() {
  const connectWalletDialog = useConnectWalletDialog();

  const handleConnectWallet = () => {
    connectWalletDialog.show();
  };

  return (
    <Box py={2}>
      <Stack
        spacing={2}
        justifyContent="center"
        alignItems="center"
        alignContent="center"
      >
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
