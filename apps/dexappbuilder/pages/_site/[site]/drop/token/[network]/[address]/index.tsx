import {
    ThirdwebSDKProvider,
    useContract,
    useContractMetadata,
} from '@thirdweb-dev/react';
import { useRouter } from 'next/router';

import { getChainIdFromSlug } from '@dexkit/core/utils/blockchain';
import TokenDropSection from '@dexkit/dexappbuilder-viewer/components/sections/TokenDropSection';
import { PageHeader } from '@dexkit/ui/components/PageHeader';
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import { Container, Grid, Skeleton } from '@mui/material';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { GetStaticPropsContext } from 'next';
import { FormattedMessage } from 'react-intl';
import MainLayout from 'src/components/layouts/main';
import { REVALIDATE_PAGE_TIME, THIRDWEB_CLIENT_ID } from 'src/constants';
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
                  <FormattedMessage
                    id="token.drop"
                    defaultMessage="Token Drop"
                  />
                ),
                uri: '/drop/token',
              },
              {
                caption: isLoading ? <Skeleton /> : contractMetadata?.name,
                uri: `/drop/token/${network}/${address}`,
                active: true,
              },
            ]}
          />
        </Container>
      </Grid>
      <Grid item xs={12}>
        <TokenDropSection
          section={{
            type: 'token-drop',
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
  const { provider } = useWeb3React();
  const router = useRouter();
  const { network } = router.query;

  return (
    <ThirdwebSDKProvider
      clientId={THIRDWEB_CLIENT_ID}
      activeChain={getChainIdFromSlug(network as string)?.chainId}
      signer={provider?.getSigner()}
    >
      <TokenDrop />
    </ThirdwebSDKProvider>
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
