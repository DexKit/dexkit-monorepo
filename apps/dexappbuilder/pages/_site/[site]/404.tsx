import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Button, Container, Grid, Typography } from '@mui/material';
import type { GetStaticProps, GetStaticPropsContext, NextPage } from 'next';

import Image from 'next/image';

import { FormattedMessage } from 'react-intl';
import MainLayout from 'src/components/layouts/main';

import Link from '@dexkit/ui/components/AppLink';
import { getAppConfig } from 'src/services/app';
import catHeroImg from '../../../public/assets/images/cat-hero.svg';

const NotFound: NextPage = () => {
  return (
    <MainLayout>
      <Box sx={{ py: 8 }}>
        <Container>
          <Grid container alignItems="center" spacing={4}>
            <Grid
              item
              xs={12}
              sm={6}
              sx={{
                order: { xs: 2, sm: 1 },
              }}
            >
              <Typography
                sx={{ textAlign: { sm: 'left', xs: 'center' } }}
                variant="body1"
                color="primary"
              >
                <FormattedMessage
                  id="oop.page.not.found"
                  defaultMessage="Oops, page not found"
                />
              </Typography>
              <Typography
                sx={{ textAlign: { sm: 'left', xs: 'center' } }}
                variant="h1"
                component="h1"
              >
                <FormattedMessage id="error.404" defaultMessage="Error 404" />
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: { xs: 'center', sm: 'flex-start' },
                  pt: { xs: 2, sm: 0 },
                }}
              >
                <Button
                  component={Link}
                  href="/"
                  startIcon={<ArrowBackIcon />}
                  variant="contained"
                  color="primary"
                >
                  <FormattedMessage
                    id="back.to.home"
                    defaultMessage="Back to Home"
                  />
                </Button>
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              sx={{
                order: { xs: 1, sm: 2 },
              }}
            >
              <Image
                src={catHeroImg}
                alt="Cat Hero"
                style={{
                  width: '100%',
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </MainLayout>
  );
};

type Params = {
  site?: string;
};

export const getStaticProps: GetStaticProps = async ({
  params,
}: GetStaticPropsContext<Params>) => {
  const configResponse = await getAppConfig(params?.site);

  return {
    props: {
      ...configResponse,
    },
    revalidate: 300,
  };
};

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking', // false or 'blocking'
  };
}

export default NotFound;
