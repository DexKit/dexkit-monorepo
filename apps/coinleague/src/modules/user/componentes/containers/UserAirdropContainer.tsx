import { PageHeader } from '@dexkit/ui/components/PageHeader';
import {
  Container,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { FormattedMessage } from 'react-intl';
import { UserAirdrop } from '../UserAirdrop';

export function UserAirdropContainer() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <>
      <Container maxWidth={'xl'}>
        <Grid container spacing={2}>
          <Grid size={12}>
            <Stack
              direction="row"
              alignItems="center"
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
            <Grid size={12}>
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

          <Grid size={12}>
            <UserAirdrop />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}


