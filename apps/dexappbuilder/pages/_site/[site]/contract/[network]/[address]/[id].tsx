import ContractNftItemContainer from '@/modules/contract-wizard/components/containers/ContractNftItemContainer';
import ThirdwebV4Provider from '@/modules/contract-wizard/provider/ThirdwebV4Provider';
import Container from '@mui/material/Container';
import { GetStaticProps, GetStaticPropsContext } from 'next';
import { useRouter } from 'next/router';
import AuthMainLayout from 'src/components/layouts/authMain';
import { REVALIDATE_PAGE_TIME } from 'src/constants';
import { getAppConfig } from 'src/services/app';

export default function ContractPage() {
  const { query } = useRouter();

  const { address, network, id } = query;

  return (
    <ThirdwebV4Provider network={network as string}>
      <Container>
        <ContractNftItemContainer
          address={address as string}
          network={network as string}
          tokenId={id as string}
        />
      </Container>
    </ThirdwebV4Provider>
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
