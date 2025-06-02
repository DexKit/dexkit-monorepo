import ContractNftItemContainer from '@/modules/contract-wizard/components/containers/ContractNftItemContainer';
import { NETWORK_FROM_SLUG } from '@dexkit/core/constants/networks';
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import Container from '@mui/material/Container';
import { ThirdwebSDKProvider } from '@thirdweb-dev/react';
import { GetStaticProps, GetStaticPropsContext } from 'next';
import { useRouter } from 'next/router';
import AuthMainLayout from 'src/components/layouts/authMain';
import { REVALIDATE_PAGE_TIME, THIRDWEB_CLIENT_ID } from 'src/constants';
import { getAppConfig } from 'src/services/app';

export default function ContractPage() {
  const { query } = useRouter();

  const { address, network, id } = query;

  const { provider } = useWeb3React();

  return (
    <ThirdwebSDKProvider
      clientId={THIRDWEB_CLIENT_ID}
      activeChain={NETWORK_FROM_SLUG(network as string)?.chainId}
      signer={provider?.getSigner()}
    >
      <Container>
        <ContractNftItemContainer
          address={address as string}
          network={network as string}
          tokenId={id as string}
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
