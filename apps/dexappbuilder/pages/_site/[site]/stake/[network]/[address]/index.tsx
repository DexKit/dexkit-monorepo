import { getChainIdFromSlug } from '@dexkit/core/utils/blockchain';
import StakeErc1155Section from '@dexkit/dexappbuilder-viewer/components/sections/StakeErc1155Section';
import StakeErc20Section from '@dexkit/dexappbuilder-viewer/components/sections/StakeErc20Section';
import StakeErc721Section from '@dexkit/dexappbuilder-viewer/components/sections/StakeErc721Section';
import { PageHeader } from '@dexkit/ui/components/PageHeader';
import { hexToString } from '@dexkit/ui/utils';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import { Box, Container, Grid, Skeleton } from '@mui/material';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import {
  ThirdwebSDKProvider,
  useContract,
  useContractMetadata,
  useContractRead,
} from '@thirdweb-dev/react';
import { GetStaticPropsContext } from 'next';
import { useRouter } from 'next/router';
import { FormattedMessage } from 'react-intl';
import MainLayout from 'src/components/layouts/main';
import { REVALIDATE_PAGE_TIME, THIRDWEB_CLIENT_ID } from 'src/constants';
import { getAppConfig } from 'src/services/app';

export function StakePage() {
  const { query } = useRouter();

  const { address, network } = query;

  const { data: contract } = useContract(address as string);
  const contractRead = useContractRead(contract, 'contractType');
  const { data: metadata, isLoading } = useContractMetadata(contract);

  let contractType = hexToString(contractRead.data);

  if (!contractType) {
    return null;
  }

  const renderSection = () => {
    if (contractType === 'NFTStake') {
      return (
        <StakeErc721Section
          section={{
            type: 'nft-stake',
            settings: {
              address: address as string,
              network: network as string,
            },
          }}
        />
      );
    }

    if (contractType === 'EditionStake') {
      return (
        <StakeErc1155Section
          section={{
            type: 'edition-stake',
            settings: {
              address: address as string,
              network: network as string,
            },
          }}
        />
      );
    }

    return (
      <StakeErc20Section
        section={{
          type: 'token-stake',
          settings: { address: address as string, network: network as string },
        }}
      />
    );
  };

  return (
    <Container>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} sm={3} lg={4}>
          <Box mb={2}>
            <PageHeader
              breadcrumbs={[
                {
                  caption: <FormattedMessage id="home" defaultMessage="Home" />,
                  uri: '/',
                },
                /*  {
                  caption: (
                    <FormattedMessage id="stake" defaultMessage="Stake" />
                  ),
                  uri: '/stake',
                },*/
                {
                  caption: isLoading ? <Skeleton /> : metadata?.name,
                  uri: `/stake/${network}/${address}`,
                  active: true,
                },
              ]}
            />
          </Box>
          {renderSection()}
        </Grid>
      </Grid>
    </Container>
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
      <StakePage />
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
