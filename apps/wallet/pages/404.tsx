import MainLayout from '@dexkit/ui/components/layouts/main';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Button, Container, Typography } from '@mui/material';
import type { NextPage } from 'next';

import Image from 'next/image';

import Link from '@dexkit/ui/components/AppLink';
import { FormattedMessage } from 'react-intl';
import catHeroImg from '../public/assets/images/cat-hero.svg';

const NotFound: NextPage = (props: any) => {
  return (
    <MainLayout>
      <Box sx={{ py: 8 }}>
        <Container>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
              gap: 4,
            }}
          >
            <Box
              sx={{
                flex: 1,
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
            </Box>
            <Box
              sx={{
                flex: 1,
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
            </Box>
          </Box>
        </Container>
      </Box>
    </MainLayout>
  );
};

export default NotFound;
