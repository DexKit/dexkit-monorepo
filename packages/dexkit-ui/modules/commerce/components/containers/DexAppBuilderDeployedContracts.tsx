import {
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  FormControlLabel,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { FormattedMessage } from 'react-intl';


import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';

import { ConnectWalletBox } from '@dexkit/ui/components/ConnectWalletBox';
import { PageHeader } from '@dexkit/ui/components/PageHeader';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import ContractListDataGrid from '@dexkit/web3forms/components/ContractListDataGrid';
import AddIcon from '@mui/icons-material/Add';
import { LoginAppButton } from 'src/components/LoginAppButton';

const ImportContractDialog = dynamic(
  () => import('@/modules/forms/components/dialogs/ImportContractDialog'),
);

import Link from '@dexkit/ui/components/AppLink';
import { useAuth } from '@dexkit/ui/hooks/auth';
import { useQueryClient } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { useState } from 'react';

export default function DexAppBuilderDeployedContracts() {
  const { isActive } = useWeb3React();
  const { isLoggedIn } = useAuth();

  const [showHidden, setShowHidden] = useState(false);

  const [showImport, setShowImport] = useState(false);

  const queryClient = useQueryClient();

  const handleClose = async () => {
    setShowImport(false);
    await queryClient.invalidateQueries(['LIST_DEPLOYED_CONTRACTS']);
  };

  const handleOpen = () => {
    setShowImport(true);
  };

  return (
    <>
      {showImport && (
        <ImportContractDialog
          DialogProps={{
            open: showImport,
            onClose: handleClose,
            maxWidth: 'sm',
            fullWidth: true,
          }}
        />
      )}

      <Container maxWidth={'xl'}>
        <Stack spacing={2}>
          <PageHeader
            breadcrumbs={[
              {
                caption: <FormattedMessage id="home" defaultMessage="Home" />,
                uri: '/',
              },
              {
                caption: (
                  <FormattedMessage
                    id="dexgenerator"
                    defaultMessage="DexGenerator"
                  />
                ),
                uri: '/forms',
              },
              {
                caption: (
                  <FormattedMessage
                    id="manage.contracts"
                    defaultMessage="Manage Contracts"
                  />
                ),
                uri: `/forms/contracts/list`,
                active: true,
              },
            ]}
          />
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h5">
                  <FormattedMessage
                    id="my.deployed.contracts"
                    defaultMessage="My deployed contracts"
                  />
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Box>
                  <Stack
                    alignItems="center"
                    justifyContent="space-between"
                    direction="row"
                    spacing={2}
                  >
                    <Stack alignItems="center" direction="row" spacing={2}>
                      <Button
                        href="/forms/contracts/create"
                        LinkComponent={Link}
                        startIcon={<AddIcon />}
                        variant="contained"
                        color="primary"
                      >
                        <FormattedMessage
                          id="new.contract"
                          defaultMessage="New contract"
                        />
                      </Button>
                      <Button
                        onClick={handleOpen}
                        startIcon={<FileDownloadOutlinedIcon />}
                        variant="outlined"
                        color="primary"
                      >
                        <FormattedMessage
                          id="import.contract"
                          defaultMessage="Import Contract"
                        />
                      </Button>
                    </Stack>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={showHidden}
                          onChange={(e) => setShowHidden(e.target.checked)}
                        />
                      }
                      label={
                        <FormattedMessage
                          id="show.hidden"
                          defaultMessage="Show Hidden"
                        />
                      }
                    />
                  </Stack>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                {isActive ? (
                  isLoggedIn ? (
                    <Container>
                      <ContractListDataGrid
                        showHidden={showHidden}
                        key={showHidden ? 'hidden' : 'visible'}
                      />
                    </Container>
                  ) : (
                    <Stack justifyContent={'center'} alignItems={'center'}>
                      <Box sx={{ maxWidth: '500px' }}>
                        <LoginAppButton />
                      </Box>
                    </Stack>
                  )
                ) : (
                  <ConnectWalletBox
                    subHeaderMsg={
                      <FormattedMessage
                        id="connect.wallet.to.see.contracts.associated.with.your.account"
                        defaultMessage="Connect wallet to see contracts associated with your account"
                      />
                    }
                  />
                )}
              </Grid>
            </Grid>
          </Box>
        </Stack>
      </Container>
    </>
  );
}

