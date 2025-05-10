import { Box, Container, Grid, Typography } from '@mui/material';
import type { NextPage } from 'next';

import Image from 'next/image';

import { FormattedMessage } from 'react-intl';
import catHeroImg from '../public/assets/images/cat-hero.svg';

const Empty: NextPage = (props: any) => {
  return (
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
  );
};

export default Empty;
