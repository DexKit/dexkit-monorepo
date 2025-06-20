import { useContract, useContractMetadata } from '@thirdweb-dev/react';
import { useRouter } from 'next/router';

import ThirdwebV4Provider from '@/modules/contract-wizard/provider/ThirdwebV4Provider';
import NftDropSection from '@dexkit/dexappbuilder-viewer/components/sections/NftDropSection';
import { PageHeader } from '@dexkit/ui/components/PageHeader';
import { Container, Grid, Skeleton } from '@mui/material';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { GetStaticPropsContext } from 'next';
import { FormattedMessage } from 'react-intl';
import MainLayout from 'src/components/layouts/main';
import { REVALIDATE_PAGE_TIME } from 'src/constants';
import { getAppConfig } from 'src/services/app';

function TokenDrop() {
  const router = useRouter();
  const { network, address } = router.query;

  const { contract } = useContract(address as string, 'token-drop');

  const { data: contractMetadata, isLoading } = useContractMetadata(contract);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Container>
          <PageHeader
            breadcrumbs={[
              {
                caption: <FormattedMessage id="home" defaultMessage="Home" />,
                uri: '/',
              },
              {
                caption: (
                  <FormattedMessage id="nft.drop" defaultMessage="NFT Drop" />
                ),
                uri: `/drop/nft/${network}/${address}`,
              },
              {
                caption: isLoading ? <Skeleton /> : contractMetadata?.name,
                uri: `/drop/nft/${network}/${address}`,
                active: true,
              },
            ]}
          />
        </Container>
      </Grid>
      <Grid item xs={12}>
        <NftDropSection
          section={{
            type: 'nft-drop',
            settings: {
              address: address as string,
              network: network as string,
              variant: 'detailed',
            },
          }}
        />
      </Grid>
    </Grid>
  );
}

export default function Wrapper() {
  const router = useRouter();
  const { network } = router.query;

  return (
    <ThirdwebV4Provider network={network as string}>
      <TokenDrop />
    </ThirdwebV4Provider>
  );
}

(Wrapper as any).getLayout = function getLayout(page: any) {
  return <MainLayout>{page}</MainLayout>;
};

type Params = {
  site?: string;
  address?: string;
  network?: string;
};

export const getStaticProps = async ({
  params,
}: GetStaticPropsContext<Params>) => {
  if (params !== undefined) {
    const { address, network, site } = params;

    const configResponse = await getAppConfig(site, 'home');

    const queryClient = new QueryClient();

    return {
      props: { dehydratedState: dehydrate(queryClient), ...configResponse },
      revalidate: REVALIDATE_PAGE_TIME,
    };
  }
};

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking', // false or 'blocking'
  };
}
