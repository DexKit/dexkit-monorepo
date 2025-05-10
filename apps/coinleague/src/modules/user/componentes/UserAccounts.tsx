import { isAddressEqual, truncateAddress } from '@dexkit/core/utils';
import AppConfirmDialog from '@dexkit/ui/components/AppConfirmDialog';
import { useAuth } from '@dexkit/ui/hooks/auth';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import {
    CircularProgress,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Tooltip,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import {
    useAddAccountUserMutation,
    useRemoveAccountUserMutation,
} from '../hooks';

interface Props {
  accounts: { address: string }[];
}

export function UserAccounts(props: Props) {
  const { account } = useWeb3React();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user } = useAuth();
  const [accountToDelete, setAccountToDelete] = useState<string>();
  const [openAccountToDeleteDialog, setOpenAccountToDeleteDialog] =
    useState<boolean>(false);
  const userAddAcountMutation = useAddAccountUserMutation();
  const userRemoveAcountMutation = useRemoveAccountUserMutation();

  const { accounts } = props;

  return (
    <>
      {openAccountToDeleteDialog && (
        <AppConfirmDialog
          DialogProps={{
            open: openAccountToDeleteDialog,
            onClose: () => {
              setAccountToDelete(undefined);
              setOpenAccountToDeleteDialog(false);
            },
          }}
          onConfirm={async () => {
            await userRemoveAcountMutation.mutateAsync(accountToDelete);
            setAccountToDelete(undefined);
            setOpenAccountToDeleteDialog(false);
          }}
          title={
            <FormattedMessage
              id={'delete.account.from.user'}
              defaultMessage={'Delete account from user'}
            />
          }
        >
          <Typography variant="subtitle1">
            <FormattedMessage
              id={'are.you.sure.you.want.to.delete.this.account'}
              defaultMessage={'Account to remove: {account}'}
              values={{
                account: accountToDelete,
              }}
            />
          </Typography>
        </AppConfirmDialog>
      )}

      <Typography variant="h5">
        <FormattedMessage id={'accounts'} defaultMessage={'Accounts'} />
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="subtitle1">
            <FormattedMessage
              id={'user.accounts'}
              defaultMessage={'User accounts:'}
            />
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <List>
            {accounts.map((v, index) => (
              <ListItem
                key={index}
                secondaryAction={
                  <>
                    {isAddressEqual(user?.address, v.address) !== true && (
                      <Tooltip
                        title={
                          <FormattedMessage
                            id={'remove.account.from.user'}
                            defaultMessage={'Remove account from user'}
                          />
                        }
                      >
                        <IconButton
                          aria-label="delete"
                          onClick={() => {
                            setOpenAccountToDeleteDialog(true);
                            setAccountToDelete(v.address);
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </>
                }
              >
                <ListItemAvatar>
                  {isAddressEqual(user?.address, v.address) === true && (
                    <Tooltip
                      title={
                        <FormattedMessage
                          id={
                            'account.which.you.signed.message.to.authenticate.to.app'
                          }
                          defaultMessage={
                            'Account which you signed message to authenticate to app'
                          }
                        />
                      }
                    >
                      <AccountCircleIcon />
                    </Tooltip>
                  )}
                </ListItemAvatar>
                <ListItemText
                  primary={isMobile ? truncateAddress(v.address) : v.address}
                />
              </ListItem>
            ))}
          </List>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <Stack spacing={2}>
            <Typography variant="body2">
              <FormattedMessage
                id="switch.your.wallet.to.another.account.and.click.connect.account"
                defaultMessage={
                  'Switch your wallet to another account and click connect account'
                }
              />
            </Typography>
            <Box>
              <Button
                variant={'contained'}
                disabled={accounts
                  ?.map((a) => a.address.toLowerCase())
                  .includes(account?.toLowerCase() || '')}
                onClick={() => userAddAcountMutation.mutate()}
                startIcon={
                  userAddAcountMutation.isLoading && <CircularProgress />
                }
              >
                {userAddAcountMutation.isLoading ? (
                  <FormattedMessage
                    id={'sign.message'}
                    defaultMessage={'Sign message'}
                  />
                ) : (
                  <FormattedMessage
                    id="connect.account"
                    defaultMessage={'Connect account'}
                  />
                )}
              </Button>
            </Box>

            <Typography variant="body1">
              <FormattedMessage
                id="wallet.connected.account"
                defaultMessage={'Wallet connected account'}
              />
              :{isMobile ? truncateAddress(account) : account}
            </Typography>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}
