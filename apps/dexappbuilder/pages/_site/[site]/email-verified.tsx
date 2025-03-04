import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Button, Container, Grid, Typography } from '@mui/material';
import type { NextPage } from 'next';

import Link from '@dexkit/ui/components/AppLink';
import Image from 'next/image';
import { FormattedMessage } from 'react-intl';
import MainLayout from 'src/components/layouts/main';
import catHeroImg from '../../../public/assets/images/cat-hero.svg';

const EmailVerifiedPage: NextPage = (props: any) => {
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
                  id="email.verified.with.success"
                  defaultMessage="Email verified with success"
                />
              </Typography>
              <Typography
                sx={{ textAlign: { sm: 'left', xs: 'center' } }}
                variant="h1"
                component="h1"
              >
                <FormattedMessage
                  id="email.verified"
                  defaultMessage="Email verified"
                />
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
              <Image src={catHeroImg} alt="Cat Hero" />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </MainLayout>
  );
};

export default EmailVerifiedPage;
