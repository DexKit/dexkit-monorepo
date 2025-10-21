import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Button, Container, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import type { NextPage } from 'next';

import Image from 'next/image';

import { FormattedMessage } from 'react-intl';

import Link from '@dexkit/ui/components/AppLink';
import catHeroImg from '../../../../public/assets/images/cat-hero.svg';

const UserNotFound: NextPage = (props: any) => {
  return (
    <Box sx={{ py: 8 }}>
      <Container>
        <Grid container alignItems="center" spacing={4}>
          <Grid
            size={{ xs: 12, sm: 6 }}
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
                id="no.user.with.this.name"
                defaultMessage="No user with this name"
              />
            </Typography>
            <Typography
              sx={{ textAlign: { sm: 'left', xs: 'center' } }}
              variant="h1"
              component="h1"
            >
              <FormattedMessage
                id="user.not.found"
                defaultMessage="User not found"
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
            size={{ xs: 12, sm: 6 }}
            sx={{
              order: { xs: 1, sm: 2 },
            }}
          >
            <Image src={catHeroImg} alt="Cat Hero" />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default UserNotFound;

