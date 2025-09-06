import { Box, Container, Grid, NoSsr, Typography } from '@mui/material';
import type { NextPage } from 'next';

import Image from 'next/image';

import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import MainLayout from 'src/components/layouts/main';
import catHeroImg from '../public/assets/images/cat-hero.svg';

const Empty: NextPage = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

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
                <NoSsr>
                  <FormattedMessage
                    id="oop.page.not.found"
                    defaultMessage="Oops, page not found"
                  />
                </NoSsr>
              </Typography>
              <Typography
                sx={{ textAlign: { sm: 'left', xs: 'center' } }}
                variant="h1"
                component="h1"
              >
                <NoSsr>
                  <FormattedMessage id="error.404" defaultMessage="Error 404" />
                </NoSsr>
              </Typography>
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

export default Empty;

export async function getServerSideProps() {
  return {
    props: {},
  };
}
