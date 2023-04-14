import {
  Container,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { PageHeader } from 'src/components/PageHeader';
import { UserAirdrop } from '../UserAirdrop';

export function UserAirdropContainer() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <>
      <Container maxWidth={'xl'}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Stack
              direction="row"
              alignItems="center"
              alignContent="center"
              justifyContent="space-between"
            >
              <PageHeader
                breadcrumbs={[
                  {
                    caption: (
                      <FormattedMessage id="home" defaultMessage="Home" />
                    ),
                    uri: '/',
                  },
                  {
                    caption: (
                      <FormattedMessage
                        id="kit.airdrop"
                        defaultMessage="KIT Airdrop"
                      />
                    ),
                    uri: '/u/airdrop',
                    active: true,
                  },
                ]}
              />
            </Stack>
          </Grid>

          {!isMobile && (
            <Grid item xs={12} sm={12}>
              <Stack direction={'row'} justifyContent={'space-between'}>
                <Typography variant="h5">
                  <FormattedMessage
                    id="kit.airdrop"
                    defaultMessage="KIT Airdrop"
                  />
                </Typography>
              </Stack>
            </Grid>
          )}

          <Grid item xs={12} sm={12}>
            <UserAirdrop />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
