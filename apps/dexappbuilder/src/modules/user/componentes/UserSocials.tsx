import { Divider } from '@mui/material';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { signIn, useSession } from 'next-auth/react';
import { useEffect, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

import { useAuth } from '@dexkit/ui/hooks/auth';
import { useAuthUserQuery } from '../hooks';

interface Props {
  credentials?: { provider: string; username: string }[];
}

export function UserSocials({ credentials }: Props) {
  const { isLoggedIn } = useAuth();
  const { status, data } = useSession();
  const userQuery = useAuthUserQuery();

  const twitterUsername = useMemo(() => {
    if (credentials) {
      const cred = credentials.find((c) => c.provider === 'twitter');
      if (cred) {
        return cred.username;
      }
    }
  }, [credentials]);
  const discordUsername = useMemo(() => {
    if (credentials) {
      const cred = credentials.find((c) => c.provider === 'discord');
      if (cred) {
        return cred.username;
      }
    }
  }, [credentials]);

  useEffect(() => {
    if (status === 'authenticated' && isLoggedIn) {
      if (
        data.user?.name === twitterUsername ||
        data.user?.name === discordUsername
      ) {
        return;
      }
      if (
        data.user?.name !== twitterUsername ||
        data.user?.name !== discordUsername
      ) {
        fetch('/api/dex-auth/verify-provider').then((r) => {
          if (r.status === 200) {
            userQuery.refetch();
          }
        });
      }
    }
  }, [status, data, twitterUsername, discordUsername, isLoggedIn]);

  return (
    <>
      <Typography variant="h5">
        <FormattedMessage id={'socials'} defaultMessage={'Socials'} />
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {twitterUsername && (
            <Typography>
              {' '}
              <FormattedMessage
                id="twitter.username"
                defaultMessage={'Twitter username'}
              />
              : <b>{twitterUsername || ''}</b>
            </Typography>
          )}
        </Grid>
        {discordUsername && (
          <Grid item xs={12}>
            <Typography>
              {' '}
              <FormattedMessage
                id="discord.username"
                defaultMessage={'Discord username'}
              />
              : <b>{discordUsername || ''}</b>
            </Typography>
          </Grid>
        )}
        {(twitterUsername || discordUsername) && (
          <Grid item xs={12}>
            <Divider />
          </Grid>
        )}

        {!twitterUsername && (
          <Grid item>
            <Button
              variant={'contained'}
              onClick={async () => {
                signIn('twitter');
              }}
            >
              <FormattedMessage
                id="connect.twitter"
                defaultMessage={'Connect Twitter'}
              />
            </Button>
          </Grid>
        )}
        {!discordUsername && (
          <Grid item>
            <Button
              variant={'contained'}
              onClick={async () => {
                signIn('discord');
              }}
            >
              <FormattedMessage
                id="connect.discord"
                defaultMessage={'Connect Discord'}
              />
            </Button>
          </Grid>
        )}
      </Grid>
    </>
  );
}
