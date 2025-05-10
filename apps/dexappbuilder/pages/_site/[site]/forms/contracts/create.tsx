import { Box, Container, Grid, Stack, Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';

import {
  useDeployableContractsQuery,
  useInfiniteListDeployedContracts,
} from '@/modules/forms/hooks';
import { DexkitApiProvider } from '@dexkit/core/providers';
import ContractButton from '@dexkit/ui/modules/contract-wizard/components/ContractButton';

import { PageHeader } from '@dexkit/ui/components/PageHeader';
import { myAppsApi } from '@dexkit/ui/constants/api';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import {
  GetStaticPaths,
  GetStaticPathsContext,
  GetStaticProps,
  GetStaticPropsContext,
} from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import AuthMainLayout from 'src/components/layouts/authMain';
import { getAppConfig } from 'src/services/app';

export default function FormsContractsPage() {
  const router = useRouter();

  const deployableContractsQuery = useDeployableContractsQuery();

  const [searchForm, setSearchForm] = useState<string>();
  const [searchDeployedContract, setSearchDeployedContract] =
    useState<string>();

  const handleChangeSearchTemplateForm = (value: string) => {
    setSearchDeployedContract(value);
  };

  const [page, setPage] = useState(1);

  const { account } = useWeb3React();

  const listDeployedContractQuery = useInfiniteListDeployedContracts({
    page,
    owner: account as string,
    name: searchDeployedContract,
  });

  const handlePrevPage = () => {
    if (page - 1 >= 1) {
      setPage((p) => p - 1);
    }
  };

  const handleNextPage = () => {
    if (listDeployedContractQuery.hasNextPage) {
      listDeployedContractQuery.fetchNextPage();
    }

    setPage((p) => p + 1);
  };

  return (
    <>
      <Container>
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
              },
              {
                caption: (
                  <FormattedMessage
                    id="deploy.contract"
                    defaultMessage="Deploy Contract"
                  />
                ),
                uri: `/forms/contracts/create`,
                active: true,
              },
            ]}
          />
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h4">
                  <FormattedMessage
                    id="deploy.your.contract"
                    defaultMessage="Deploy your contract"
                  />
                </Typography>
                {/* <Typography variant="body1" color="text.secondary">
                  <FormattedMessage
                    id="you.can.deploy.contracts.fromo.our.list.and.from.the.community.in.the.future"
                    defaultMessage="You can deploy contracts from our list and from the community in the future"
                  />
            </Typography>*/}
              </Grid>
              {/*    <Grid item xs={12}>
                <Typography variant="h5">
                  <FormattedMessage
                    id="thirdweb.contracts"
                    defaultMessage="ThirdWeb Contracts"
                  />
                </Typography>
              </Grid>*/}
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  {deployableContractsQuery.data?.map((contract, key) => (
                    <Grid item xs={12} sm={4} key={key}>
                      <ContractButton
                        title={contract.name}
                        description={contract.description}
                        creator={{
                          imageUrl: contract.publisherIcon,
                          name: contract.publisherName,
                        }}
                        href={`/forms/deploy/thirdweb/${contract.slug}`}
                        targetBlank={true}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Stack>
      </Container>
    </>
  );
}

(FormsContractsPage as any).getLayout = function getLayout(page: any) {
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
> = ({}: GetStaticPathsContext) => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};
