import { ContractContainer } from '@/modules/contract-wizard/components/containers/ContractContainer';
import { NETWORK_FROM_SLUG } from '@dexkit/core/constants/networks';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import { useMediaQuery, useTheme } from '@mui/material';
import Container from '@mui/material/Container';
import { ThirdwebSDKProvider } from '@thirdweb-dev/react';
import { ThirdwebStorage } from '@thirdweb-dev/storage';
import { GetStaticProps, GetStaticPropsContext } from 'next';
import { useRouter } from 'next/router';
import AuthMainLayout from 'src/components/layouts/authMain';
import { REVALIDATE_PAGE_TIME, THIRDWEB_CLIENT_ID } from 'src/constants';
import { getAppConfig } from 'src/services/app';

export default function ContractPage() {
  const { query } = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { address, network } = query;

  const { signer } = useWeb3React();

  return (
    <ThirdwebSDKProvider
      clientId={THIRDWEB_CLIENT_ID}
      activeChain={NETWORK_FROM_SLUG(network as string)?.chainId}
      signer={signer}
      storageInterface={new ThirdwebStorage({
        clientId: THIRDWEB_CLIENT_ID,
      })}
    >
      <Container
        maxWidth="xl"
        disableGutters={isMobile}
        sx={{
          px: isMobile ? 1 : 3,
          py: isMobile ? 1 : 2
        }}
      >
        <ContractContainer
          address={address as string}
          network={network as string}
        />
      </Container>
    </ThirdwebSDKProvider>
  );
}

(ContractPage as any).getLayout = function getLayout(page: any) {
  return <AuthMainLayout>{page}</AuthMainLayout>;
};

type Params = {
  site?: string;
};

export const getStaticProps: GetStaticProps = async ({
  params,
}: GetStaticPropsContext<Params>) => {
  if (params !== undefined) {
    const { site } = params;

    const configResponse = await getAppConfig(site, 'home');

    return {
      props: { ...configResponse },
      revalidate: REVALIDATE_PAGE_TIME,
    };
  }

  return {
    props: {},
    revalidate: REVALIDATE_PAGE_TIME,
  };
};

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking', // false or 'blocking'
  };
}
