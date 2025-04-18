import { PageHeader } from '@dexkit/ui/components/PageHeader';
import { Box, Button, Container, Grid, Stack, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';

import { useAuth, useLoginAccountMutation } from '@dexkit/ui/hooks/auth';
import { useAuthUserQuery } from '../../hooks';
export function UserLoginContainer() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const userQuery = useAuthUserQuery();
  const user = userQuery.data;

  const loginMutation = useLoginAccountMutation();
  useEffect(() => {
    if (isLoggedIn && user?.username && userQuery.isFetched) {
      router.push('/u/edit');
    }

    if (isLoggedIn && !user?.username && userQuery.isFetched) {
      router.push('/u/create-profile');
    }
  }, [isLoggedIn, user, userQuery.isFetched]);

  const handleLogin = async () => {
    await loginMutation.mutateAsync();
    userQuery.refetch();
  };

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
                        id="user.login"
                        defaultMessage="User login"
                      />
                    ),
                    uri: `/u/login`,
                  },
                ]}
              />
            </Stack>
          </Grid>

          <Grid item xs={12} sm={12}>
            <Stack direction={'row'} justifyContent={'space-between'}></Stack>
          </Grid>
          <Grid item xs={12} sm={12}>
            <Stack spacing={2} alignContent={'center'} alignItems={'center'}>
              <Typography variant="h5">
                <FormattedMessage id="login.app" defaultMessage="Login app" />
              </Typography>
              <Typography variant="body1">
                <FormattedMessage
                  id="login.app.to.edit.your.user.profile.you.just.need.to.sign.a.message.with.your.wallet"
                  defaultMessage="Login to app to edit your user profile. You just need to sign a message with your wallet"
                />
              </Typography>
              <Box
                justifyContent={'center'}
                alignContent={'center'}
                alignItems={'center'}
              >
                <Button
                  variant={'contained'}
                  disabled={loginMutation.isLoading}
                  startIcon={
                    loginMutation.isLoading && (
                      <CircularProgress></CircularProgress>
                    )
                  }
                  onClick={handleLogin}
                >
                  {loginMutation.isLoading ? (
                    <FormattedMessage
                      id={'sign.message'}
                      defaultMessage={'sign.message'}
                    />
                  ) : (
                    <FormattedMessage id={'login'} defaultMessage={'Login'} />
                  )}
                </Button>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
