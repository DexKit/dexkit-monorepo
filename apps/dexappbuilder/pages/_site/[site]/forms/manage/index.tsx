const AccountFormsTable = dynamic(
  () => import('@/modules/forms/components/AccountFormsTable'),
);

import { useListFormsQuery } from '@/modules/forms/hooks';
import { DexkitApiProvider } from '@dexkit/core/providers';
import { AppErrorBoundary } from '@dexkit/ui/components/AppErrorBoundary';
import Link from '@dexkit/ui/components/AppLink';
import { ConnectWalletButton } from '@dexkit/ui/components/ConnectWalletButton';
import { PageHeader } from '@dexkit/ui/components/PageHeader';
import { myAppsApi } from '@dexkit/ui/constants/api';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import Add from '@mui/icons-material/Add';
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import AuthMainLayout from 'src/components/layouts/authMain';

export default function FormsAccountPage() {
  const { account: address } = useWeb3React();

  const [searchForm, setSearchForm] = useState<string>();

  const listFormsQuery = useListFormsQuery({
    creatorAddress: address as string,
    query: searchForm,
  });

  return (
    <>
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
                    id="dexcontracts"
                    defaultMessage="DexContracts"
                  />
                ),
                uri: '/forms',
              },
              {
                caption: (
                  <FormattedMessage
                    id="manage.contract.forms"
                    defaultMessage="Manage Contract Forms"
                  />
                ),
                uri: `/forms/manage`,
                active: true,
              },
            ]}
          />
          <Box>
            <Stack
              direction="row"
              alignItems="center"
              alignContent="center"
              justifyContent="space-between"
              sx={{ mb: 2 }}
            >
              <Typography variant="h5">
                <FormattedMessage
                  id="my.contract.forms"
                  defaultMessage="My Contract Forms"
                />
              </Typography>
              <Button
                LinkComponent={Link}
                href="/forms/create"
                size="medium"
                variant="contained"
                color="primary"
                startIcon={<Add />}
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
                  id="create.contract.form"
                  defaultMessage="NEW CONTRACT FORM"
                />
              </Button>
            </Stack>
          </Box>
          <Box>
            <Container maxWidth={false} disableGutters>
              {!address ? (
                <div>
                  <ConnectWalletButton />
                </div>
              ) : (
                <AppErrorBoundary
                  fallbackRender={({ resetErrorBoundary, error }) => {
                    return (
                      <Stack justifyContent="center" alignItems="center">
                        <Typography variant="h6">
                          <FormattedMessage
                            id="something.went.wrong"
                            defaultMessage="Oops, something went wrong"
                            description="Something went wrong error message"
                          />
                        </Typography>
                        <Typography variant="body1" color="textSecondary">
                          {String(error)}
                        </Typography>
                        <Button
                          color="primary"
                          onClick={resetErrorBoundary}
                        >
                          <FormattedMessage
                            id="try.again"
                            defaultMessage="Try again"
                            description="Try again"
                          />
                        </Button>
                      </Stack>
                    );
                  }}
                >
                  <AccountFormsTable
                    forms={listFormsQuery.data ?? []}
                    refetch={async () => {
                      await listFormsQuery.refetch();
                    }}
                    count={listFormsQuery.data?.length ?? 0}
                    onSearch={(value: string) => setSearchForm(value)}
                  />
                </AppErrorBoundary>
              )}
            </Container>
          </Box>
        </Stack>
      </Container>
    </>
  );
}

(FormsAccountPage as any).getLayout = function getLayout(page: any) {
  return (
    <AuthMainLayout>
      <DexkitApiProvider.Provider value={{ instance: myAppsApi }}>
        {page}
      </DexkitApiProvider.Provider>
    </AuthMainLayout>
  );
};
