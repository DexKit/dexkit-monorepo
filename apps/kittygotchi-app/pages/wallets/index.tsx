import MainLayout from '@/modules/common/components/layouts/MainLayout';
import AddWalletDialog from '@/modules/wallet/components/dialogs/AddWalletDialog';
import { useWallets } from '@/modules/wallet/hooks';
import { Wallet } from '@/modules/wallet/types';
import {
  Box,
  Button,
  List,
  ListItemButton,
  ListItemText,
  Stack
} from '@mui/material';
import { NextPage } from 'next';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';

const WalletsPage: NextPage = () => {
  const { wallets } = useWallets();

  const [showAddWallet, setShowAddWallet] = useState(false);

  const handleAddWallet = () => {
    setShowAddWallet(true);
  };

  const handleCloseAddWallet = () => {
    setShowAddWallet(false);
  };

  return (
    <>
      <AddWalletDialog
        dialogProps={{
          open: showAddWallet,
          fullWidth: true,
          maxWidth: 'sm',
          onClose: handleCloseAddWallet,
        }}
      />
      <MainLayout>
        <Stack>
          <List>
            {wallets.map((wallet: Wallet, index: number) => (
              <ListItemButton key={index}>
                <ListItemText primary={wallet.name} />
              </ListItemButton>
            ))}
          </List>
          <Box>
            <Button onClick={handleAddWallet}>
              <FormattedMessage id="add.wallet" defaultMessage="Add Wallet" />
            </Button>
          </Box>
        </Stack>
      </MainLayout>
    </>
  );
};

export default WalletsPage;
