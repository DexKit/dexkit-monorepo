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
  styled,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { FormattedMessage } from 'react-intl';

import { DexkitApiProvider } from '@dexkit/core/providers';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';

import ContractListDataGrid from '@/modules/forms/components/ContractListDataGrid';
import { ConnectWalletBox } from '@dexkit/ui/components/ConnectWalletBox';
import { PageHeader } from '@dexkit/ui/components/PageHeader';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import AddIcon from '@mui/icons-material/Add';
import {
  GetStaticPaths,
  GetStaticPathsContext,
  GetStaticProps,
  GetStaticPropsContext,
} from 'next';

import AuthMainLayout from 'src/components/layouts/authMain';

const ImportContractDialog = dynamic(
  () =>
    import(
      '@dexkit/ui/modules/contract-wizard/components/dialogs/ImportContractDialog'
    ),
);

import Link from '@dexkit/ui/components/AppLink';
import LoginAppButton from '@dexkit/ui/components/LoginAppButton';
import { myAppsApi } from '@dexkit/ui/constants/api';
import { useAuth } from '@dexkit/ui/hooks/auth';
import { QueryClient, dehydrate, useQueryClient } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { getAppConfig } from 'src/services/app';

const MobileButton = styled(Button)(({ theme }) => ({
  width: '100%',
  marginBottom: '8px',
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

export default function FormsListContractsPage() {
  const { isActive } = useWeb3React();
  const { isLoggedIn } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [forceRerender, setForceRerender] = useState(false);

  useEffect(() => {
    setForceRerender(true);
  }, [isMobile]);

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

  const MobileView = () => (
    <Box sx={{ width: '100%' }}>
      <Stack spacing={1.5} sx={{ width: '100%', mb: 2 }}>
        <MobileButton
          href="/forms/contracts/create"
          LinkComponent={Link}
          startIcon={<AddIcon />}
          variant="contained"
          color="primary"
          sx={{
            color: 'white !important',
            '&:hover': {
              color: 'white !important'
            },
            '& .MuiButton-startIcon': {
              color: 'white !important'
            }
          }}
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
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      spacing={2}
      sx={{ width: '100%', mb: 2 }}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
      >
        <Button
          href="/forms/contracts/create"
          LinkComponent={Link}
          startIcon={<AddIcon />}
          variant="contained"
          color="primary"
          size="medium"
          sx={{
            color: 'white !important',
            '&:hover': {
              color: 'white !important'
            },
            '& .MuiButton-startIcon': {
              color: 'white !important'
            }
          }}
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
          size="medium"
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

      <Container
        maxWidth="xl"
        disableGutters={isMobile}
        sx={{
          px: isMobile ? 1 : 2
        }}
      >
        <Stack spacing={isMobile ? 1 : 2}>
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
          <Box sx={{ width: '100%' }}>
            <Grid container spacing={isMobile ? 1 : 2}>
              <Grid size={12}>
                <Typography
                  variant="h5"
                  sx={{
                    fontSize: { xs: '1.25rem', sm: '1.5rem' },
                    fontWeight: 600,
                    mb: 0.5
                  }}
                >
                  <FormattedMessage
                    id="my.deployed.contracts"
                    defaultMessage="My deployed contracts"
                  />
                </Typography>
              </Grid>
              <Grid size={12}>
                {isMobile ? <MobileView /> : <DesktopView />}
              </Grid>
              <Grid size={12}>
                <Divider />
              </Grid>
              <Grid size={12} sx={{ width: '100%' }}>
                {isActive ? (
                  isLoggedIn ? (
                    <Box
                      sx={{
                        width: '100%',
                        maxWidth: '100%'
                      }}
                    >
                      <ContractListDataGrid
                        showHidden={showHidden}
                        key={`${showHidden ? 'hidden' : 'visible'}-${forceRerender ? 'rerendered' : 'initial'}`}
                      />
                    </Box>
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

(FormsListContractsPage as any).getLayout = function getLayout(page: any) {
  return (
    <AuthMainLayout>
      <DexkitApiProvider.Provider value={{ instance: myAppsApi }}>
        {page}
      </DexkitApiProvider.Provider>
    </AuthMainLayout>
  );
};

type Params = {
  site?: string;
};

export const getStaticProps: GetStaticProps = async ({
  params,
}: GetStaticPropsContext<Params>) => {
  const queryClient = new QueryClient();
  const configResponse = await getAppConfig(params?.site, 'no-page-defined');

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      ...configResponse,
    },
    revalidate: 3000,
  };
};

export const getStaticPaths: GetStaticPaths<
  Params
> = ({ }: GetStaticPathsContext) => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};
