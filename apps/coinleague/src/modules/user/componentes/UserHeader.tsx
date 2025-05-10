import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import Box from '@mui/material/Box';

import { ShareButton } from '@dexkit/ui/components/ShareButton';
import TwitterIcon from '@mui/icons-material/Twitter';
import Verified from '@mui/icons-material/Verified';
import { IconButton, Stack, Tooltip, useTheme } from '@mui/material';
import Image from 'next/image';
import { FormattedMessage } from 'react-intl';

interface Props {
  username?: string;
  name?: string;
  twitterVerified?: boolean;
  discordVerified?: boolean;
  profileImageURL?: string;
  backgroundImageURL?: string;
  bio?: string;
  shortBio?: string;
  createdBy?: string;
  twitterUsername?: string;
}

export function UserHeader(props: Props) {
  const {
    profileImageURL,
    backgroundImageURL,
    bio,
    shortBio,
    username,
    twitterVerified,
    discordVerified,
  } = props;
  const theme = useTheme();

  return (
    <Grid container spacing={2}>
      <Grid
        item
        xs={12}
        sx={(theme) => ({
          height: theme.spacing(20),
          position: 'relative',
          backgroundImage: `url(${backgroundImageURL})`,
        })}
      >
        {profileImageURL ? (
          <Box
            sx={(theme) => ({
              position: 'absolute',
              bottom: theme.spacing(-2),
              left: theme.spacing(3),
            })}
          >
            <Image
              src={profileImageURL}
              alt={bio || ' '}
              width={14 * 8}
              height={14 * 8}
            />
          </Box>
        ) : (
          <Avatar
            sx={(theme) => ({
              height: theme.spacing(14),
              width: theme.spacing(14),
            })}
          />
        )}
      </Grid>
      <Grid item xs>
        <Stack
          direction={'row'}
          alignItems={'center'}
          justifyContent={'space-between'}
        >
          <Box display={'flex'} alignItems={'center'}>
            <Typography
              sx={{
                display: 'block',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                textAlign: { xs: 'center', sm: 'left' },
              }}
              variant="h5"
              component="h1"
            >
              {username}
            </Typography>
            {discordVerified ||
              (twitterVerified && (
                <Tooltip
                  title={
                    <FormattedMessage
                      id={'user.verified.social'}
                      defaultMessage={'Verified in: {discord} {twitter}'}
                      values={{
                        discord: discordVerified ? 'Discord' : '',
                        twitter: twitterVerified ? 'Twitter' : '',
                      }}
                    />
                  }
                >
                  <IconButton color={'primary'}>
                    <Verified />
                  </IconButton>
                </Tooltip>
              ))}
          </Box>
          <ShareButton />
        </Stack>
      </Grid>
      {shortBio && (
        <Grid item xs={12}>
          <Typography
            sx={{
              display: 'block',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              textAlign: { xs: 'center', sm: 'left' },
            }}
            variant="body1"
            component="p"
          >
            {shortBio}
          </Typography>
        </Grid>
      )}

      {bio && (
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="space-between">
            <Typography
              sx={{
                display: 'block',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                textAlign: { xs: 'center', sm: 'left' },
              }}
              variant="caption"
              component="p"
            >
              {bio || ''}
            </Typography>
            {false && (
              <Box>
                <IconButton aria-label="twitter">
                  <TwitterIcon />
                </IconButton>
                <IconButton aria-label="discord">
                  <Image
                    priority
                    src="/assets/icons/discord.svg"
                    height={24}
                    width={24}
                    alt="Discord"
                  />
                </IconButton>
              </Box>
            )}
          </Stack>
        </Grid>
      )}
    </Grid>
  );
}
