import {
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  FormControlLabel,
  Grid,
  Stack,
  styled,
  Typography,
  useMediaQuery,
  useTheme,
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

const MobileButton = styled(Button)(({ theme }) => ({
  width: '100%',
  marginBottom: theme.spacing(1),
  borderRadius: '6px',
  minHeight: '42px',
  fontSize: '0.85rem',
}));

const MobileCheckboxLabel = styled(FormControlLabel)(({ theme }) => ({
  marginLeft: 0,
  marginRight: 0,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  '.MuiFormControlLabel-label': {
    fontSize: '0.85rem',
    marginLeft: theme.spacing(0.5),
    flexGrow: 1,
  },
}));

interface Props {
  addr?: string;
  net?: string;
  onGoBack: () => void;
}

export default function ListContractContainer({ addr, net, onGoBack }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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

  const MobileView = () => (
    <Box sx={{ width: '100%' }}>
      <Stack spacing={1.5} sx={{ width: '100%', mb: theme.spacing(1.5) }}>
        <MobileButton
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
        </MobileButton>
        <MobileButton
          onClick={handleOpen}
          startIcon={<FileDownloadOutlinedIcon />}
          variant="outlined"
          color="primary"
        >
          <FormattedMessage
            id="import.contract"
            defaultMessage="Import Contract"
          />
        </MobileButton>
        <MobileCheckboxLabel
          control={
            <Checkbox
              checked={showHidden}
              onChange={(e) => setShowHidden(e.target.checked)}
              size="small"
              sx={{ padding: theme.spacing(0.5) }}
            />
          }
          label={
            <Typography
              variant="body2"
              sx={{
                fontSize: theme.typography.caption.fontSize,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              <FormattedMessage
                id="show.hidden"
                defaultMessage="Show Hidden"
              />
            </Typography>
          }
        />
      </Stack>
    </Box>
  );

  const DesktopView = () => (
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
  );

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

      <Container maxWidth={'xl'} disableGutters={isMobile} sx={{ px: isMobile ? theme.spacing(1) : theme.spacing(2) }}>
        <Stack spacing={isMobile ? theme.spacing(1) : theme.spacing(2)}>
          <Box>
            <Grid container spacing={isMobile ? 1.5 : 3}>
              {!isContract && (
                <Grid item xs={12}>
                  <Stack spacing={isMobile ? 0.5 : 1} sx={{ mb: isMobile ? 1.5 : 2 }}>
                    <Typography
                      variant={isMobile ? 'h6' : 'h5'}
                      sx={{
                        fontSize: isMobile ? '1.15rem' : '1.5rem',
                        fontWeight: 600,
                        mb: 0.5
                      }}
                    >
                      <FormattedMessage
                        id="my.deployed.contracts"
                        defaultMessage="My deployed contracts"
                      />
                    </Typography>
                    <Typography
                      variant={isMobile ? 'body2' : 'body1'}
                      color="text.secondary"
                      sx={{
                        fontSize: isMobile ? '0.85rem' : 'inherit',
                      }}
                    >
                      <FormattedMessage
                        id="manage.contracts.description"
                        defaultMessage="Manage your deployed contracts"
                      />
                    </Typography>
                  </Stack>
                </Grid>
              )}
              {!isContract && (
                <Grid item xs={12}>
                  <Divider />
                </Grid>
              )}
              {!isContract && (
                <Grid item xs={12}>
                  <Box>
                    {isMobile ? <MobileView /> : <DesktopView />}
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
                  <Container disableGutters={isMobile}>
                    <Box sx={{ overflowX: 'hidden', width: '100%', maxWidth: '100vw' }}>
                      <ContractListDataGrid
                        showHidden={showHidden}
                        key={showHidden ? 'hidden' : 'visible'}
                        onClickContract={({ address, network }) => {
                          setAddress(address);
                          setNetwork(network);
                        }}
                        hideFormButton={true}
                      />
                    </Box>
                  </Container>
                )}
                {address && network && (
                  <Container disableGutters={isMobile}>
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
