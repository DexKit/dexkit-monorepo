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

import AddIcon from '@mui/icons-material/Add';

const ImportContractDialog = dynamic(
  () =>
    import(
      '@dexkit/ui/modules/contract-wizard/components/dialogs/ImportContractDialog'
    ),
);

import Link from '@dexkit/ui/components/AppLink';
import ContractListDataGrid from '@dexkit/ui/modules/contract-wizard/components/ContractListDataGrid';
import { useQueryClient } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import ManageContractContainer from './ManageContractContainer';

interface Props {
  addr?: string;
  net?: string;
  onGoBack: () => void;
}

export default function ListContractContainer({ addr, net, onGoBack }: Props) {
  const [address, setAddress] = useState(addr);

  const [network, setNetwork] = useState(net);

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

  const isContract = address && network;

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
          <Box>
            <Grid container spacing={2}>
              {!isContract && (
                <Grid item xs={12}>
                  <Typography variant="h5">
                    <FormattedMessage
                      id="my.deployed.contracts"
                      defaultMessage="My deployed contracts"
                    />
                  </Typography>
                </Grid>
              )}
              {!isContract && (
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
              )}
              {!isContract && (
                <Grid item xs={12}>
                  <Divider />
                </Grid>
              )}
              <Grid item xs={12}>
                {(!address || !network) && (
                  <Container>
                    <ContractListDataGrid
                      showHidden={showHidden}
                      key={showHidden ? 'hidden' : 'visible'}
                      onClickContract={({ address, network }) => {
                        setAddress(address);
                        setNetwork(network);
                      }}
                      hideFormButton={true}
                    />
                  </Container>
                )}
                {address && network && (
                  <Container>
                    <ManageContractContainer
                      address={address}
                      network={network}
                      onGoBack={() => {
                        setAddress('');
                        setNetwork('');
                        onGoBack();
                      }}
                    />
                  </Container>
                )}
              </Grid>
            </Grid>
          </Box>
        </Stack>
      </Container>
    </>
  );
}
