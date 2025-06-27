import CommerceContextProvider from '@dexkit/ui/modules/commerce/components/CommerceContextProvider';
import CartContent from '@dexkit/ui/modules/commerce/components/CommerceSection/CartContent';
import CommerceUserLayout from '@dexkit/ui/modules/commerce/components/CommerceUserLayout';
import ArrowBack from '@mui/icons-material/ArrowBack';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { GetStaticProps, GetStaticPropsContext } from 'next';
import { useRouter } from 'next/router';
import { FormattedMessage } from 'react-intl';
import AuthMainLayout from 'src/components/layouts/authMain';
import { REVALIDATE_PAGE_TIME } from 'src/constants';
import { getAppConfig } from 'src/services/app';

export default function CommerceCartPage() {
  const router = useRouter();
  return (
    <Container>
      <Stack spacing={2}>
        <Box>
          <Button
            size="small"
            startIcon={<ArrowBack />}
            onClick={() => router.back()}
          >
            <FormattedMessage
              id="continue.shoppging"
              defaultMessage="Continue shopping"
            />
          </Button>
        </Box>
        <Typography variant="h5">
          <FormattedMessage id="cart" defaultMessage="Cart" />
        </Typography>
        <Box>
          <CommerceContextProvider>
            <CartContent disableHeader />
          </CommerceContextProvider>
        </Box>
      </Stack>
    </Container>
  );
}

CommerceCartPage.getLayout = (page: any) => {
  return (
    <AuthMainLayout noSsr>
      <CommerceUserLayout>{page}</CommerceUserLayout>
    </AuthMainLayout>
  );
};

type Params = {
  site?: string;
};

export const getStaticProps: GetStaticProps = async ({
  params,
}: GetStaticPropsContext<Params>) => {
  const configResponse = await getAppConfig(params?.site, 'home');

  return {
    props: {
      ...configResponse,
    },
    revalidate: REVALIDATE_PAGE_TIME,
  };
};

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking', // false or 'blocking'
  };
}
