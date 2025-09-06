import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Button, Container, Grid, NoSsr, Typography } from '@mui/material';
import type { NextPage } from 'next';

import Image from 'next/image';

import Link from '@dexkit/ui/components/AppLink';
import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import MainLayout from 'src/components/layouts/main';
import catHeroImg from '../public/assets/images/cat-hero.svg';

const EmailVerifiedPage: NextPage = () => {
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
                    id="email.with.success"
                    defaultMessage="Email with success"
                  />
                </NoSsr>
              </Typography>
              <Typography
                sx={{ textAlign: { sm: 'left', xs: 'center' } }}
                variant="h1"
                component="h1"
              >
                <NoSsr>
                  <FormattedMessage id="email.verified" defaultMessage="Email verified" />
                </NoSsr>
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
                  <NoSsr>
                    <FormattedMessage id="back.to.home" defaultMessage="Back to Home" />
                  </NoSsr>
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

export default EmailVerifiedPage;

export async function getServerSideProps() {
  return {
    props: {},
  };
}
