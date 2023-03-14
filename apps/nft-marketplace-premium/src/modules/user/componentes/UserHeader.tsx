import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import Box from '@mui/material/Box';

import { useTheme } from '@mui/material';
import Image from 'next/image';

interface Props {
  username?: string;
  name?: string;
  profileImageURL?: string;
  backgroundImageURL?: string;
  bio?: string;
  shortBio?: string;
  createdBy?: string;
}

export function UserHeader(props: Props) {
  const { profileImageURL, backgroundImageURL, bio, shortBio, name } = props;
  const theme = useTheme();
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sx={{ backgroundImage: `url(${backgroundImageURL})` }}>
        <Box
          sx={{
            display: 'flex',
            algnItems: 'center',
            alignContent: 'center',
            justifyContent: { xs: 'left', sm: 'left' },
          }}
        >
          {profileImageURL ? (
            <Box
              sx={(theme) => ({
                position: 'relative',
                height: theme.spacing(14),
                width: theme.spacing(14),
                borderRadius: '50%',
                borderWidth: 20,
                borderColor: 'white',
              })}
            >
              <Image
                src={profileImageURL}
                alt={bio}
                height={theme.spacing(14)}
                width={theme.spacing(14)}
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
        </Box>
      </Grid>
      <Grid item xs>
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
          {name}
        </Typography>
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
            {bio}
          </Typography>
        </Grid>
      )}
    </Grid>
  );
}
