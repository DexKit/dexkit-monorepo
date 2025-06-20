import { ContractContainer } from '@/modules/contract-wizard/components/containers/ContractContainer';
import ThirdwebV4Provider from '@/modules/contract-wizard/provider/ThirdwebV4Provider';
import { useMediaQuery, useTheme } from '@mui/material';
import Container from '@mui/material/Container';
import { GetStaticProps, GetStaticPropsContext } from 'next';
import { useRouter } from 'next/router';
import AuthMainLayout from 'src/components/layouts/authMain';
import { REVALIDATE_PAGE_TIME } from 'src/constants';
import { getAppConfig } from 'src/services/app';

export default function ContractPage() {
  const { query } = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { address, network } = query;

  return (
    <ThirdwebV4Provider network={network as string}>
      <Container
        maxWidth="xl"
        disableGutters={isMobile}
        sx={{
          px: isMobile ? 1 : 3,
          py: isMobile ? 1 : 2,
        }}
      >
        <ContractContainer
          address={address as string}
          network={network as string}
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
