import { truncateAddress } from '@dexkit/core/utils';
import { useAuth } from '@dexkit/ui/hooks/auth';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import { Alert, Box } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { LoginButton } from 'src/components/LoginButton';

export function MismatchAccount() {
  const { account } = useWeb3React();
  const { user, isLoggedIn } = useAuth();

  if (
    isLoggedIn &&
    account &&
    user &&
    account.toLowerCase() !== user.address?.toLowerCase()
  ) {
    return (
      <Box sx={{ mb: 2 }}>
        <Alert
          severity="info"
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 1,
            '& .MuiAlert-message': {
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 1,
              width: '100%'
            }
          }}
        >
          <FormattedMessage
            id={'mismatch.account.admin.view'}
            defaultMessage={
              'You are connected to {account} but logged as {loggedAccount}. If you want to see apps associated with current connected account, click on'
            }
            values={{
              account: truncateAddress(account),
              loggedAccount: truncateAddress(user.address?.toLowerCase()),
            }}
          />
          <LoginButton />
        </Alert>
      </Box>
    );
  }

  return null;
}
